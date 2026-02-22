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

  // ✅ Consume functions from Context
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
        credentials: "include", // ✅ Essential for cross-site cookies on Render
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Login failed");
        return;
      }

      if (result.success) {
        toast.success("Login successful");

        // ✅ IMPORTANT: Wait for these to finish so global state updates BEFORE navigation
        await fetchUserDetails();
        await fetchUserAddToCart();

        // ✅ Redirect based on role (optional) or just to home
        if (result.data.role === "ADMIN") {
          navigate("/admin-panel", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast.error("Server error. Please try again.");
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
              <label>Email : </label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  name="email"
                  placeholder="enter email"
                  value={data.email}
                  onChange={handleChange}
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label>Password : </label>
              <div className="flex bg-slate-100 p-2">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="enter password"
                  value={data.password}
                  onChange={handleChange}
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
                <div
                  className="cursor-pointer text-xl"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full hover:scale-110 transition-all mx-auto block mt-6"
            >
              Login
            </button>
          </form>

          <p className="my-5 text-center">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-red-600 hover:underline hover:text-red-700">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
