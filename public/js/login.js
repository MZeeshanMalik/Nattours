import axios from "axios";
import { showAlert } from "./alerts";
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (res.data.status === "sucess") {
      showAlert("success", "logged in sucessfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1200);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: "Get",
      url: "/api/v1/users/logout",
    });
    if (res.data.status === "sucess") {
      window.setTimeout(() => {
        showAlert("sucess", "logged out sucessfully");
        // location.reload(true);
        location.assign("/");
      }, 1200);
    }
  } catch (err) {
    showAlert("error", "Failed to logout ! Please try again.");
  }
};
