import React, { createContext, useState } from "react";
import SummaryApi from "../common";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // 🔥 Fetch user directly here (no external file needed)
  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data); // store user in context
        return data.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        fetchUserDetails,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
