package com.example.feedbackratingsystem.service;

import com.example.feedbackratingsystem.dto.FeedbackRequest;
import com.example.feedbackratingsystem.dto.UpdateFeedbackRequest;
import com.example.feedbackratingsystem.model.Feedback;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedbackService {

    Feedback submitFeedback(FeedbackRequest request);

    List<Feedback> getFeedbackForProvider(Long providerId);

    List<Feedback> getFeedbackByUser(Long userId);

    Feedback getFeedbackById(Long id);

    Feedback updateFeedback(Long id, UpdateFeedbackRequest request);

    void deleteFeedback(Long id);

    Double getAverageRating(Long providerId);

    List<Feedback> search(String keyword);

    List<Feedback> filterByRating(int min, int max);

    List<Feedback> filterByDate(LocalDateTime start, LocalDateTime end);

    List<Feedback> getAllFeedback();
}
