import SummaryApi from "../common";
import { useDispatch } from "react-redux";
import { setUserDetails } from "../store/userSlice";

const useFetchUserDetails = () => {
  const dispatch = useDispatch();

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.userDetails.url, {
        method: SummaryApi.userDetails.method,
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        // 🔥 THIS IS THE IMPORTANT PART
        dispatch(setUserDetails(data.data));
        return data.data;
      }

      return null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  return fetchUserDetails;
};

export default useFetchUserDetails;
