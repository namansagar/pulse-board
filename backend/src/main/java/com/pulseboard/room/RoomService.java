package com.pulseboard.room;

import com.pulseboard.room.RoomDtos.RoomResponse;
import com.pulseboard.room.RoomDtos.VoteRequest;
import com.pulseboard.vote.Vote;
import com.pulseboard.vote.VoteRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class RoomService {

    private static final String ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private static final int CODE_LENGTH = 5;

    private final SecureRandom random = new SecureRandom();
    private final RoomRepository rooms;
    private final VoteRepository votes;

    public RoomService(RoomRepository rooms, VoteRepository votes) {
        this.rooms = rooms;
        this.votes = votes;
    }

    @Transactional
    public RoomResponse create(String question) {
        Room room = new Room();
        room.setQuestion(question.trim());
        room.setCode(uniqueCode());
        room.setHostKey(UUID.randomUUID().toString());
        rooms.save(room);
        return toResponse(room, true);
    }

    @Transactional(readOnly = true)
    public RoomResponse get(String code) {
        return toResponse(find(code), false);
    }

    @Transactional
    public RoomResponse vote(String code, VoteRequest request) {
        Room room = find(code);
        if (room.isClosed()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Voting is closed for this room");
        }
        String nickname = request.nickname().trim();
        Vote vote = votes.findByRoomAndNicknameIgnoreCase(room, nickname).orElseGet(() -> {
            Vote v = new Vote();
            v.setRoom(room);
            v.setNickname(nickname);
            return v;
        });
        vote.setScore(request.score());
        votes.save(vote);
        return toResponse(room, false);
    }

    @Transactional
    public RoomResponse close(String code, String hostKey) {
        Room room = find(code);
        if (hostKey == null || !room.getHostKey().equals(hostKey)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the host can close this room");
        }
        room.setClosed(true);
        rooms.save(room);
        return toResponse(room, false);
    }

    private Room find(String code) {
        return rooms.findByCode(code.toUpperCase())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Room not found"));
    }

    private String uniqueCode() {
        String code;
        do {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < CODE_LENGTH; i++) {
                sb.append(ALPHABET.charAt(random.nextInt(ALPHABET.length())));
            }
            code = sb.toString();
        } while (rooms.existsByCode(code));
        return code;
    }

    private RoomResponse toResponse(Room room, boolean includeHostKey) {
        List<Vote> all = votes.findByRoom(room);
        Map<Integer, Long> counts = new LinkedHashMap<>();
        for (int i = 1; i <= 5; i++) counts.put(i, 0L);

        int sum = 0;
        for (Vote v : all) {
            counts.merge(v.getScore(), 1L, Long::sum);
            sum += v.getScore();
        }
        double average = all.isEmpty() ? 0 : Math.round((sum * 10.0) / all.size()) / 10.0;

        return new RoomResponse(room.getCode(), room.getQuestion(), room.isClosed(),
                all.size(), average, counts, includeHostKey ? room.getHostKey() : null);
    }
}
