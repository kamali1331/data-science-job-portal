import Link from 'next/link';
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-black border-t border-gray-100 dark:border-zinc-800 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

                <div className="flex space-x-6 mb-8 text-gray-400">
                    <a href="#" className="hover:text-blue-600 transition-colors"><FaLinkedin size={24} /></a>
                    <a href="#" className="hover:text-blue-600 transition-colors"><FaTwitter size={24} /></a>
                    <a href="#" className="hover:text-blue-600 transition-colors"><FaGithub size={24} /></a>
                </div>

                <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 mb-8">
                    <Link href="/license" className="hover:text-gray-900 dark:hover:text-gray-300">MIT License</Link>
                    <Link href="/privacy" className="hover:text-gray-900 dark:hover:text-gray-300">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-gray-900 dark:hover:text-gray-300">Terms & Conditions</Link>
                </div>

                <p className="text-sm text-gray-400 font-light">
                    © 2026 Kamali Sridhar. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
