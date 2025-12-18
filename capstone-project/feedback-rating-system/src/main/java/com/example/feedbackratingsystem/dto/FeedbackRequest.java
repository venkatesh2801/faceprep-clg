package com.example.feedbackratingsystem.dto;

import lombok.Data;

@Data
public class FeedbackRequest {
    private Long userId;
    private Long providerId;
    private int rating;
    private String comment;
}
