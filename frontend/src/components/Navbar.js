import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ showLogout = true, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        if (onLogout) onLogout();
        navigate("/login");
    };

    return (
        <nav className="bg-white dark:bg-gray-800 shadow px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    CSV Summary
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-300">
                    Dashboard
                </div>
            </div>

            <div className="flex items-center gap-3">
                {showLogout && (
                    <button
                        onClick={handleLogout}
                        className="px-3 py-1 rounded bg-red-500 text-white text-sm hover:bg-red-600"
                    >
                        Logout
                    </button>
                )}
            </div>
        </nav>
    );
}
