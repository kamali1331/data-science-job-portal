'use client';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BlogSection from '../components/BlogSection';
import Resources from '../components/Resources';
import Footer from '../components/Footer';

// Modals
import JobAlertsModal from '../components/modals/JobAlertsModal';
import MentorshipModal from '../components/modals/MentorshipModal';
import InterviewModal from '../components/modals/InterviewModal';
import RoadmapModal from '../components/modals/RoadmapModal';
import LoginModal from '../components/modals/LoginModal';

export default function Home() {
  const [modalState, setModalState] = useState({
    jobAlerts: false,
    mentorship: false,
    interview: false,
    roadmap: false,
    login: false
  });

  const toggleModal = (key: keyof typeof modalState, value: boolean) => {
    setModalState(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white font-sans selection:bg-blue-100 dark:selection:bg-blue-900">
      <Navbar onLoginClick={() => toggleModal('login', true)} />

      <main>
        <Hero />

        <BlogSection />

        <Resources
          openJobAlerts={() => toggleModal('jobAlerts', true)}
          openMentorship={() => toggleModal('mentorship', true)}
          openInterview={() => toggleModal('interview', true)}
          openRoadmap={() => toggleModal('roadmap', true)}
        />
      </main>

      <Footer />

      {/* Modals */}
      <JobAlertsModal isOpen={modalState.jobAlerts} onClose={() => toggleModal('jobAlerts', false)} />
      <MentorshipModal isOpen={modalState.mentorship} onClose={() => toggleModal('mentorship', false)} />
      <InterviewModal isOpen={modalState.interview} onClose={() => toggleModal('interview', false)} />
      <RoadmapModal isOpen={modalState.roadmap} onClose={() => toggleModal('roadmap', false)} />
      <LoginModal isOpen={modalState.login} onClose={() => toggleModal('login', false)} />
    </div>
  );
}
