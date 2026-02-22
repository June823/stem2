import React, { useState } from "react";
import loginIcons from "../assets/signin.gif";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import useFetchUserDetails from "../helpers/fetchUserDetails";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const fetchUserDetails = useFetchUserDetails();

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

        // 🔥 Update Redux
        await fetchUserDetails();

        // Redirect
        navigate("/admin-panel");
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

          <form className="pt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label>Email :</label>
              <div className="bg-slate-100 p-2 mt-1">
                <input
                  type="email"
                  name="email"
                  value={data.email}
                  onChange={handleOnChange}
                  className="w-full outline-none bg-transparent"
                  required
                />
              </div>
            </div>

            <div>
              <label>Password :</label>
              <div className="bg-slate-100 p-2 mt-1 flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={data.password}
                  onChange={handleOnChange}
                  className="w-full outline-none bg-transparent"
                  required
                />
                <div
                  className="cursor-pointer ml-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="bg-red-600 text-white px-6 py-2 rounded-full mt-4"
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
