import React, { createContext, useState, useCallback } from "react";
import SummaryApi from "../common";

const Context = createContext(null);

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cartProductCount, setCartProductCount] = useState(0);

  // ✅ IMPROVED: Added 'return' so Login page can wait for this to finish
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        setUser(dataResponse.data);
        return dataResponse; // Return data so caller knows it worked
      } else {
        setUser(null);
        return dataResponse;
      }
    } catch (error) {
      console.error("Context Error:", error);
      setUser(null);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: "include",
      });

      const dataResponse = await response.json();

      if (dataResponse.success) {
        setCartProductCount(dataResponse?.data?.count || 0);
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
