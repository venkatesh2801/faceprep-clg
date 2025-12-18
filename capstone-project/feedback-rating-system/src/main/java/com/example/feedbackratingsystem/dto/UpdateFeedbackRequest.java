package com.example.feedbackratingsystem.dto;

import lombok.Data;

@Data
public class UpdateFeedbackRequest {
    private String comment;
    private int rating;
}
