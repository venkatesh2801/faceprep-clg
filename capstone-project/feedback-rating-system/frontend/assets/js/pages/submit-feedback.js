document.addEventListener("DOMContentLoaded", initSubmitFeedback);

let selectedRating = 0;

function initSubmitFeedback() {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Check if user is a provider (providers can't submit feedback)
    if (userRole === "PROVIDER") {
        showAlert(
            "Access Restricted", 
            "Providers cannot submit feedback. Only regular users can submit feedback to providers.",
            "warning"
        ).then(() => {
            window.location.href = "provider-dashboard.html";
        });
        return;
    }

    loadProviders();
    setupStarRating();
}

async function loadProviders() {
    const token = localStorage.getItem("token");
    const select = document.getElementById("providerId");

    try {
        const response = await fetch("http://localhost:8080/api/users/providers", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            select.innerHTML = '<option value="">No providers available</option>';
            return;
        }

        const providers = await response.json();
        
        if (providers.length === 0) {
            select.innerHTML = '<option value="">No providers available</option>';
            return;
        }

        select.innerHTML = '<option value="">Select a provider</option>';
        
        providers.forEach(provider => {
            const option = document.createElement("option");
            option.value = provider.id;
            option.textContent = provider.name;
            select.appendChild(option);
        });

    } catch (error) {
        console.error("Error loading providers:", error);
        select.innerHTML = '<option value="">Could not load providers</option>';
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

async function submitFeedback() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const providerId = document.getElementById("providerId").value;
    const comment = document.getElementById("comment").value.trim();
    const rating = selectedRating;

    if (!providerId) {
        showAlert("Missing Provider", "Please select a provider", "warning");
        return;
    }

    if (rating === 0) {
        showAlert("Missing Rating", "Please select a rating (1-5 stars)", "warning");
        return;
    }

    if (!comment) {
        showAlert("Missing Feedback", "Please enter your feedback comment", "warning");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/feedback", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userId: parseInt(userId),
                providerId: parseInt(providerId),
                rating: rating,
                comment: comment
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || "Failed to submit feedback");
        }

        await showAlert("Success!", "Your feedback has been submitted successfully.", "success");
        window.location.href = "dashboard.html";

    } catch (error) {
        showAlert("Submission Failed", error.message, "error");
    }
}

function goBack() {
    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
