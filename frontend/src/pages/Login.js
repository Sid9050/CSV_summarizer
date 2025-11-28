import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API = process.env.REACT_APP_API_URL;

    const login = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: email, password }),
            });
            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("token", data.token);
                navigate("/dashboard");
            } else alert(data.msg || "Login failed");
        } catch (err) {
            alert("Error logging in");
        }
        setLoading(false);
    };

    return (
        <>
            <Navbar showLogout={false} />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-md w-80">
                    <h2 className="text-xl font-bold mb-6">Login</h2>

                    {/* Email */}
                    <input
                        type="email"
                        placeholder="Email"
                        className="mb-3 p-2 w-full border rounded"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Password */}
                    <input
                        type="password"
                        placeholder="Password"
                        className="mb-3 p-2 w-full border rounded"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        onClick={login}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded mb-2"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>
                    <p className="text-sm">
                        Don't have account?{" "}
                        <Link to="/signup" className="text-blue-600">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </>
    );
}
