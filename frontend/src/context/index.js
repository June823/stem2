// src/context/index.js

import React, { createContext, useState } from "react";
import fetchUserDetails from "../helpers/fetchUserDetails";

const Context = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const getUserDetails = async () => {
    const data = await fetchUserDetails();
    setUser(data); // 🔥 store user in context
    return data;
  };

  return (
    <Context.Provider
      value={{
        user,
        setUser,
        fetchUserDetails: getUserDetails,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Context;
