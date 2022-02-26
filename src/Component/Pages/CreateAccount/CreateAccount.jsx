import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore";  
import { database } from "../../Api/Config/firebase-config";
import { Link } from "react-router-dom";
import { useCallback, useEffect } from "react";
import './createAccount.scss'
import { useState } from 'react';
import Popup from "../../Popup/Popup";
import { async } from "@firebase/util";
const CreateAccount =()=>{
    const [showPopup,setShowPopup]=useState(false);
    const [layout,setLayout]=useState(false);
    const [fieldsInput, setFieldsInput]=useState({
        fields: {},
        errors: {},
        isAgreed: false,
        authError: ''
    })
    // handle change input
    const handleChange=(e)=>{
        const target =e.target;
        const value=target.value;
        const name=target.name;
        const fields =fieldsInput.fields;
        setFieldsInput({
            ...fieldsInput,
            fields:{
                ...fields,
                [name]:value
            }
        })
    
    }
    // handle change checkbox
    const handleCheck=()=>{
        setFieldsInput({
            ...fieldsInput,
            isAgreed: !fieldsInput.isAgreed
        })
    }
    const checkEnterInput=(errors,formIsEnter)=>{
        let fields = fieldsInput.fields;
        let isAgreed = fieldsInput.isAgreed
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
        if (typeof fields['userName']=='undefined') {
            formIsEnter = false;
            errors['userName'] = 'Please enter username'
        }
        else{
            if ((fields['userName'].length) < 3) {
                formIsEnter = false;
                errors['userName'] = 'The username must be at least 6 characters'
            }
        }
        if (typeof fields['confirmPassword']=="undefined") {
            formIsEnter = false;
            errors['confirmPassword'] = 'Please enter password confirmation'
        }
        else{
            if ((fields['confirmPassword'] !== fields['password'])) {
                formIsEnter = false;
                errors['confirmPassword'] = 'The password confirmation does not match '
            }
        }
        if (isAgreed === false) {
            formIsEnter = false;
            errors['policy'] = 'You must accept the privacy policy before registering'
        }   
        return formIsEnter;
    }
    const onSignIn=()=>{
        const auth = getAuth();
        const email = fieldsInput.fields['email'];
        const password = fieldsInput.fields['password'];
        const userName=fieldsInput.fields['userName']
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            setShowPopup(true);
            setLayout(true);
            const user = userCredential.user;
            const request={
                email:email,
                password:password,
                avatar:'https://img.wattpad.com/17d1aa9fa9b2f051578f43eff3df0b5061921884/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f776174747061642d6d656469612d736572766963652f53746f7279496d6167652f5034353367304d725042583573413d3d2d3231342e313464376432643664623663333938313334343534323633323137312e6a7067',
                role:'',
                name:userName
            }
            setDoc(doc(database, "users",email),request);
            console.log("Save done")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }
    const onSubmit=(e)=>{
        e.preventDefault();
        let errors = {};
        let formIsEnter = true;
        if(checkEnterInput(errors,formIsEnter)){
            onSignIn();
        }
        setFieldsInput({
            ...fieldsInput,
            errors,
        })
    }
    return(
        <div className={`create ${layout?'showLayout':null}`}>
            <div className="create__container">
                <Popup showPopup={showPopup} title={'Sign Up Success'}></Popup>
                <div className="create__container__image">
                    <img src="https://dashtar-admin.vercel.app/static/media/create-account-office.080280cb.jpeg" alt="" />
                </div>
                <div className="create__container__form">
                    <h2>Create Account</h2>
                    <form action="">
                        <label htmlFor="">Userame</label>
                        <input type="text" placeholder="Admin" name='userName' value={fieldsInput.fields['userName']||''} onChange={handleChange}/>
                        <span>{fieldsInput.errors['userName']}</span>
                        <label htmlFor="">Email</label>
                        <input type="text" placeholder="admin@gmail.com" name='email' value={fieldsInput.fields['email']||''} onChange={handleChange}/>
                        <span>{fieldsInput.errors['email']}</span>
                        <label htmlFor="">Password</label>
                        <input type="password" placeholder=".............." name='password' value={fieldsInput.fields['password']||''} onChange={handleChange}  />
                        <span>{fieldsInput.errors['password']}</span>
                        <label htmlFor="">Confirm Password</label>
                        <input type="password" placeholder=".............." name='confirmPassword' value={fieldsInput.fields['confirmPassword']||''} onChange={handleChange}  />
                        <span>{fieldsInput.errors['confirmPassword']}</span>
                        <div className="check">
                            <input type="checkbox" id='check' onChange={handleCheck} name='policy' value={fieldsInput.isAgreed}/>
                            <label htmlFor="check"><p>I agree to the <span> privacy policy</span></p></label>
                        </div>
                        <span>{fieldsInput.errors['policy']}</span>
                        <button type="submit" onClick={onSubmit}>Sign in</button>
                    </form>
                    <div className="create__container__form__facebook">
                        <button><p><i className="fab fa-facebook-f"></i> <span>Create With Facebook</span></p></button>
                    </div>
                    <div className="create__container__form__google">
                        <button><p><i className="fab fa-google"></i> <span>Login With Google</span></p></button>
                    </div>
                   <Link to='/'> <h6>Already have an account? Login</h6></Link>
                </div>
            </div>
        </div>
    )
}
export default CreateAccount;