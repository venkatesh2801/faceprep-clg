document.addEventListener("DOMContentLoaded", initAdminDashboard);

let allUsers = [];
let allFeedback = [];
let allProviders = [];
let userChart = null;
let ratingChart = null;

async function initAdminDashboard() {
    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("userRole");
    const userName = localStorage.getItem("userName");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    if (userRole !== "ADMIN") {
        await showAlert("Access Denied", "This page is for administrators only.", "error");
        window.location.href = "dashboard.html";
        return;
    }

    document.getElementById("adminName").textContent = `Hi, ${userName || "Admin"}`;

    await loadAllData();
    initCharts();
}

async function loadAllData() {
    const token = localStorage.getItem("token");

    try {
        // Load all users
        const usersRes = await fetch("http://localhost:8080/api/users", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        allUsers = await usersRes.json();
        document.getElementById("totalUsers").textContent = allUsers.length;

        // Load providers
        const providersRes = await fetch("http://localhost:8080/api/users/providers", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        allProviders = await providersRes.json();
        document.getElementById("totalProviders").textContent = allProviders.length;

        // Load all feedback
        const feedbackRes = await fetch("http://localhost:8080/api/feedback/all", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        allFeedback = await feedbackRes.json();
        document.getElementById("totalFeedback").textContent = allFeedback.length;

        // Calculate average rating
        if (allFeedback.length > 0) {
            const avg = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
            document.getElementById("avgRating").textContent = avg.toFixed(1) + " ★";
        } else {
            document.getElementById("avgRating").textContent = "N/A";
        }

        // Populate provider dropdown
        const providerSelect = document.getElementById("providerSelect");
        providerSelect.innerHTML = '<option value="">Select a provider...</option>';
        allProviders.forEach(p => {
            const option = document.createElement("option");
            option.value = p.id;
            option.textContent = p.name;
            providerSelect.appendChild(option);
        });

        // Render users
        renderUsers(allUsers);

    } catch (error) {
        console.error("Error loading data:", error);
        toastError("Failed to load dashboard data");
    }
}

function initCharts() {
    // User Distribution Chart (Pie)
    const userCtx = document.getElementById("userChart").getContext("2d");
    const regularUsers = allUsers.length - allProviders.length;
    
    userChart = new Chart(userCtx, {
        type: "doughnut",
        data: {
            labels: ["Regular Users", "Providers"],
            datasets: [{
                data: [regularUsers, allProviders.length],
                backgroundColor: ["#00d4aa", "#ffd93d"],
                borderColor: ["#00b894", "#f0c419"],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: "#8899a6",
                        padding: 20
                    }
                }
            }
        }
    });

    // Rating Distribution Chart (Bar)
    const ratingCtx = document.getElementById("ratingChart").getContext("2d");
    const ratingCounts = [0, 0, 0, 0, 0]; // 1-5 stars
    allFeedback.forEach(f => {
        if (f.rating >= 1 && f.rating <= 5) {
            ratingCounts[f.rating - 1]++;
        }
    });

    ratingChart = new Chart(ratingCtx, {
        type: "bar",
        data: {
            labels: ["1 ★", "2 ★", "3 ★", "4 ★", "5 ★"],
            datasets: [{
                label: "Number of Reviews",
                data: ratingCounts,
                backgroundColor: [
                    "#ff6b6b",
                    "#ffa502",
                    "#ffd93d",
                    "#7bed9f",
                    "#00d4aa"
                ],
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: "#8899a6",
                        stepSize: 1
                    },
                    grid: {
                        color: "#38444d"
                    }
                },
                x: {
                    ticks: {
                        color: "#8899a6"
                    },
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function renderUsers(users) {
    const container = document.getElementById("usersContainer");

    if (!users || users.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">people</span>
                <p>No users found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = "";

    users.forEach(user => {
        const isProvider = allProviders.some(p => p.id === user.id);
        const div = document.createElement("div");
        div.className = "provider-card";

        div.innerHTML = `
            <div class="provider-info">
                <h3>${user.name} ${isProvider ? '<span class="text-accent" style="font-size: 0.75rem;">PROVIDER</span>' : ''}</h3>
                <p>${user.email} (ID: ${user.id})</p>
            </div>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${user.id}, '${user.name}')">
                <span class="material-icons" style="font-size: 1rem;">delete</span>
                Delete
            </button>
        `;

        container.appendChild(div);
    });
}

function filterUsers() {
    const search = document.getElementById("userSearch").value.toLowerCase();
    const filtered = allUsers.filter(u => 
        u.name.toLowerCase().includes(search) || 
        u.email.toLowerCase().includes(search)
    );
    renderUsers(filtered);
}

async function loadFeedback() {
    renderFeedback(allFeedback);
}

function renderFeedback(list) {
    const container = document.getElementById("feedbackContainer");

    if (!list || list.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">inbox</span>
                <p>No feedback yet</p>
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
                    <strong>From:</strong> ${fb.user?.name || "Unknown"} 
                    → <strong>To:</strong> ${fb.provider?.name || "Unknown"}
                </div>
                <span class="feedback-meta">${date}</span>
            </div>
            <p><span class="rating-display">${stars}</span> (${fb.rating}/5)</p>
            <p>${fb.comment}</p>
            <div class="feedback-actions">
                <button class="btn btn-sm btn-danger" onclick="deleteFeedback(${fb.id})">
                    <span class="material-icons" style="font-size: 1rem;">delete</span>
                    Delete
                </button>
            </div>
        `;

        container.appendChild(div);
    });
}

function filterFeedback() {
    const search = document.getElementById("feedbackSearch").value.toLowerCase();
    const filtered = allFeedback.filter(f => 
        f.comment.toLowerCase().includes(search) ||
        (f.user?.name || "").toLowerCase().includes(search) ||
        (f.provider?.name || "").toLowerCase().includes(search)
    );
    renderFeedback(filtered);
}

async function loadProviderFeedback() {
    const token = localStorage.getItem("token");
    const providerId = document.getElementById("providerSelect").value;
    const container = document.getElementById("providerFeedbackContainer");

    if (!providerId) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">store</span>
                <p>Select a provider to view their feedback</p>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="text-center">
            <div class="loading"></div>
            <p class="text-muted mt-2">Loading...</p>
        </div>
    `;

    try {
        const response = await fetch(`http://localhost:8080/api/feedback/provider/${providerId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to load feedback");

        const feedback = await response.json();
        
        if (feedback.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons empty-state-icon">inbox</span>
                    <p>No feedback for this provider yet</p>
                </div>
            `;
            return;
        }

        // Calculate average
        const avg = feedback.reduce((sum, f) => sum + f.rating, 0) / feedback.length;

        container.innerHTML = `
            <div class="stat-box mb-3" style="display: inline-block;">
                <div class="stat-value">${avg.toFixed(1)} ★</div>
                <div class="stat-label">${feedback.length} reviews</div>
            </div>
        `;

        feedback.forEach(fb => {
            const div = document.createElement("div");
            div.className = "feedback-item";

            const stars = "★".repeat(fb.rating) + "☆".repeat(5 - fb.rating);
            const date = fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "";

            div.innerHTML = `
                <div class="feedback-header">
                    <strong>${fb.user?.name || "Anonymous"}</strong>
                    <span class="feedback-meta">${date}</span>
                </div>
                <p><span class="rating-display">${stars}</span></p>
                <p>${fb.comment}</p>
            `;

            container.appendChild(div);
        });

    } catch (error) {
        container.innerHTML = `
            <div class="empty-state">
                <span class="material-icons empty-state-icon">error_outline</span>
                <p class="text-error">Failed to load feedback</p>
            </div>
        `;
    }
}

async function deleteUser(id, name) {
    const confirmed = await showConfirm(
        "Delete User",
        `Are you sure you want to delete "${name}"? This will also delete all their feedback.`,
        "warning"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/users/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to delete user");

        toastSuccess(`User "${name}" deleted successfully`);
        await loadAllData();
        
        // Update charts
        if (userChart) userChart.destroy();
        if (ratingChart) ratingChart.destroy();
        initCharts();

    } catch (error) {
        toastError(error.message);
    }
}

async function deleteFeedback(id) {
    const confirmed = await showConfirm(
        "Delete Feedback",
        "Are you sure you want to delete this feedback?",
        "warning"
    );

    if (!confirmed) return;

    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`http://localhost:8080/api/feedback/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Failed to delete feedback");

        toastSuccess("Feedback deleted successfully");
        await loadAllData();
        loadFeedback();
        
        // Update charts
        if (ratingChart) ratingChart.destroy();
        initCharts();

    } catch (error) {
        toastError(error.message);
    }
}

function showTab(tab) {
    const usersTab = document.getElementById("usersTab");
    const feedbackTab = document.getElementById("feedbackTab");
    const providersTab = document.getElementById("providersTab");
    const usersBtn = document.getElementById("usersTabBtn");
    const feedbackBtn = document.getElementById("feedbackTabBtn");
    const providersBtn = document.getElementById("providersTabBtn");

    // Hide all tabs
    usersTab.classList.add("hidden");
    feedbackTab.classList.add("hidden");
    providersTab.classList.add("hidden");

    // Reset all buttons
    usersBtn.classList.remove("btn-primary");
    usersBtn.classList.add("btn-secondary");
    feedbackBtn.classList.remove("btn-primary");
    feedbackBtn.classList.add("btn-secondary");
    providersBtn.classList.remove("btn-primary");
    providersBtn.classList.add("btn-secondary");

    // Show selected tab
    if (tab === "users") {
        usersTab.classList.remove("hidden");
        usersBtn.classList.remove("btn-secondary");
        usersBtn.classList.add("btn-primary");
        renderUsers(allUsers);
    } else if (tab === "feedback") {
        feedbackTab.classList.remove("hidden");
        feedbackBtn.classList.remove("btn-secondary");
        feedbackBtn.classList.add("btn-primary");
        loadFeedback();
    } else if (tab === "providers") {
        providersTab.classList.remove("hidden");
        providersBtn.classList.remove("btn-secondary");
        providersBtn.classList.add("btn-primary");
    }
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
