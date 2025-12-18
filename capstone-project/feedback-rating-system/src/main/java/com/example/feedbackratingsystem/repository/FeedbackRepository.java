package com.example.feedbackratingsystem.repository;

import com.example.feedbackratingsystem.model.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findByProviderId(Long providerId);

    List<Feedback> findByUserId(Long userId);

    @Query("SELECT AVG(f.rating) FROM Feedback f WHERE f.provider.id = :providerId")
    Double getAverageRating(@Param("providerId") Long providerId);

    // SEARCH BY COMMENT (keyword)
    @Query("SELECT f FROM Feedback f WHERE LOWER(f.comment) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Feedback> searchByComment(@Param("keyword") String keyword);

    // FILTER BY RATING RANGE
    @Query("SELECT f FROM Feedback f WHERE f.rating BETWEEN :min AND :max")
    List<Feedback> filterByRating(@Param("min") int min, @Param("max") int max);

    // DATE RANGE FILTER
    @Query("SELECT f FROM Feedback f WHERE f.createdAt BETWEEN :start AND :end")
    List<Feedback> filterByDateRange(@Param("start") LocalDateTime start,
                                     @Param("end") LocalDateTime end);
}
