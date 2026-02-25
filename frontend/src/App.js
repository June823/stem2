import "./App.css";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useContext } from "react";
import Context from "./context";

function App() {
  const { fetchUserDetails, fetchUserAddToCart } = useContext(Context);

  useEffect(() => {
    /**
     * 🔑 THE "REAL SITE" LOGIC:
     * We only call these functions if a token exists in localStorage.
     * This prevents 401 Unauthorized errors for guests/new visitors.
     */
    const token = localStorage.getItem('token');

    if (token) {
      fetchUserDetails();
      fetchUserAddToCart();
    }
  }, []); // Run once when the app loads

  return (
    <>
      {/* ToastContainer manages all your "Added to Cart" and "Login" alerts */}
      <ToastContainer 
        position="top-center" 
        autoClose={2000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <Header />

      <main className="min-h-[calc(100vh-120px)] pt-16 bg-slate-50">
        {/* Outlet renders the specific page (Home, Cart, Product, etc.) */}
        <Outlet />
      </main>

      <Footer />
    </>
  );
}

export default App;
