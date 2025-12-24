document.addEventListener('DOMContentLoaded', () => {

  // --- Navigation & Scroll Animations ---
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      hamburger.classList.toggle('toggle');
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      navLinks.classList.remove('active');
      if (hamburger) hamburger.classList.remove('toggle');
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  const observerOptions = { threshold: 0.1 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
  });

  // --- Job Board Logic ---
  const jobListContainer = document.getElementById('job-list');
  const searchInput = document.getElementById('job-search');
  let jobs = []; // Will be fetched from API

  async function fetchJobs() {
    try {
      const response = await fetch('http://localhost:3000/api/jobs');
      if (!response.ok) throw new Error("Failed to fetch jobs");
      jobs = await response.json();
      renderJobs(jobs);
    } catch (err) {
      console.error(err);
      jobListContainer.innerHTML = '<p>Error loading jobs. Ensure Backend is running.</p>';
    }
  }

  function renderJobs(filteredJobs) {
    jobListContainer.innerHTML = ''; // Clear current jobs

    if (filteredJobs.length === 0) {
      jobListContainer.innerHTML = '<p style="text-align:center; color:#666;">No jobs found. Try a different keyword.</p>';
      return;
    }

    filteredJobs.forEach(job => {
      const jobCard = document.createElement('div');
      jobCard.classList.add('job-card');
      jobCard.innerHTML = `
        <div class="job-info">
          <h3>${job.title}</h3>
          <p>${job.company} | ${job.location}</p>
          <small>${job.type} • ${job.role}</small>
          ${job.source ? `<span style="display:inline-block; background:#e0f2fe; color:#0284c7; padding:2px 8px; border-radius:12px; font-size:0.75rem; margin-top:5px;">via ${job.source}</span>` : ''}
        </div>
        <button onclick="openModal('${job.title}')">Apply Now</button>
      `;
      jobListContainer.appendChild(jobCard);
    });
  }

  // Initial Fetch
  fetchJobs();

  // Search Logic
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.toLowerCase();
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(keyword) ||
        job.company.toLowerCase().includes(keyword) ||
        job.role.toLowerCase().includes(keyword)
      );
      renderJobs(filtered);
    });
  }

  // --- Modal Logic ---
  const modal = document.getElementById('apply-modal');
  const closeBtn = document.querySelector('.close-btn');
  const modalTitle = document.getElementById('modal-job-title');
  const form = document.getElementById('application-form');

  // Exposed function for HTML button to call
  window.openModal = function (jobTitle) {
    modalTitle.textContent = jobTitle;
    modal.style.display = 'flex';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
    }
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      alert(`Thank you, ${name}! Your application for ${modalTitle.textContent} has been sent.`);
      modal.style.display = 'none';
      form.reset();
    });
  }

  // --- Learning Roadmap Logic ---
  const roadmapCard = document.getElementById('roadmap-card');
  const roadmapModal = document.getElementById('roadmap-modal');
  const roadmapClose = document.querySelector('.roadmap-close-btn');
  const roadmapList = document.getElementById('roadmap-list');
  const toggleUploadBtn = document.getElementById('toggle-upload-btn');
  const uploadForm = document.getElementById('upload-form');

  // --- Service Buttons Logic ---
  const serviceButtons = document.querySelectorAll('.service-card.btn-look');
  const queryInput = document.getElementById('contact-message');
  const contactSection = document.getElementById('contact');

  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceName = btn.querySelector('h3').textContent;
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (queryInput) {
        queryInput.value = `I am interested in ${serviceName}. Please provide more details.`;
        queryInput.focus();
      }
    });
  });

  // Contact Form Logic
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      alert(`Thank you, ${name}! Your message has been sent. We will get back to you shortly.`);
      contactForm.reset();
    });
  }

  // Open Modal
  if (roadmapCard) {
    roadmapCard.addEventListener('click', () => {
      roadmapModal.style.display = 'flex';
      fetchRoadmaps();
    });
  }

  // Close Modal
  if (roadmapClose) {
    roadmapClose.addEventListener('click', () => {
      roadmapModal.style.display = 'none';
    });
  }

  // Close on click outside
  window.addEventListener('click', (e) => {
    if (e.target === roadmapModal) {
      roadmapModal.style.display = 'none';
    }
  });

  // Toggle Upload Form
  if (toggleUploadBtn) {
    toggleUploadBtn.addEventListener('click', () => {
      uploadForm.style.display = uploadForm.style.display === 'none' ? 'block' : 'none';
      toggleUploadBtn.textContent = uploadForm.style.display === 'block' ? 'Cancel Upload' : '+ Upload New Roadmap';
    });
  }

  // Fetch Roadmaps from Backend
  async function fetchRoadmaps() {
    roadmapList.innerHTML = '<p>Loading...</p>';
    try {
      const response = await fetch('http://localhost:3000/api/roadmaps');
      if (!response.ok) throw new Error('Failed to fetch');

      const roadmaps = await response.json();
      renderRoadmaps(roadmaps);
    } catch (error) {
      console.error(error);
      renderRoadmaps([]); // Render empty or error state
      roadmapList.innerHTML += `<p style="color:red; font-size:0.8rem;">Could not connect to server. Ensure 'node server.js' is running and DB is connected.</p>`;
    }
  }

  function renderRoadmaps(items) {
    roadmapList.innerHTML = '';
    if (items.length === 0) {
      roadmapList.innerHTML = '<p>No roadmaps available yet.</p>';
      return;
    }
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'roadmap-item';
      div.innerHTML = `
              <div>
                  <h4>${item.title} <span style="font-size:0.8em; font-weight:normal; color:#888;">(${item.category})</span></h4>
                  <p>${item.description || ''}</p>
              </div>
              <a href="http://localhost:3000/${item.file_path}" target="_blank" class="btn-primary" style="padding: 5px 10px; font-size: 0.8rem;">Download</a>
          `;
      roadmapList.appendChild(div);
    });
  }

  // Handle Upload
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('title', document.getElementById('roadmap-title').value);
      formData.append('category', document.getElementById('roadmap-category').value);
      formData.append('roadmapFile', document.getElementById('roadmap-file').files[0]);

      try {
        const res = await fetch('http://localhost:3000/api/roadmaps', {
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          alert('Roadmap uploaded successfully!');
          uploadForm.reset();
          uploadForm.style.display = 'none';
          fetchRoadmaps(); // Refresh list
        } else {
          alert('Upload failed.');
        }
      } catch (err) {
        console.error(err);
        alert('Error uploading file.');
      }
    });
  }

  // --- Interview Preparation Logic ---
  const interviewCard = document.getElementById('interview-card');
  const interviewModal = document.getElementById('interview-modal');
  const interviewClose = document.querySelector('.interview-close-btn');
  const accordionContainer = document.querySelector('.accordion-container');

  if (interviewCard) {
    interviewCard.style.cursor = 'pointer';
    // Remove border style from JS if possible and move to CSS, but keeping consistent for now
    // interviewCard.style.border = '2px solid var(--primary-color)'; 

    interviewCard.addEventListener('click', () => {
      interviewModal.style.display = 'flex';
      fetchInterviewQuestions();
    });
  }

  if (interviewClose) {
    interviewClose.addEventListener('click', () => interviewModal.style.display = 'none');
  }

  window.addEventListener('click', (e) => {
    if (e.target === interviewModal) interviewModal.style.display = 'none';
  });

  async function fetchInterviewQuestions() {
    accordionContainer.innerHTML = '<p>Loading questions...</p>';
    try {
      const response = await fetch('http://localhost:3000/api/interview-questions');
      const questions = await response.json();
      renderInterviewQuestions(questions);
    } catch (error) {
      console.error(error);
      accordionContainer.innerHTML = '<p style="color:red;">Failed to load questions from database.</p>';
    }
  }

  function renderInterviewQuestions(questions) {
    accordionContainer.innerHTML = '';
    questions.forEach(item => {
      const btn = document.createElement('button');
      btn.className = 'accordion';
      btn.textContent = item.question; // changed from item.q

      const panel = document.createElement('div');
      panel.className = 'panel';
      panel.innerHTML = `<p>${item.answer}</p>`; // changed from item.a

      btn.addEventListener('click', function () {
        this.classList.toggle('active');
        if (panel.style.maxHeight) {
          panel.style.maxHeight = null;
        } else {
          panel.style.maxHeight = panel.scrollHeight + "px";
        }
      });

      accordionContainer.appendChild(btn);
      accordionContainer.appendChild(panel);
    });
  }

  // --- PDF Download Logic ---
  const downloadPdfBtn = document.getElementById('download-pdf-btn');
  if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', generatePDF);
  }

  async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(40, 50, 220); // Primary color
    doc.text("Interview Preparation Questions", 20, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("Generated from Data Science Portal", 20, 28);

    let y = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const textWidth = pageWidth - (margin * 2);

    // We need to fetch questions again or store them globally. 
    // For now, let's just grab the text from the DOM or fetch if needed.
    // Better to fetch to ensure we have clean data.
    try {
      const response = await fetch('http://localhost:3000/api/interview-questions');
      const questions = await response.json();

      questions.forEach((item, index) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }

        // Question
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0);
        const qLines = doc.splitTextToSize(`${index + 1}. ${item.question}`, textWidth);
        doc.text(qLines, margin, y);
        y += (qLines.length * 6) + 2;

        // Answer
        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60);
        const aLines = doc.splitTextToSize(item.answer, textWidth);
        doc.text(aLines, margin, y);
        y += (aLines.length * 6) + 10; // Spacing after Q&A pair
      });

      doc.save("Data_Science_Interview_Questions.pdf");

    } catch (err) {
      console.error("Error generating PDF", err);
      alert("Failed to generate PDF. Please try again.");
    }
  }

  // --- Career Mentorship Logic ---
  const mentorshipCard = document.getElementById('mentorship-card');
  const mentorshipModal = document.getElementById('mentorship-modal');
  const mentorshipClose = document.querySelector('.mentorship-close-btn');

  if (mentorshipCard) {
    mentorshipCard.style.cursor = 'pointer';
    // mentorshipCard.style.border = '2px solid var(--primary-color)';

    mentorshipCard.addEventListener('click', () => {
      mentorshipModal.style.display = 'flex';
      fetchMentors();
    });
  }

  async function fetchMentors() {
    const grid = document.querySelector('.mentorship-grid');
    // Only fetch if empty to avoid flicker (or fetch every time to update)
    // but let's clear it first to show dynamic behavior
    grid.innerHTML = '<p>Loading options...</p>';

    try {
      const response = await fetch('http://localhost:3000/api/mentors');
      const mentors = await response.json();
      grid.innerHTML = '';

      mentors.forEach(mentor => {
        const card = document.createElement('a');
        card.href = mentor.link;
        card.target = "_blank";
        card.className = `mentor-card ${mentor.platform.toLowerCase()}-card`;

        card.innerHTML = `
                <div class="card-icon"><i class="${mentor.icon_class}"></i></div>
                <h4>${mentor.name}</h4>
                <p>${mentor.description}</p>
                <span class="card-link-text">Visit ${mentor.platform} <i class="fas fa-arrow-right"></i></span>
              `;
        grid.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      grid.innerHTML = '<p>Failed to load mentorship options.</p>';
    }
  }

  if (mentorshipClose) {
    mentorshipClose.addEventListener('click', () => mentorshipModal.style.display = 'none');
  }

  window.addEventListener('click', (e) => {
    if (e.target === mentorshipModal) mentorshipModal.style.display = 'none';
  });

  // --- References Modal Logic ---
  const referencesLink = document.getElementById('references-link');
  const referencesModal = document.getElementById('references-modal');
  const referencesClose = document.querySelector('.references-close-btn');

  if (referencesLink) {
    referencesLink.addEventListener('click', (e) => {
      e.preventDefault();
      referencesModal.style.display = 'flex';
    });
  }

  if (referencesClose) {
    referencesClose.addEventListener('click', () => {
      referencesModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === referencesModal) {
      referencesModal.style.display = 'none';
    }
  });

  // --- Job Alerts Modal Logic ---
  const jobAlertsCard = document.getElementById('job-alerts-card');
  const jobAlertsModal = document.getElementById('job-alerts-modal');
  const jobAlertsClose = document.querySelector('.job-alerts-close-btn');

  if (jobAlertsCard) {
    jobAlertsCard.addEventListener('click', () => {
      jobAlertsModal.style.display = 'flex';
    });
  }

  if (jobAlertsClose) {
    jobAlertsClose.addEventListener('click', () => {
      jobAlertsModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === jobAlertsModal) {
      jobAlertsModal.style.display = 'none';
    }
  });



  // Connect to Provider Logic
  window.connectToProvider = async function (provider) {
    const email = prompt(`Enter your email to connect with ${provider}:`);
    if (!email) return;

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/job-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, provider })
      });

      if (response.ok) {
        alert(`Successfully connected to ${provider}! You will now receive job alerts.`);
        jobAlertsModal.style.display = 'none';
      } else {
        const data = await response.json();
        alert(`Failed to connect: ${data.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert("Error connecting to server. Please try again later.");
    }
  };

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // --- Login Modal Logic ---
  const loginLink = document.getElementById('login-link');
  const loginModal = document.getElementById('login-modal');
  const loginClose = document.querySelector('.login-close-btn');
  const authForm = document.getElementById('auth-form');
  const authTitle = document.getElementById('auth-title');
  const authSubmitBtn = document.getElementById('auth-submit-btn');
  const authSwitchLink = document.getElementById('auth-switch-link');
  const authSwitchText = document.getElementById('auth-switch-text');

  let isLoginMode = true;

  if (loginLink) {
    loginLink.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginLink.textContent === 'Login') {
        loginModal.style.display = 'flex';
      } else {
        // Simulate Logout
        loginLink.textContent = 'Login';
        alert('Logged out successfully.');
      }
    });
  }

  if (loginClose) {
    loginClose.addEventListener('click', () => {
      loginModal.style.display = 'none';
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = 'none';
    }
  });

  if (authSwitchLink) {
    authSwitchLink.addEventListener('click', (e) => {
      e.preventDefault();
      isLoginMode = !isLoginMode;
      if (isLoginMode) {
        authTitle.textContent = 'Login';
        authSubmitBtn.textContent = 'Login';
        authSwitchText.textContent = 'New here? ';
        authSwitchLink.textContent = 'Create an account';
      } else {
        authTitle.textContent = 'Register';
        authSubmitBtn.textContent = 'Register';
        authSwitchText.textContent = 'Already have an account? ';
        authSwitchLink.textContent = 'Login';
      }
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('auth-email').value;
      const password = document.getElementById('auth-password').value;
      const endpoint = isLoginMode ? '/api/login' : '/api/register';

      try {
        const res = await fetch(`http://localhost:3000${endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
          alert(data.message || 'Success!');
          loginModal.style.display = 'none';
          authForm.reset();
          // Update UI to show logged in state
          if (loginLink) loginLink.textContent = 'Profile';
        } else {
          alert(data.error || 'Authentication failed');
        }
      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    });
  }

});
