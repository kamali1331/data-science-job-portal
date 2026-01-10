'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FaNewspaper, FaArrowRight } from 'react-icons/fa';
import { fetchBlogs } from '../app/services/api';

interface Blog {
    id: number;
    title: string;
    excerpt: string;
    date: string;
    image_url?: string;
}

export default function BlogSection() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadBlogs() {
            try {
                const data = await fetchBlogs();
                setBlogs(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }
        loadBlogs();
    }, []);

    return (
        <section id="blogs" className="py-20 bg-zinc-50 dark:bg-zinc-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Latest Job Portal</h2>

                {loading ? (
                    <p className="text-center text-gray-500">Loading insights...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {blogs.length === 0 ? (
                            <p className="text-center col-span-full">No blogs available at the moment.</p>
                        ) : (
                            blogs.map((blog) => (
                                <div key={blog.id} className="bg-white dark:bg-zinc-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-zinc-700">
                                    <div className="h-48 bg-blue-50 dark:bg-blue-900/20 relative flex items-center justify-center">
                                        {blog.image_url ? (
                                            <Image
                                                src={blog.image_url}
                                                alt={blog.title}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <FaNewspaper className="text-4xl text-blue-500/50" />
                                        )}
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-xl font-semibold mb-2 line-clamp-2 text-gray-900 dark:text-gray-100">{blog.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{blog.excerpt}</p>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-gray-500">{blog.date}</span>
                                            <button className="text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1">
                                                Read More <FaArrowRight size={12} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}
