import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './login.scss'
import { Link } from 'react-router-dom';
import Popup from '../../Popup/Popup';
import CheckRole from '../../CheckRole/CheckRole';
const Login =()=>{
    const [fieldsInput,setFieldsInput]=useState({
        fields:{},
        errors:{},
    })
    
    let navigate = useNavigate();
    const onHandleChange=(e)=>{
        const target =e.target;
        const name=target.name;
        const value=target.value;
        const fields =fieldsInput.fields;
        setFieldsInput({
            ...fieldsInput,
            fields:{
                ...fields,
                [name]:value
            }
        })
    }
    const checkEnterInput=(errors,formIsEnter)=>{
        let fields =fieldsInput.fields;
        // Email
        if (typeof fields['email']=='undefined') {
            formIsEnter = false;
            errors['email'] = 'Please enter email'
        }
        else{
            let regex = new RegExp('[a-z0-9]+@[a-z]+.[a-z]{2,3}');
            if (!regex.test(fields['email'])) {
                formIsEnter = false;
                errors['email'] = 'The input is not valid email address'
            }
        }
        // Password
        if (typeof fields['password']=='undefined') {
            formIsEnter = false;
            errors['password'] = 'Please enter password'
        }
        else{
            if ((fields['password'].length) < 6) {
                formIsEnter = false;
                errors['password'] = 'The password must be at least 6 characters'
            }
        }
        return formIsEnter;
    }
    const onLogin=()=>{
        const auth = getAuth();
        let email =fieldsInput.fields['email'];
        let password=fieldsInput.fields['password']
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            navigate('/products');
            const user = userCredential.user;
            CheckRole();
            // ...
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        let errors={};
        let formIsEnter =true;
        if(checkEnterInput(errors,formIsEnter)){
            onLogin();
        }
        setFieldsInput({
            ...fieldsInput,
            errors,
        })
    }
    
    return(
        <div className='login'>
            <div className="login__container">
                <div className="login__container__image">
                    <img src="https://dashtar-admin.vercel.app/static/media/login-office.c7786a89.jpeg" alt="" />
                </div>
                <div className="login__container__form">
                    <h2>Login</h2>
                    <form action="">
                        <label htmlFor="">Email</label>
                        <input type="text" placeholder="admin@gmail.com" onChange={onHandleChange} name='email' value={fieldsInput.fields['email']||''} />
                        <span>{fieldsInput.errors['email']}</span>
                        <label htmlFor="">Password</label>
                        <input type="password" placeholder=".............." onChange={onHandleChange} name='password' value={fieldsInput.fields['password']||''} />
                        <span>{fieldsInput.errors['password']}</span>
                        <button type="submit" onClick={onSubmit}>Login</button>
                    </form>
                    <div className="login__container__form__facebook">
                        <button><p><i className="fab fa-facebook-f"></i> <span>Login With Facebook</span></p></button>
                    </div>
                    <div className="login__container__form__google">
                        <button><p><i className="fab fa-google"></i> <span>Login With Google</span></p></button>
                    </div>
                    <Link to='/forgot-password'><h6>Forgot your password?</h6></Link>
                    <Link to='/sign-up'><h6>Create account</h6></Link>
                </div>
            </div>
        </div>
    )
}
export default Login;