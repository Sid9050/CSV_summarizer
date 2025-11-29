import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API = process.env.REACT_APP_API_URL;

    const validatePassword = (pwd) => ({
        length: pwd.length >= 10,
        upper: /[A-Z]/.test(pwd),
        number: /[0-9]/.test(pwd),
        special: /[!@#$%^&*]/.test(pwd),
    });

    const pwdValid = validatePassword(password);
    const allValid = Object.values(pwdValid).every(Boolean);

    const signup = async () => {
        if (!allValid) return;
        if (password !== confirm) return;

        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else alert(data.msg || "Signup failed");
        } catch {
            alert("Error signing up");
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar showLogout={false} />

            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96">
                    <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                        Create an Account
                    </h2>

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-3 p-2 w-full border rounded dark:bg-gray-700 dark:text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-3 p-2 w-full border rounded dark:bg-gray-700 dark:text-white"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Password Rules */}
                    <div className="text-sm mb-3">
                        <p className={pwdValid.length ? "text-green-600" : "text-red-500"}>
                            • At least 10 characters
                        </p>
                        <p className={pwdValid.upper ? "text-green-600" : "text-red-500"}>
                            • One uppercase letter (A-Z)
                        </p>
                        <p className={pwdValid.number ? "text-green-600" : "text-red-500"}>
                            • One number (0-9)
                        </p>
                        <p className={pwdValid.special ? "text-green-600" : "text-red-500"}>
                            • One special character (!@#$%^&*)
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        className="mb-1 p-2 w-full border rounded dark:bg-gray-700 dark:text-white"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                    />

                    
                    {confirm.length > 0 && confirm !== password && (
                        <p className="text-red-500 text-xs mb-2">⚠ Passwords do not match</p>
                    )}

                    
                    <button
                        onClick={signup}
                        disabled={!allValid || password !== confirm}
                        className={`w-full py-2 rounded text-white mb-3
                            ${
                                !allValid || password !== confirm
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {loading ? "Creating..." : "Signup"}
                    </button>

                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Already have an account?{" "}
                        <Link to="/login" className="text-blue-600 dark:text-blue-400">
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
