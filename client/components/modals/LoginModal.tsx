'use client';
import { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useAuth } from '../../app/context/AuthContext';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
    const { login, register } = useAuth();
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const credentials = { email, password };
            if (isLoginMode) {
                await login(credentials);
            } else {
                await register(credentials);
            }

            alert(isLoginMode ? 'Login Successful' : 'Registration Successful');
            onClose();
            // Reset form
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fade-in relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                >
                    <FaTimes size={20} />
                </button>

                <div className="p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
                        {isLoginMode ? 'Login' : 'Create Account'}
                    </h2>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                placeholder="Enter your password"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-lg hover:shadow-blue-500/30 disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (isLoginMode ? 'Login' : 'Register')}
                        </button>
                    </form>

                    <div className="mt-6 text-center pt-6 border-t border-gray-100 dark:border-zinc-800">
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                            {isLoginMode ? "New to our platform? " : "Already have an account? "}
                            <button
                                onClick={() => setIsLoginMode(!isLoginMode)}
                                className="text-blue-600 font-semibold hover:underline"
                            >
                                {isLoginMode ? 'Create an account' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
