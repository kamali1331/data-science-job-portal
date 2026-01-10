export const API_BASE_URL = 'http://localhost:3000';

export async function fetchJobs() {
    const res = await fetch(`${API_BASE_URL}/api/jobs`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return res.json();
}

export async function fetchBlogs() {
    const res = await fetch(`${API_BASE_URL}/api/blogs`);
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
}

export async function fetchRoadmaps() {
    const res = await fetch(`${API_BASE_URL}/api/roadmaps`);
    if (!res.ok) throw new Error('Failed to fetch roadmaps');
    return res.json();
}

export async function fetchInterviewQuestions() {
    const res = await fetch(`${API_BASE_URL}/api/interview-questions`);
    if (!res.ok) throw new Error('Failed to fetch interview questions');
    return res.json();
}

export async function fetchMentors() {
    const res = await fetch(`${API_BASE_URL}/api/mentors`);
    if (!res.ok) throw new Error('Failed to fetch mentors');
    return res.json();
}

// Authentication
export async function loginUser(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include' // Important for sessions
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login failed');
    return data;
}

export async function registerUser(credentials: any) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
        credentials: 'include'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Registration failed');
    return data;
}

export async function logoutUser() {
    try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (e) {
        console.error("Logout error", e);
    }
}
