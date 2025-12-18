async function loginUser() {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        showAlert("Missing Fields", "Please enter both email and password", "warning");
        return;
    }

    try {
        const result = await login(email, password);

        // Store user data in localStorage
        localStorage.setItem("token", result.token);
        localStorage.setItem("userId", result.id);
        localStorage.setItem("userName", result.name);
        localStorage.setItem("userEmail", result.email);
        localStorage.setItem("userRoles", JSON.stringify(result.roles));
        
        // Store primary role for simple checks
        if (result.roles.includes("ADMIN")) {
            localStorage.setItem("userRole", "ADMIN");
        } else if (result.roles.includes("PROVIDER")) {
            localStorage.setItem("userRole", "PROVIDER");
        } else {
            localStorage.setItem("userRole", "USER");
        }

        toastSuccess("Welcome back, " + result.name + "!");

        // Redirect based on role (priority: ADMIN > PROVIDER > USER)
        setTimeout(() => {
            if (result.roles.includes("ADMIN")) {
                window.location.href = "admin-dashboard.html";
            } else if (result.roles.includes("PROVIDER")) {
                window.location.href = "provider-dashboard.html";
            } else {
                window.location.href = "dashboard.html";
            }
        }, 1000);

    } catch (error) {
        showAlert("Login Failed", error.message, "error");
    }
}
