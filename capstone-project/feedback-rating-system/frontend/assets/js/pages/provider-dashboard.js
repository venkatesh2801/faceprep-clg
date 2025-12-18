document.addEventListener("DOMContentLoaded", loadProviderDashboard);

async function loadProviderDashboard() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Update provider name
    document.getElementById("providerName").textContent = `Hi, ${userName || "Provider"}`;

    // Load average rating
    try {
        const avg = await getProviderAverageRating(userId, token);
        document.getElementById("avgRating").textContent = avg ? avg.toFixed(1) + " ★" : "N/A";
    } catch (e) {
        document.getElementById("avgRating").textContent = "N/A";
    }

    // Load feedback received
    try {
        const feedback = await getProviderFeedback(userId, token);
        document.getElementById("totalFeedback").textContent = feedback.length;
        renderFeedback(feedback);
    } catch (e) {
        document.getElementById("feedbackContainer").innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">error_outline</span>
                <p>Failed to load feedback. Please try again.</p>
            </div>
        `;
    }
}

function renderFeedback(list) {
    const container = document.getElementById("feedbackContainer");

    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">inbox</span>
                <h3>No Feedback Yet</h3>
                <p>You haven't received any feedback yet. Share your provider ID with users to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    list.forEach(fb => {
        const div = document.createElement("div");
        div.className = "feedback-item";

        const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);
        const date = fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "";

        div.innerHTML = `
            <div class="feedback-header">
                <div>
                    <strong>${fb.user?.name || "Anonymous"}</strong>
                </div>
                <span class="feedback-meta">${date}</span>
            </div>
            <p><span class="rating-display">${stars}</span> (${fb.rating}/5)</p>
            <p>${fb.comment}</p>
        `;

        container.appendChild(div);
    });
}

function goTo(page) {
    window.location.href = page;
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
