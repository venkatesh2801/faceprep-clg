document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Allow Enter key to trigger search
    document.getElementById("keyword").addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            searchFeedback();
        }
    });
});

async function searchFeedback() {
    const token = localStorage.getItem("token");
    const keyword = document.getElementById("keyword").value.trim();
    const container = document.getElementById("searchResults");

    if (!keyword) {
        showAlert("Missing Keyword", "Please enter a search keyword", "warning");
        return;
    }

    container.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <p class="text-muted mt-2">Searching...</p>
        </div>
    `;

    try {
        const results = await searchFeedbackAPI(keyword, token);
        renderResults(results, container);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">error_outline</span>
                <p class="text-error">Search failed. Please try again.</p>
            </div>
        `;
        toastError("Search failed");
    }
}

function renderResults(list, container) {
    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">search_off</span>
                <h3>No Results Found</h3>
                <p>Try searching with different keywords</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `<p class="text-muted mb-3">Found ${list.length} result(s)</p>`;

    list.forEach(fb => {
        const div = document.createElement("div");
        div.className = "feedback-item";

        const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);
        const date = fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "";

        div.innerHTML = `
            <div class="feedback-header">
                <div>
                    <strong>From:</strong> ${fb.user?.name || "Unknown"} 
                    → <strong>To:</strong> ${fb.provider?.name || "Unknown"}
                </div>
                <span class="feedback-meta">${date}</span>
            </div>
            <p><span class="rating-display">${stars}</span> (${fb.rating}/5)</p>
            <p>${fb.comment}</p>
        `;

        container.appendChild(div);
    });
}

function goBack() {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "PROVIDER") {
        window.location.href = "provider-dashboard.html";
    } else {
        window.location.href = "dashboard.html";
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
