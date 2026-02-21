import SummaryApi from "../common";

const fetchUserDetails = async () => {
  try {
    const response = await fetch(
      SummaryApi.userDetails.url,
      {
        method: SummaryApi.userDetails.method,
        credentials: "include", // VERY IMPORTANT
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return null;
  }
};

export default fetchUserDetails;
