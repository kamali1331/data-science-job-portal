const API_URL = 'http://localhost:3000/api';

// Tab Logic
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// --- Jobs Management ---

// Fetch and List Jobs
async function loadJobs() {
    const container = document.getElementById('admin-job-list');
    container.innerHTML = '<p>Loading...</p>';

    try {
        const res = await fetch(`${API_URL}/jobs`);
        const jobs = await res.json();

        container.innerHTML = '<h4>Existing Jobs</h4>';
        jobs.forEach(job => {
            const div = document.createElement('div');
            div.className = 'admin-item';
            div.innerHTML = `
                <div>
                    <strong>${job.title}</strong> - ${job.company}
                    <div style="font-size:0.8em; color:#666;">${job.location} | ${job.type}</div>
                </div>
                <button class="delete-btn" onclick="deleteJob(${job.id})">Delete</button>
            `;
            container.appendChild(div);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p style="color:red">Error loading jobs.</p>';
    }
}

// Add Job
document.getElementById('job-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const jobData = {
        title: document.getElementById('job-title').value,
        company: document.getElementById('job-company').value,
        location: document.getElementById('job-location').value,
        type: document.getElementById('job-type').value,
        role: document.getElementById('job-role').value
    };

    try {
        const res = await fetch(`${API_URL}/jobs`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jobData)
        });

        if (res.ok) {
            alert('Job Posted Successfully!');
            e.target.reset();
            loadJobs(); // Refresh list
        } else {
            alert('Failed to post job');
        }
    } catch (err) {
        alert('Error connecting to server');
    }
});

// Delete Job
async function deleteJob(id) {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
        const res = await fetch(`${API_URL}/jobs/${id}`, { method: 'DELETE' });
        if (res.ok) {
            loadJobs();
        } else {
            alert('Failed to delete job');
        }
    } catch (err) {
        alert('Error deleting job');
    }
}

// Initial Load
document.addEventListener('DOMContentLoaded', loadJobs);
