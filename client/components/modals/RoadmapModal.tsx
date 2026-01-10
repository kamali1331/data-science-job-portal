'use client';
import { useState, useEffect } from 'react';
import { FaTimes, FaCloudUploadAlt, FaFileDownload } from 'react-icons/fa';
import { fetchRoadmaps, API_BASE_URL } from '../../app/services/api';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Roadmap {
    id: number;
    title: string;
    category: string;
    file_path: string;
    description?: string;
}

export default function RoadmapModal({ isOpen, onClose }: ModalProps) {
    const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);
    const [loading, setLoading] = useState(false);
    const [showUpload, setShowUpload] = useState(false);

    useEffect(() => {
        if (isOpen) loadRoadmaps();
    }, [isOpen]);

    const loadRoadmaps = async () => {
        setLoading(true);
        try {
            const data = await fetchRoadmaps();
            setRoadmaps(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Learning Roadmaps</h3>
                        <p className="text-sm text-gray-500">Download curated roadmaps to guide your data science journey.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        {loading ? (
                            <p className="col-span-full text-center text-gray-500">Loading roadmaps...</p>
                        ) : roadmaps.length === 0 ? (
                            <p className="col-span-full text-center text-gray-500">No roadmaps available yet.</p>
                        ) : (
                            roadmaps.map((item) => (
                                <div key={item.id} className="p-4 border border-gray-200 dark:border-zinc-700 rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors flex justify-between items-center">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 dark:text-white">{item.title}</h4>
                                        <span className="text-xs text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-full">{item.category}</span>
                                    </div>
                                    <a
                                        href={`${API_BASE_URL}/${item.file_path}`}
                                        target="_blank"
                                        className="p-2 text-gray-500 hover:text-blue-600 transition-colors"
                                        title="Download/View"
                                    >
                                        <FaFileDownload size={20} />
                                    </a>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-zinc-800 pt-6">
                        <button
                            onClick={() => setShowUpload(!showUpload)}
                            className="text-sm font-medium text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
                        >
                            {showUpload ? <FaTimes /> : <FaCloudUploadAlt />} {showUpload ? "Cancel Upload" : "Upload New Roadmap"}
                        </button>

                        {showUpload && (
                            <form className="mt-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-xl space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Title</label>
                                    <input type="text" className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-black" placeholder="e.g. Data Scientist 2025" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Category</label>
                                    <select className="w-full p-2 rounded-lg border border-gray-300 dark:border-zinc-600 bg-white dark:bg-black">
                                        <option>Data Science</option>
                                        <option>Data Analytics</option>
                                        <option>AI & ML</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">File</label>
                                    <input type="file" className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                                </div>
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">Upload</button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
