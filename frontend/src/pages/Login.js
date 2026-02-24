import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import loginIcons from "../assets/signin.gif";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [data, setData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(SummaryApi.signIn.url, {
                method: SummaryApi.signIn.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const result = await res.json();

            if (result.success) {
                toast.success("Login successful");
                // 🔑 SAVE TOKEN TO LOCALSTORAGE
                localStorage.setItem('token', result.token); 

                await fetchUserDetails();
                await fetchUserAddToCart();

                if (result.data.role === "ADMIN") {
                    navigate("/admin-panel");
                } else {
                    navigate("/");
                }
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Login failed. Check server.");
        }
    };

    return (
        <section id="login">
            <div className="container mx-auto p-4">
                <div className="bg-white p-5 w-full max-w-sm mx-auto shadow-md rounded">
                    <div className="w-20 h-20 mx-auto">
                        <img src={loginIcons} alt="login icon" className="rounded-full" />
                    </div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-6">
                        <div className="grid">
                            <label>Email: </label>
                            <div className="bg-slate-100 p-2">
                                <input type="email" name="email" value={data.email} onChange={handleChange} className="w-full bg-transparent outline-none" required />
                            </div>
                        </div>
                        <div>
                            <label>Password: </label>
                            <div className="flex bg-slate-100 p-2">
                                <input type={showPassword ? "text" : "password"} name="password" value={data.password} onChange={handleChange} className="w-full bg-transparent outline-none" required />
                                <div className="cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </div>
                            </div>
                        </div>
                        <button className="bg-red-600 text-white px-6 py-2 w-full rounded-full mt-4">Login</button>
                    </form>
                    <p className="mt-4 text-center">Don't have an account? <Link to="/sign-up" className="text-red-600">Sign Up</Link></p>
                </div>
            </div>
        </section>
    );
};

export default Login;
