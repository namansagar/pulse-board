package com.pulseboard.room;

import com.pulseboard.room.RoomDtos.CreateRoomRequest;
import com.pulseboard.room.RoomDtos.RoomResponse;
import com.pulseboard.room.RoomDtos.VoteRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RoomResponse create(@Valid @RequestBody CreateRoomRequest request) {
        return service.create(request.question());
    }

    @GetMapping("/{code}")
    public RoomResponse get(@PathVariable String code) {
        return service.get(code);
    }

    @PostMapping("/{code}/votes")
    public RoomResponse vote(@PathVariable String code, @Valid @RequestBody VoteRequest request) {
        return service.vote(code, request);
    }

    @PostMapping("/{code}/close")
    public RoomResponse close(@PathVariable String code,
                              @RequestHeader(value = "X-Host-Key", required = false) String hostKey) {
        return service.close(code, hostKey);
    }
}
