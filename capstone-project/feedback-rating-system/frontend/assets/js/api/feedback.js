const FEEDBACK_API = "http://localhost:8080/api/feedback";

// Get feedback submitted by a specific user
async function getUserFeedback(userId, token) {
    const response = await fetch(`${FEEDBACK_API}/user/${userId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!response.ok) {
        throw new Error("Failed to load feedback");
    }

    return await response.json();
}
// Fetch feedback for a provider
async function getProviderFeedback(providerId, token) {
    const res = await fetch(`${FEEDBACK_API}/provider/${providerId}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch provider feedback");
    }

    return res.json();
}

// Get provider average rating
async function getProviderAverageRating(providerId, token) {
    const res = await fetch(`${FEEDBACK_API}/provider/${providerId}/average`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch average rating");
    }

    return res.json();
}
// Search feedback by keyword
async function searchFeedbackAPI(keyword, token) {
    const res = await fetch(`${FEEDBACK_API}/search?keyword=${keyword}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) {
        throw new Error("Search failed");
    }

    return res.json();
}
async function filterByRatingAPI(min, max, token) {
    const res = await fetch(`${FEEDBACK_API}/filter-by-rating?min=${min}&max=${max}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Rating filter failed");
    return res.json();
}
async function filterByDateAPI(start, end, token) {
    const res = await fetch(`${FEEDBACK_API}/filter-by-date?from=${start}&to=${end}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!res.ok) throw new Error("Date filter failed");
    return res.json();
}
