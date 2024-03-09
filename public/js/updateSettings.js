import axios from 'axios';
import { showAlert } from './alerts';

export const updateData = async (data, type) => {
  try {
    console.log(type);
    const url =
      type === 'password'
        ? 'http://127.0.0.1:3000/api/v1/users/updatePassword'
        : 'http://127.0.0.1:3000/api/v1/users/updateMe';
    const ress = await axios({
      method: 'Patch',
      url,
      data,
    });s
    if (ress.data.status === 'sucess') {
      showAlert('sucess', `${type.toUpperCase()} updated sucessfully`);
      document.querySelector('.btn--save-password').textContent = 'Updated';
    }
  } catch (err) {
    console.log(err);
    showAlert('error', err.response.data.message);
  }
};
