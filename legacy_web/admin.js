const API_URL = 'http://localhost:3000/api';

// Tab Logic
function openTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// --- Dashboard Logic ---
async function loadStats() {
    try {
        // Fetch Counts
        const resStats = await fetch(`${API_URL}/stats`);
        const stats = await resStats.json();

        document.getElementById('stats-users').textContent = stats.users;
        document.getElementById('stats-jobs').textContent = stats.jobs;
        document.getElementById('stats-subs').textContent = stats.subscribers;

        // Fetch Automation Status
        const resAuto = await fetch(`${API_URL}/automation-status`);
        const auto = await resAuto.json();

        const timeElem = document.getElementById('automation-status');
        if (auto.lastRun) {
            const date = new Date(auto.lastRun);
            timeElem.textContent = date.toLocaleString() + ` (${timeSince(date)} ago)`;
        } else {
            timeElem.textContent = "Has not run yet (Server just started)";
        }

    } catch (err) {
        console.error("Stats error", err);
    }
}

function timeSince(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes";
    return Math.floor(seconds) + " seconds";
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
// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    loadJobs();
    loadStats();
});
