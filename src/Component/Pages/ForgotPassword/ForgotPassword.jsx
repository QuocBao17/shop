import './forgotPassword.scss'
import { Link } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Popup from "../../Popup/Popup";
import { useState } from 'react';
const ForgotPassword =()=>{
    const [fieldsInput,setFieldsInput]=useState({
        fields:{},
        errors:{},
    })
    const [showPopup,setShowPopup]=useState(false);
    const [layout,setLayout]=useState(false);
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
        return formIsEnter;
    }
    const onRecover=()=>{
        let email =fieldsInput.fields['email'];
        const auth = getAuth();
        sendPasswordResetEmail(auth, email)
        .then(() => {
            setShowPopup(true);
            setLayout(true);
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        let errors={};
        let formIsEnter =true;
        if(checkEnterInput(errors,formIsEnter)){
            onRecover();
        }
        setFieldsInput({
            ...fieldsInput,
            errors,
        })
    }
    return(
        <div className={`forgot ${layout?'showLayout':null}`}>
            <div className="forgot__container">
                <Popup showPopup={showPopup} title={'Recover Success, please check your mail!'}></Popup>
                <div className="forgot__container__image">
                    <img src="https://dashtar-admin.vercel.app/static/media/forgot-password-office.d1630a33.jpeg" alt="" />
                </div>
                <div className="forgot__container__form">
                    <div className="forgot__container__form__content">
                        <h2>Forgot password</h2>
                        <form action="">
                            <label htmlFor="">Email</label>
                            <input type="text" placeholder="jonh@doe.com" onChange={onHandleChange} name='email' value={fieldsInput.fields['email']||''}/>
                            <button type="submit" onClick={onSubmit}>Recover Password</button>
                        </form>
                        <Link to='/'><h6>Already have an account? Login</h6></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;