'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaBars, FaTimes, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../app/context/AuthContext';

interface NavbarProps {
    onLoginClick: () => void;
}

export default function Navbar({ onLoginClick }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md shadow-sm dark:bg-black/80 dark:border-b dark:border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex-shrink-0">
                        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Data Science Portal
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            <Link href="#about" className="hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">About</Link>
                            <Link href="#services" className="hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Services</Link>
                            <Link href="#resources" className="hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Resources</Link>
                            <Link href="#contact" className="hover:text-primary dark:hover:text-blue-400 px-3 py-2 rounded-md text-sm font-medium transition-colors">Contact</Link>

                            {user ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                        <FaUserCircle />
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={logout}
                                        className="bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={onLoginClick}
                                    className="bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-colors shadow-lg shadow-primary/30"
                                >
                                    Login
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary focus:outline-none"
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white dark:bg-black border-t dark:border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="#about" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">About</Link>
                        <Link href="#services" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Services</Link>
                        <Link href="#resources" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Resources</Link>
                        <Link href="#contact" className="block px-3 py-2 rounded-md text-base font-medium hover:text-primary">Contact</Link>
                        {user ? (
                            <>
                                <div className="block px-3 py-2 text-base font-medium text-gray-500">{user.email}</div>
                                <button onClick={logout} className="w-full text-left block px-3 py-2 text-base font-medium text-red-600">Logout</button>
                            </>
                        ) : (
                            <button onClick={onLoginClick} className="w-full text-left block px-3 py-2 text-base font-medium text-primary">Login</button>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
