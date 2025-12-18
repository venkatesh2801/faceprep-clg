package com.example.feedbackratingsystem.controller;

import com.example.feedbackratingsystem.dto.FeedbackRequest;
import com.example.feedbackratingsystem.dto.UpdateFeedbackRequest;
import com.example.feedbackratingsystem.model.Feedback;
import com.example.feedbackratingsystem.service.FeedbackService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    private final FeedbackService feedbackService;

    public FeedbackController(FeedbackService feedbackService) {
        this.feedbackService = feedbackService;
    }

    // -----------------------------
    // Submit Feedback
    // -----------------------------
    @PostMapping
    public ResponseEntity<Feedback> submitFeedback(@RequestBody FeedbackRequest request) {
        return ResponseEntity.ok(feedbackService.submitFeedback(request));
    }

    // -----------------------------
    // Get Feedback by ID
    // -----------------------------
    @GetMapping("/{id}")
    public ResponseEntity<Feedback> getFeedbackById(@PathVariable Long id) {
        return ResponseEntity.ok(feedbackService.getFeedbackById(id));
    }

    // -----------------------------
    // Get All Feedback for Provider
    // -----------------------------
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Feedback>> getFeedbackForProvider(@PathVariable Long providerId) {
        return ResponseEntity.ok(feedbackService.getFeedbackForProvider(providerId));
    }

    // -----------------------------
    // Get Feedback by User
    // -----------------------------
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Feedback>> getFeedbackByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(feedbackService.getFeedbackByUser(userId));
    }

    // -----------------------------
    // Update Feedback
    // -----------------------------
    @PutMapping("/{id}")
    public ResponseEntity<Feedback> updateFeedback(
            @PathVariable Long id,
            @RequestBody UpdateFeedbackRequest request
    ) {
        return ResponseEntity.ok(feedbackService.updateFeedback(id, request));
    }

    // -----------------------------
    // Delete Feedback
    // -----------------------------
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return ResponseEntity.ok("Feedback deleted successfully");
    }

    // -----------------------------
    // Average Rating
    // -----------------------------
    @GetMapping("/provider/{providerId}/average")
    public ResponseEntity<Double> getAverageRating(@PathVariable Long providerId) {
        return ResponseEntity.ok(feedbackService.getAverageRating(providerId));
    }

    // -----------------------------
    // Search Feedback by keyword
    // -----------------------------
    @GetMapping("/search")
    public ResponseEntity<List<Feedback>> searchFeedback(@RequestParam String keyword) {
        return ResponseEntity.ok(feedbackService.search(keyword));
    }

    // -----------------------------
    // Filter by Rating Range
    // -----------------------------
    @GetMapping("/filter-by-rating")
    public ResponseEntity<List<Feedback>> filterByRating(
            @RequestParam int min,
            @RequestParam int max
    ) {
        return ResponseEntity.ok(feedbackService.filterByRating(min, max));
    }

    // -----------------------------
    // Filter by Date Range
    // -----------------------------
    @GetMapping("/filter-by-date")
    public ResponseEntity<List<Feedback>> filterByDate(
            @RequestParam String from,
            @RequestParam String to
    ) {
        return ResponseEntity.ok(
                feedbackService.filterByDate(
                        LocalDateTime.parse(from),
                        LocalDateTime.parse(to)
                )
        );
    }

    // -----------------------------
    // Get All Feedback (Admin)
    // -----------------------------
    @GetMapping("/all")
    public ResponseEntity<List<Feedback>> getAllFeedback() {
        return ResponseEntity.ok(feedbackService.getAllFeedback());
    }
}
