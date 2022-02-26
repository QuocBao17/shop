import './popup.scss';
import { Link } from 'react-router-dom';
const Popup=(props)=>{
    return(
        <div className={`container__popup ${props.showPopup?'showPopup':'unshowPopup'}`}>
        <div className="container__popup__success">
            <div className="success">
                <i className="fas fa-check"></i>
            </div>
            <h1>{props.title}</h1>
            <div className="button">
                <button><Link to='/'>Continue</Link></button>
            </div>
        </div>
    </div>
    )
}
export default Popup;