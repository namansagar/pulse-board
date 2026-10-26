package com.pulseboard.room;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "rooms")
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 8)
    private String code;

    @Column(nullable = false, length = 300)
    private String question;

    @Column(nullable = false)
    private String hostKey;

    @Column(nullable = false)
    private boolean closed = false;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();

    public Long getId() { return id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getHostKey() { return hostKey; }
    public void setHostKey(String hostKey) { this.hostKey = hostKey; }
    public boolean isClosed() { return closed; }
    public void setClosed(boolean closed) { this.closed = closed; }
    public Instant getCreatedAt() { return createdAt; }
}
