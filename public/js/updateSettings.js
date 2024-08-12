import axios from "axios";
import { showAlert } from "./alerts";

export const updateData = async (data, type) => {
  try {
    const url =
      type === "password"
        ? "/api/v1/users/updatePassword"
        : "/api/v1/users/updateMe";
    const ress = await axios({
      method: "Patch",
      url,
      data,
    });
    s;
    if (ress.data.status === "sucess") {
      showAlert("sucess", `${type.toUpperCase()} updated sucessfully`);
      document.querySelector(".btn--save-password").textContent = "Updated";
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
