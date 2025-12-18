const ADMIN_API = "http://localhost:8080/api/admin";

async function getAllUsersAPI(token) {
    const res = await fetch(`${ADMIN_API}/users`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch users");
    return res.json();
}

async function getAllProvidersAPI(token) {
    const res = await fetch(`${ADMIN_API}/providers`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to fetch providers");
    return res.json();
}

async function deleteUserAPI(id, token) {
    const res = await fetch(`${ADMIN_API}/user/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
    });

    if (!res.ok) throw new Error("Failed to delete user");
    return res.text();
}
