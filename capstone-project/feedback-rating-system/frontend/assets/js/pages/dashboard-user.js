document.addEventListener("DOMContentLoaded", loadDashboard);

async function loadDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!user || !token) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    document.getElementById("username").innerText = user.name;

    try {
        const feedbackList = await getUserFeedback(user.id, token);
        displayFeedback(feedbackList);
    } catch (err) {
        document.getElementById("feedback-list").innerHTML =
            "<p style='color:red'>Could not load feedback.</p>";
    }
}

function displayFeedback(list) {
    const box = document.getElementById("feedback-list");

    if (!list || list.length === 0) {
        box.innerHTML = "<p>No feedback submitted yet.</p>";
        return;
    }

    box.innerHTML = "";

    list.forEach(item => {
        const div = document.createElement("div");
        div.className = "feedback-item";

        div.innerHTML = `
            <p><strong>Provider:</strong> ${item.provider.name}</p>
            <p><strong>Rating:</strong> ${item.rating}</p>
            <p><strong>Comment:</strong> ${item.comment}</p>
            <hr>
        `;

        box.appendChild(div);
    });
}

function logout() {
    localStorage.clear();
    window.location.href = "login.html";
}
