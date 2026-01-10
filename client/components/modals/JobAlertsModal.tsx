'use client';
import { FaLinkedin, FaGoogle, FaRobot, FaTimes } from 'react-icons/fa';
import { useState } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function JobAlertsModal({ isOpen, onClose }: ModalProps) {
    if (!isOpen) return null;

    const handleConnect = (provider: string) => {
        alert(`Connecting to ${provider}... (Simulation)`);
        // Future: Call API to connect
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Get Job Alerts</h3>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Connect your accounts to receive personalized job alerts tailored to your profile.
                    </p>

                    <div className="space-y-3">
                        <button
                            onClick={() => handleConnect('LinkedIn')}
                            className="w-full flex items-center justify-center gap-3 p-3 bg-[#0077b5] text-white rounded-lg hover:bg-[#006097] transition-colors font-medium"
                        >
                            <FaLinkedin size={20} /> Connect with LinkedIn
                        </button>
                        <button
                            onClick={() => handleConnect('Google')}
                            className="w-full flex items-center justify-center gap-3 p-3 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                            <FaGoogle size={20} className="text-red-500" /> Connect with Google
                        </button>
                        <button
                            onClick={() => handleConnect('MyJob AI')}
                            className="w-full flex items-center justify-center gap-3 p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
                        >
                            <FaRobot size={20} /> Connect with MyJob AI
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
