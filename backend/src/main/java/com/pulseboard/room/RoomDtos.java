package com.pulseboard.room;

import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.constraints.*;
import java.util.Map;

public final class RoomDtos {
    private RoomDtos() {}

    public record CreateRoomRequest(
            @NotBlank(message = "Question is required")
            @Size(max = 300, message = "Question must be 300 characters or fewer")
            String question) {}

    public record VoteRequest(
            @NotBlank(message = "Nickname is required")
            @Size(max = 30, message = "Nickname must be 30 characters or fewer")
            String nickname,
            @Min(value = 1, message = "Score must be between 1 and 5")
            @Max(value = 5, message = "Score must be between 1 and 5")
            int score) {}

    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record RoomResponse(
            String code,
            String question,
            boolean closed,
            int total,
            double average,
            Map<Integer, Long> counts,
            String hostKey) {}
}
