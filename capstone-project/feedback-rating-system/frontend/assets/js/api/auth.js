const API_BASE = "http://localhost:8080/api/auth";

async function login(email, password) {
    const body = { email, password };

    const response = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        throw new Error("Invalid email or password");
    }

    return await response.json(); // returns token + user data
}

async function register(name, email, password, role) {
    const body = {
        name,
        email,
        password,
        role
    };

    const response = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Registration failed");
    }

    return await response.json();
}
