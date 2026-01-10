'use client';
import { FaChalkboardTeacher, FaVideo, FaTimes, FaArrowRight } from 'react-icons/fa';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MentorshipModal({ isOpen, onClose }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-2xl w-full p-6 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Career Mentorship</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <FaTimes size={24} />
          </button>
        </div>
        <p className="text-gray-600 dark:text-gray-400 mb-8">Connect with me for personalized guidance.</p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Topmate */}
          <a 
            href="https://topmate.io/ds_kamali" 
            target="_blank" 
            className="group block p-6 rounded-xl bg-amber-50 dark:bg-zinc-800 border-2 border-transparent hover:border-amber-400 transition-all"
          >
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 text-amber-600">
              <FaVideo size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">1:1 Mentorship</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Book a slot for Resume Review, Mock Interviews, or Career Guidance.</p>
            <span className="text-amber-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Visit Topmate <FaArrowRight size={12} />
            </span>
          </a>

          {/* Preplaced */}
          <a 
            href="https://preplaced.in/profile/d-s-kamali" 
            target="_blank" 
            className="group block p-6 rounded-xl bg-blue-50 dark:bg-zinc-800 border-2 border-transparent hover:border-blue-500 transition-all"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
              <FaChalkboardTeacher size={24} />
            </div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Long-term Mentorship</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">End-to-end guidance to help you land your dream data role.</p>
            <span className="text-blue-600 font-medium text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
              Visit Preplaced <FaArrowRight size={12} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
