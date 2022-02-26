import './forgotPassword.scss'
import { Link } from 'react-router-dom';
const ForgotPassword =()=>{
    return(
        <div className="forgot">
            <div className="forgot__container">
                <div className="forgot__container__image">
                    <img src="https://dashtar-admin.vercel.app/static/media/forgot-password-office.d1630a33.jpeg" alt="" />
                </div>
                <div className="forgot__container__form">
                    <div className="forgot__container__form__content">
                        <h2>Forgot password</h2>
                        <form action="">
                            <label htmlFor="">Email</label>
                            <input type="text" placeholder="jonh@doe.com" />
                            <button type="submit">Recover Password</button>
                        </form>
                        <Link to='/'><h6>Already have an account? Login</h6></Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ForgotPassword;