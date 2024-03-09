import { login , logout} from './login'
import {updateData} from './updateSettings'
const loginForm = document.querySelector('.form--login');
const updateForm = document.querySelector('.form-user-data');
const logOutBtn = document.querySelector('.nav__el--logout');
const userPasswordForm = document.querySelector('.form-user-password');
// const userPasswordForm = document.querySelector('.btn--save-password');
// const updatePassword = document.querySelector('btn--save-password');
if(loginForm){
    loginForm.addEventListener('submit' , (e)=>{
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email , password)
        })
}

if(logOutBtn){
    logOutBtn.addEventListener('click' , logout)
}
if(updateForm){
    updateForm.addEventListener('submit' , e=>{
        e.preventDefault();
        const form = new FormData();
        form.append('name',document.getElementById('name').value)
        form.append('email', document.getElementById('email').value)
        form.append('photo' , document.getElementById('photo').files[0])
        // const name = document.getElementById('name').value;
        // const email = document.getElementById('email').value;
        updateData(form , 'data')
    })
    if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e => {
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent = 'Updating...';
    
        const password = document.getElementById('password-current').value;
        const updatePassword = document.getElementById('password').value;
        const confirmUpdatePassword = document.getElementById('password-confirm').value;
        console.log(password, updatePassword, confirmUpdatePassword)
        await updateData(
          { password , updatePassword, confirmUpdatePassword },
          'password'
        );
})
}
}