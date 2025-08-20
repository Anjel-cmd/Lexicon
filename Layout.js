import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@/entities/User';
import { createPageUrl } from '@/utils';
import { LayoutDashboard, Book, User as UserIcon, LogOut, Library, Users, GitPullRequest, MessageSquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const commonLinks = [
    { title: 'Dashboard', url: createPageUrl('Dashboard'), icon: LayoutDashboard },
    { title: 'Browse Books', url: createPageUrl('Books'), icon: Book },
];

const userLinks = [
    { title: 'My Borrows', url: createPageUrl('MyBorrows'), icon: GitPullRequest },
];

const adminLinks = [
    { title: 'Manage Books', url: createPageUrl('AdminBooks'), icon: Library },
    { title: 'Borrow Requests', url: createPageUrl('AdminRequests'), icon: GitPullRequest },
    { title: 'Manage Members', url: createPageUrl('AdminMembers'), icon: Users },
];

function NavLink({ item }) {
    const location = useLocation();
    const isActive = location.pathname === item.url;
    return (
        <Link
            to={item.url}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                isActive
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
            }`}
        >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.title}</span>
        </Link>
    );
}

export default function Layout({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const currentUser = await User.me();
                setUser(currentUser);
            } catch (error) {
                console.error("User not logged in", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        await User.logout();
        window.location.reload();
    };

    const links = user?.role === 'admin' ? [...commonLinks, ...adminLinks] : [...commonLinks, ...userLinks];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
                <div className="h-16 flex items-center px-6 border-b border-gray-200">
                    <Book className="w-8 h-8 text-blue-600" />
                    <h1 className="ml-3 text-xl font-bold text-gray-800">Lexicon</h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {loading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    ) : (
                        links.map(item => <NavLink key={item.title} item={item} />)
                    )}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    {loading ? (
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ) : user ? (
                        <>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <UserIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-800 truncate">{user.full_name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                            >
                                <LogOut className="w-5 h-5" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </>
                    ) : (
                       <button
                            onClick={() => User.login()}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Login</span>
                        </button>
                    )}
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}