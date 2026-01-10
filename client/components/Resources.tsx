'use client';
import { FaBell, FaUserTie, FaClipboardList, FaMapSigns } from 'react-icons/fa';

interface ResourcesProps {
    openJobAlerts: () => void;
    openMentorship: () => void;
    openInterview: () => void;
    openRoadmap: () => void;
}

export default function Resources({ openJobAlerts, openMentorship, openInterview, openRoadmap }: ResourcesProps) {
    const resources = [
        {
            title: "Job Alerts",
            desc: "Get notified about new jobs instantly.",
            icon: <FaBell className="text-2xl text-white" />,
            color: "bg-amber-500",
            action: openJobAlerts
        },
        {
            title: "Career Mentorship",
            desc: "1:1 guidance from industry experts.",
            icon: <FaUserTie className="text-2xl text-white" />,
            color: "bg-purple-600",
            action: openMentorship
        },
        {
            title: "Interview Preparation",
            desc: "Practice with real interview questions.",
            icon: <FaClipboardList className="text-2xl text-white" />,
            color: "bg-emerald-500",
            action: openInterview
        },
        {
            title: "Learning Roadmaps",
            desc: "Step-by-step guides for your career.",
            icon: <FaMapSigns className="text-2xl text-white" />,
            color: "bg-blue-500",
            action: openRoadmap
        }
    ];

    return (
        <section id="resources" className="py-20 bg-white dark:bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Resources & Automation</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {resources.map((item, index) => (
                        <div
                            key={index}
                            onClick={item.action}
                            className="group cursor-pointer p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{item.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
