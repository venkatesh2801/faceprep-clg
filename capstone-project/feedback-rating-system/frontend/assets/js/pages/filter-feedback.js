document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Set default dates
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    document.getElementById("endDate").value = today.toISOString().split("T")[0];
    document.getElementById("startDate").value = lastMonth.toISOString().split("T")[0];
});

async function filterByRating() {
    const token = localStorage.getItem("token");
    const min = parseInt(document.getElementById("minRating").value) || 1;
    const max = parseInt(document.getElementById("maxRating").value) || 5;
    const container = document.getElementById("filterResults");

    if (min < 1 || max > 5 || min > max) {
        showAlert("Invalid Range", "Please enter a valid rating range (1-5)", "warning");
        return;
    }

    container.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <p class="text-muted mt-2">Filtering...</p>
        </div>
    `;

    try {
        const results = await filterByRatingAPI(min, max, token);
        renderResults(results, container, `Rating: ${min} - ${max}`);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">error_outline</span>
                <p class="text-error">Filter failed. Please try again.</p>
            </div>
        `;
        toastError("Filter failed");
    }
}

async function filterByDate() {
    const token = localStorage.getItem("token");
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const container = document.getElementById("filterResults");

    if (!startDate || !endDate) {
        showAlert("Missing Dates", "Please select both start and end dates", "warning");
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showAlert("Invalid Range", "Start date must be before end date", "warning");
        return;
    }

    container.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <p class="text-muted mt-2">Filtering...</p>
        </div>
    `;

    try {
        const start = `${startDate}T00:00:00`;
        const end = `${endDate}T23:59:59`;

        const results = await filterByDateAPI(start, end, token);
        renderResults(results, container, `${startDate} to ${endDate}`);
    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">error_outline</span>
                <p class="text-error">Filter failed. Please try again.</p>
            </div>
        `;
        toastError("Filter failed");
    }
}

function renderResults(list, container, filterLabel) {
    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">inbox</span>
                <h3>No Results Found</h3>
                <p>No feedback matches the filter: ${filterLabel}</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `<p class="text-muted mb-3">Found ${list.length} result(s) for: ${filterLabel}</p>`;

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
