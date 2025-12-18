package com.example.feedbackratingsystem.service.impl;

import com.example.feedbackratingsystem.dto.FeedbackRequest;
import com.example.feedbackratingsystem.dto.UpdateFeedbackRequest;
import com.example.feedbackratingsystem.model.Feedback;
import com.example.feedbackratingsystem.model.User;
import com.example.feedbackratingsystem.repository.FeedbackRepository;
import com.example.feedbackratingsystem.repository.UserRepository;
import com.example.feedbackratingsystem.service.FeedbackService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class FeedbackServiceImpl implements FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    public FeedbackServiceImpl(FeedbackRepository feedbackRepository, UserRepository userRepository) {
        this.feedbackRepository = feedbackRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Feedback submitFeedback(FeedbackRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        User provider = userRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Provider not found"));

        // Prevent self-feedback
        if (user.getId().equals(provider.getId())) {
            throw new RuntimeException("You cannot give feedback to yourself");
        }

        // Check if user is a provider (providers shouldn't give feedback)
        boolean isProvider = user.getRoles().stream()
                .anyMatch(role -> role.getName().equals("PROVIDER"));
        if (isProvider) {
            throw new RuntimeException("Providers cannot submit feedback. Only users can submit feedback.");
        }

        Feedback feedback = new Feedback();
        feedback.setComment(request.getComment());
        feedback.setRating(request.getRating());
        feedback.setUser(user);
        feedback.setProvider(provider);
        feedback.setCreatedAt(LocalDateTime.now());

        return feedbackRepository.save(feedback);
    }

    @Override
    public List<Feedback> getFeedbackForProvider(Long providerId) {
        return feedbackRepository.findByProviderId(providerId);
    }

    @Override
    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findByUserId(userId);
    }

    @Override
    public Feedback getFeedbackById(Long id) {
        return feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    @Override
    public Feedback updateFeedback(Long id, UpdateFeedbackRequest request) {

        Feedback feedback = feedbackRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));

        feedback.setComment(request.getComment());
        feedback.setRating(request.getRating());
        feedback.setUpdatedAt(LocalDateTime.now()); // NEW

        return feedbackRepository.save(feedback);
    }


    @Override
    public void deleteFeedback(Long id) {
        if (!feedbackRepository.existsById(id)) {
            throw new RuntimeException("Feedback not found");
        }
        feedbackRepository.deleteById(id);
    }

    @Override
    public Double getAverageRating(Long providerId) {
        return feedbackRepository.getAverageRating(providerId);
    }

    @Override
    public List<Feedback> search(String keyword) {
        return feedbackRepository.searchByComment(keyword);
    }

    @Override
    public List<Feedback> filterByRating(int min, int max) {
        return feedbackRepository.filterByRating(min, max);
    }

    @Override
    public List<Feedback> filterByDate(LocalDateTime start, LocalDateTime end) {
        return feedbackRepository.filterByDateRange(start, end);
    }

    @Override
    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }
}
