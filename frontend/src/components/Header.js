import React, { useContext, useState, useEffect } from "react";
import Logo from "./Logo";
import { FaRegCircleUser } from "react-icons/fa6";
import { FaShoppingCart } from "react-icons/fa";
import getImageUrl from "../helpers/getImageUrl";
import { Link, useNavigate } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const { user, setUser, cartProductCount, fetchUserAddToCart } = useContext(Context);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const navigate = useNavigate();

  // DEBUGGING: Open your browser console (F12) to see this!
  console.log("Header User State:", user);

  const handleLogout = async () => {
    try {
      const response = await fetch(SummaryApi.logout_user.url, {
        method: SummaryApi.logout_user.method,
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      }
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  useEffect(() => {
    if (user?._id) {
      fetchUserAddToCart();
    }
  }, [user]); // Re-runs when user logs in

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
        <Link to="/">
          <Logo w={90} h={50} />
        </Link>

        <div className="flex items-center gap-7">
          {/* Admin Link - Only shows if user.role is ADMIN */}
          {user?.role === ROLE.ADMIN && (
            <Link to="/admin-panel" className="text-sm px-3 py-1 border rounded hover:bg-slate-100">
              Admin
            </Link>
          )}

          {/* Profile Section - Only shows if user._id exists */}
          {user?._id ? (
            <div className="relative cursor-pointer" onClick={() => setMenuDisplay((prev) => !prev)}>
              <div className="text-3xl">
                {user?.profilePic ? (
                  <img src={getImageUrl(user.profilePic)} className="w-10 h-10 rounded-full" alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
              {menuDisplay && (
                <div className="absolute right-0 mt-2 bg-white shadow-lg p-2 rounded min-w-[120px]">
                  <nav className="text-sm">
                    {user?.role === ROLE.ADMIN && (
                       <Link to="/admin-panel" className="whitespace-nowrap block py-1 px-2 hover:bg-slate-100">Admin Panel</Link>
                    )}
                    <button onClick={handleLogout} className="whitespace-nowrap block w-full text-left py-1 px-2 hover:bg-slate-100">Logout</button>
                  </nav>
                </div>
              )}
            </div>
          ) : (
            /* Login Button - Shows if NOT logged in */
            <Link to="/login" className="px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700">
              Login
            </Link>
          )}

          {/* Cart - Only shows if logged in */}
          {user?._id && (
            <Link to="/cart" className="text-2xl relative">
              <FaShoppingCart />
              <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-3 text-xs">
                {cartProductCount}
              </div>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
