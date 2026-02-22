import React, { createContext, useState } from "react";
import SummaryApi from "../common";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartProductCount, setCartProductCount] = useState(0);

  // 🔥 Get logged in user
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

  // 🔥 Get cart count
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

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        cartProductCount,
        setCartProductCount,
        fetchUserDetails,
        fetchUserAddToCart,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
