package com.pulseboard.vote;

import com.pulseboard.room.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface VoteRepository extends JpaRepository<Vote, Long> {
    List<Vote> findByRoom(Room room);
    Optional<Vote> findByRoomAndNicknameIgnoreCase(Room room, String nickname);
}
