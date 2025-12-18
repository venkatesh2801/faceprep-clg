document.addEventListener("DOMContentLoaded", initEditFeedback);

let selectedRating = 0;
let feedbackId = null;

async function initEditFeedback() {
    const token = localStorage.getItem("token");
    feedbackId = localStorage.getItem("editFeedbackId");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    if (!feedbackId) {
        await showAlert("Error", "No feedback selected to edit", "error");
        window.location.href = "view-feedback.html";
        return;
    }

    setupStarRating();
    await loadFeedback();
}

async function loadFeedback() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/feedback/${feedbackId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to load feedback");
        }

        const feedback = await response.json();
        
        document.getElementById("providerName").value = feedback.provider?.name || "Unknown Provider";
        document.getElementById("comment").value = feedback.comment;
        selectedRating = feedback.rating;
        document.getElementById("rating").value = selectedRating;
        updateStarDisplay();

    } catch (error) {
        await showAlert("Error", error.message, "error");
        window.location.href = "view-feedback.html";
    }
}

function setupStarRating() {
    const stars = document.querySelectorAll(".star-rating .star");
    
    stars.forEach(star => {
        star.addEventListener("click", () => {
            selectedRating = parseInt(star.dataset.value);
            document.getElementById("rating").value = selectedRating;
            updateStarDisplay();
        });

        star.addEventListener("mouseover", () => {
            highlightStars(parseInt(star.dataset.value));
        });

        star.addEventListener("mouseout", () => {
            updateStarDisplay();
        });
    });
}

function highlightStars(count) {
    const stars = document.querySelectorAll(".star-rating .star");
    stars.forEach((star, index) => {
        star.classList.toggle("active", index < count);
    });
}

function updateStarDisplay() {
    highlightStars(selectedRating);
}

async function updateFeedback() {
    const token = localStorage.getItem("token");
    const comment = document.getElementById("comment").value.trim();
    const rating = selectedRating;

    if (rating === 0) {
        showAlert("Missing Rating", "Please select a rating", "warning");
        return;
    }

    if (!comment) {
        showAlert("Missing Feedback", "Please enter your feedback", "warning");
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/feedback/${feedbackId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                rating: rating,
                comment: comment
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to update feedback");
        }

        localStorage.removeItem("editFeedbackId");
        
        await showAlert("Success!", "Your feedback has been updated.", "success");
        window.location.href = "view-feedback.html";

    } catch (error) {
        showAlert("Update Failed", error.message, "error");
    }
}

function goBack() {
    localStorage.removeItem("editFeedbackId");
    window.location.href = "view-feedback.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
