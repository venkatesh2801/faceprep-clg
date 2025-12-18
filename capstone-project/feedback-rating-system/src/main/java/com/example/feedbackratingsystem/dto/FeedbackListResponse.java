package com.example.feedbackratingsystem.dto;

import com.example.feedbackratingsystem.model.Feedback;

public class FeedbackListResponse {

    private Long id;
    private String comment;
    private int rating;

    public FeedbackListResponse(Feedback feedback) {
        this.id = feedback.getId();
        this.comment = feedback.getComment();
        this.rating = feedback.getRating();
    }

    public Long getId() { return id; }
    public String getComment() { return comment; }
    public int getRating() { return rating; }
}
