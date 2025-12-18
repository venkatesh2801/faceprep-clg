document.addEventListener("DOMContentLoaded", loadUserFeedback);

async function loadUserFeedback() {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    if (!token || !userId) {
        window.location.href = "login.html";
        return;
    }

    const container = document.getElementById("feedbackContainer");

    try {
        const feedback = await getUserFeedback(userId, token);
        renderFeedback(feedback, container);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">error_outline</span>
                <p>Failed to load feedback. Please try again.</p>
            </div>
        `;
    }
}

function renderFeedback(list, container) {
    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">inbox</span>
                <h3>No Feedback Yet</h3>
                <p>You haven't submitted any feedback yet.</p>
                <button class="btn btn-primary mt-3" onclick="goTo('submit-feedback.html')">
                    Submit Your First Feedback
                </button>
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
                    <strong>Provider:</strong> ${fb.provider?.name || "Unknown"}
                </div>
                <span class="feedback-meta">${date}</span>
            </div>
            <p><span class="rating-display">${stars}</span> (${fb.rating}/5)</p>
            <p>${fb.comment}</p>
            <div class="feedback-actions">
                <button class="btn btn-sm btn-secondary" onclick="editFeedback(${fb.id})">
                    <span class="material-icons" style="font-size: 1rem;">edit</span>
                    Edit
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteFeedback(${fb.id})">
                    <span class="material-icons" style="font-size: 1rem;">delete</span>
                    Delete
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

async function deleteFeedback(id) {
    const confirmed = await showConfirm(
        "Delete Feedback",
        "Are you sure you want to delete this feedback? This action cannot be undone.",
        "warning"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/feedback/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error("Failed to delete feedback");
        }

        toastSuccess("Feedback deleted successfully");
        loadUserFeedback();

    } catch (error) {
        toastError(error.message);
    }
}

function editFeedback(id) {
    localStorage.setItem("editFeedbackId", id);
    window.location.href = "edit-feedback.html";
}

function goTo(page) {
    window.location.href = page;
}

function goBack() {
    window.location.href = "dashboard.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
