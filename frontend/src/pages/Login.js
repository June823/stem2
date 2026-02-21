import React, { useContext, useState } from "react";
import loginIcons from "../assets/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import Context from "../context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

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
        toast.success(result.message);

        // Refresh user
        const user = await fetchUserDetails();
        fetchUserAddToCart();

        // Admin redirect
        if (user?.role?.toLowerCase() === "admin") {
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

          <form className="pt-6 flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="grid">
              <label>Email :</label>
              <div className="bg-slate-100 p-2">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  placeholder="Enter email"
                  className="w-full h-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label>Password :</label>
              <div className="bg-slate-100 p-2 flex">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  placeholder="Enter password"
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
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 w-full max-w-[150px] rounded-full mx-auto block mt-6"
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
