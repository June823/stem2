import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const useFetchUserDetails = () => {
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      // 🔑 Get the token you saved during Login
      const token = localStorage.getItem('token');

      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        headers: {
            "Content-Type" : "application/json",
            // 🔑 This is the missing link!
            "Authorization": `Bearer ${token}` 
        },
        credentials: "include", 
      });

      const data = await response.json();

      if (data.success) {
        dispatch(setUserDetails(data.data));
        return data.data;
      }

      // If the backend returns 401 here, it's because the token is missing/invalid
      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return fetchUserDetails;
};

export default useFetchUserDetails;
