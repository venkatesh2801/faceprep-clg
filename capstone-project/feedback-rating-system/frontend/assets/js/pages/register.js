async function registerUser() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value;

    if (!name || !email || !password || !role) {
        showAlert("Missing Fields", "Please fill out all fields.", "warning");
        return;
    }

    if (password.length < 6) {
        showAlert("Weak Password", "Password must be at least 6 characters.", "warning");
        return;
    }

    try {
        const result = await register(name, email, password, role);

        await showAlert("Registration Successful", "Your account has been created. Please log in.", "success");
        window.location.href = "login.html";

    } catch (error) {
        showAlert("Registration Failed", error.message, "error");
    }
}
