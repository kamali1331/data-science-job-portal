'use client';
import { useState, useEffect } from 'react';
import { FaFilePdf, FaTimes, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { jsPDF } from 'jspdf';
import { fetchInterviewQuestions } from '../../app/services/api';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface Question {
    id: number;
    question: string;
    answer: string;
}

export default function InterviewModal({ isOpen, onClose }: ModalProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && questions.length === 0) {
            loadQuestions();
        }
    }, [isOpen]);

    const loadQuestions = async () => {
        setLoading(true);
        try {
            const data = await fetchInterviewQuestions();
            setQuestions(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        const doc = new jsPDF();
        doc.setFontSize(20);
        doc.text("Interview Preparation Questions", 20, 20);
        doc.setFontSize(10);
        doc.text("Generated from Data Science Portal", 20, 28);

        let y = 40;
        const pageWidth = doc.internal.pageSize.getWidth();
        const margin = 20;
        const textWidth = pageWidth - (margin * 2);

        questions.forEach((item, index) => {
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
            doc.setFontSize(12);
            doc.setFont("helvetica", "bold");
            const qLines = doc.splitTextToSize(`${index + 1}. ${item.question}`, textWidth);
            doc.text(qLines, margin, y);
            y += (qLines.length * 6) + 2;

            doc.setFontSize(11);
            doc.setFont("helvetica", "normal");
            const aLines = doc.splitTextToSize(item.answer, textWidth);
            doc.text(aLines, margin, y);
            y += (aLines.length * 6) + 10;
        });

        doc.save("Data_Science_Interview_Questions.pdf");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl max-w-3xl w-full flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Interview Preparation</h3>
                        <p className="text-sm text-gray-500">Common questions asked in Data Science interviews.</p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={handleDownload}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-2"
                        >
                            <FaFilePdf /> Download PDF
                        </button>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <FaTimes size={24} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading questions...</p>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((q, idx) => (
                                <div key={idx} className="border border-gray-200 dark:border-zinc-700 rounded-xl overflow-hidden">
                                    <button
                                        onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                        className="w-full flex justify-between items-center p-4 bg-gray-50 dark:bg-zinc-800/50 hover:bg-gray-100 transition-colors text-left"
                                    >
                                        <span className="font-semibold text-gray-900 dark:text-gray-200">{q.question}</span>
                                        {activeIndex === idx ? <FaChevronUp className="text-gray-500" /> : <FaChevronDown className="text-gray-500" />}
                                    </button>

                                    {activeIndex === idx && (
                                        <div className="p-4 bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 text-sm leading-relaxed border-t border-gray-200 dark:border-zinc-700">
                                            {q.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
