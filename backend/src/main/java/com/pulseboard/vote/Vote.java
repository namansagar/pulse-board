package com.pulseboard.vote;

import com.pulseboard.room.Room;
import jakarta.persistence.*;

@Entity
@Table(name = "votes",
       uniqueConstraints = @UniqueConstraint(columnNames = {"room_id", "nickname"}))
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Column(nullable = false, length = 30)
    private String nickname;

    @Column(nullable = false)
    private int score;

    public Long getId() { return id; }
    public Room getRoom() { return room; }
    public void setRoom(Room room) { this.room = room; }
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
}
