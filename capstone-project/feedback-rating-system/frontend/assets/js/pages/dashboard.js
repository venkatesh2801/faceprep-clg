document.addEventListener("DOMContentLoaded", initDashboard);

function initDashboard() {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("userName");
    const userRole = localStorage.getItem("userRole");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    // Update greeting
    const greeting = document.getElementById("userGreeting");
    const welcomeText = document.getElementById("welcomeText");
    
    if (userName) {
        greeting.textContent = `Hi, ${userName}`;
        welcomeText.textContent = `Welcome back, ${userName}!`;
    }

    // Show provider cards if user is a provider
    if (userRole === "PROVIDER") {
        document.getElementById("providerCards").classList.remove("hidden");
    }
}

function goTo(page) {
    window.location.href = page;
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
