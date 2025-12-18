package com.example.feedbackratingsystem.dto;

import com.example.feedbackratingsystem.model.User;

public class FeedbackResponse {

    private Long id;
    private String comment;
    private int rating;
    private User user;
    private User provider;

    public FeedbackResponse(Long id, String comment, int rating, User user, User provider) {
        this.id = id;
        this.comment = comment;
        this.rating = rating;
        this.user = user;
        this.provider = provider;
    }

    public Long getId() { return id; }
    public String getComment() { return comment; }
    public int getRating() { return rating; }
    public User getUser() { return user; }
    public User getProvider() { return provider; }
}
