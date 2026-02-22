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
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message);
        return;
      }

      if (result.success) {
        toast.success("Login successful");

        // 🔥 Wait for Redux to update
        const user = await fetchUserDetails();

        await fetchUserAddToCart();

        if (user?.role?.toUpperCase() === "ADMIN") {
          navigate("/admin-panel", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error) {
      toast.error("Server error");
    }
  };

  return (
    <section>
      <div className="container mx-auto p-4">
        <div className="bg-white p-5 max-w-sm mx-auto">

          <div className="w-20 h-20 mx-auto">
            <img src={loginIcons} alt="login" />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-6">

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
              className="p-2 bg-slate-100"
              required
            />

            <div className="flex bg-slate-100 p-2">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={data.password}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
                required
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
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
