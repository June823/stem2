import React, { useState, useContext } from "react";
import loginIcons from "../assets/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });

  const navigate = useNavigate();
  const { fetchUserDetails } = useContext(Context);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(SummaryApi.signIn.url, {
        method: SummaryApi.signIn.method,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.message || "Login failed");
        return;
      }

      if (result.success) {
        toast.success("Login successful");

        // 🔥 Update Context user
        const user = await fetchUserDetails();

        // 🔥 Redirect based on role
        if (user?.role?.toUpperCase() === "ADMIN") {
          navigate("/admin-panel");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to connect to server.");
    }
  };

  return (
    <section id="login">
      <div className="mx-auto container p-4">
        <div className="bg-white p-5 w-full max-w-sm mx-auto">
          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login icons" />
          </div>

          <form onSubmit={handleSubmit} className="pt-6 flex flex-col gap-4">

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={data.email}
              onChange={handleOnChange}
              required
              className="bg-slate-100 p-2 outline-none"
            />

            <div className="bg-slate-100 p-2 flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={data.password}
                onChange={handleOnChange}
                required
                className="w-full outline-none bg-transparent"
              />
              <div
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-600 text-white py-2 rounded-full"
            >
              Login
            </button>

          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
