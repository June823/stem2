import React, { useContext, useState, useEffect } from "react";
import Logo from "./Logo";
import { FaSearch, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6"; // ✅ Moved to fa6
import getImageUrl from "../helpers/getImageUrl";
import { Link, useNavigate, useLocation } from "react-router-dom";
import SummaryApi from "../common";
import { toast } from "react-toastify";
import ROLE from "../common/role";
import Context from "../context";

const Header = () => {
  const { user, setUser, cartProductCount, fetchUserAddToCart } = useContext(Context);
  const [menuDisplay, setMenuDisplay] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");

  // Sync search input with URL
  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (query) setSearch(query);
  }, [location]);

  const handleSearch = (e) => {
    const { value } = e.target;
    setSearch(value);
    if (value) {
      navigate(`/search?q=${value}`);
    } else {
      navigate("/search");
    }
  };

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

  return (
    <header className="h-16 shadow-md bg-white fixed w-full z-40">
      <div className="container mx-auto flex items-center justify-between px-4 h-full">
        
        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <Logo w={90} h={50} />
        </Link>

        {/* Search Bar (Responsive) */}
        <div className="hidden md:flex items-center w-full justify-between max-w-sm border rounded-full focus-within:shadow-md pl-4 overflow-hidden">
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full outline-none bg-transparent"
            onChange={handleSearch}
            value={search}
          />
          <div className="text-lg min-w-[50px] h-10 bg-red-600 flex items-center justify-center text-white">
            <FaSearch />
          </div>
        </div>

        {/* Navigation Links (Desktop) */}
        <nav className="hidden lg:flex items-center gap-6 font-medium text-slate-600">
          <Link to="/about-us" className="hover:text-red-600">About Us</Link>
          <Link to="/services" className="hover:text-red-600">Services</Link>
          <Link to="/contact" className="hover:text-red-600">Contact</Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4 md:gap-7">
          
          {/* Mobile Search Toggle & Menu Toggle */}
          <div className="lg:hidden text-2xl cursor-pointer text-slate-600" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </div>

          {user?._id ? (
            <div className="relative cursor-pointer" onClick={() => setMenuDisplay(!menuDisplay)}>
              <div className="text-3xl">
                {user?.profilePic ? (
                  <img src={getImageUrl(user.profilePic)} className="w-10 h-10 rounded-full object-cover border" alt="profile" />
                ) : (
                  <FaRegCircleUser className="text-slate-500" />
                )}
              </div>
              {menuDisplay && (
                <div className="absolute right-0 mt-2 bg-white shadow-xl p-2 rounded min-w-[150px] border">
                  {user?.role === ROLE.ADMIN && (
                    <Link to="/admin-panel" className="block py-2 px-4 hover:bg-slate-100 rounded">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="block w-full text-left py-2 px-4 hover:bg-red-50 hover:text-red-600 rounded">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="px-5 py-1.5 rounded-full text-white bg-red-600 hover:bg-red-700 transition-all">Login</Link>
          )}

          {user?._id && (
            <Link to="/cart" className="text-2xl relative text-slate-600">
              <FaShoppingCart />
              <div className="bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center absolute -top-2 -right-3 text-[10px] font-bold">
                {cartProductCount}
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className="lg:hidden bg-white w-full border-t shadow-lg flex flex-col p-4 gap-4 animate-in slide-in-from-top">
          <div className="flex items-center w-full border rounded-full px-3 py-1">
             <input type="text" placeholder="Search..." className="w-full outline-none" onChange={handleSearch} value={search}/>
             <FaSearch className="text-slate-400"/>
          </div>
          <Link to="/about-us" onClick={()=>setMobileMenu(false)}>About Us</Link>
          <Link to="/services" onClick={()=>setMobileMenu(false)}>Services</Link>
          <Link to="/contact" onClick={()=>setMobileMenu(false)}>Contact</Link>
        </div>
      )}
    </header>
  );
};

export default Header;
