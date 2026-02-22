import './App.css';
import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect, useState } from 'react';
import SummaryApi from './common';
import Context from './context';

function App() {
  const [user, setUser] = useState(null);
  const [cartProductCount, setCartProductCount] = useState(0);

  // 🔥 GET LOGGED IN USER
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data);
        return data.data;
      } else {
        setUser(null);
        return null;
      }
    } catch (error) {
      setUser(null);
      return null;
    }
  };

  // 🔥 GET CART COUNT
  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(
        SummaryApi.addToCartProductCount.url,
        {
          method: SummaryApi.addToCartProductCount.method,
          credentials: "include",
        }
      );

      const data = await response.json();

      if (data.success) {
        setCartProductCount(data?.data?.count || 0);
      }
    } catch (error) {
      setCartProductCount(0);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        fetchUserDetails,
        cartProductCount,
        fetchUserAddToCart,
      }}
    >
      <ToastContainer position="top-center" />
      <Header />
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
}

export default App;
