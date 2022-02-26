import './header.scss';
import { Link,useNavigate } from 'react-router-dom'
import { getAuth, signOut } from "firebase/auth";
import { useState,useEffect,useRef } from 'react';
import CheckRole from '../CheckRole/CheckRole';
const Header =(props)=>{
    var menuStatus= props.menuStatus;
    const tougleStatus= ()=>{
        props.getMenuStatus(!menuStatus);   
    }
    const [popup,setPopup]=useState(false);
    const [popupNoti,setPopupNoti]=useState(false);
    var session = JSON.parse(localStorage.getItem('session'));
    const openPopup=()=>{
        setPopup(true);
    }
    const openPopupNoti=()=>{
        setPopupNoti(true);
    }
    const myRef = useRef();
    const myRefNoti = useRef();
    const handleClickOutside = (e) => {
      if (!myRef.current.contains(e.target)) {
       setPopup(false)
      }
      if (!myRefNoti.current.contains(e.target)) {
        setPopupNoti(false)
       }
    };
    let navigate =useNavigate();
    const auth = getAuth();
    const signOutButton=()=>{      
        signOut(auth).then(() => {
            navigate('/');
            console.log('sign');
            CheckRole();
        }).catch((error) => {
        // An error happened.
        });
    }
    useEffect(()=>{
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[]);
    return(
        <div className="header">
            <div className="header__container">
                <div className="header__container__mode" onClick={()=>props.getMode(!props.darkMenu)}>
                    {
                        props.darkMenu? <i className="fas fa-sun"></i>:<i className="fas fa-moon"></i>
                    }
                </div>
                <div className="header__container__notify" onClick={openPopupNoti}>
                <i className="fas fa-bell"></i>
                <h6>6</h6>
                </div>
                <div ref={myRefNoti} className={`header__container__popupNoti ${popupNoti?'openPopupNoti':'closePopupNoti'}`}>
                <div className="popupNoti__container">
                        <div className="left">
                            <div className="content">
                                <p>Sam L. Placed $800 USD order!</p>
                            </div>
                            <div className="status">
                                <div className="new">
                                    <p>New Order</p>
                                </div>
                                <div className="date">
                                    <p>Dec 12 2021 - 12:40p</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="popupNoti__container">
                        <div className="left">
                            <div className="content">
                                <p>Radicchio Stock out, please check!</p>
                            </div>
                            <div className="status">
                                <div className="stock-out">
                                    <p>Stock out</p>
                                </div>
                                <div className="date">
                                    <p>Dec 12 2021 - 12:40p</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="popupNoti__container">
                        <div className="left">
                            <div className="content">
                                <p>Yellow Sweet Corn Stock out</p>
                            </div>
                            <div className="status">
                                <div className="stock-out">
                                    <p>Stock out</p>
                                </div>
                                <div className="date">
                                    <p>Dec 12 2021 - 12:40p</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="popupNoti__container">
                        <div className="left">
                            <div className="content">
                                <p>Organic Baby Carrot Stock out</p>
                            </div>
                            <div className="status">
                                <div className="stock-out">
                                    <p>Stock out</p>
                                </div>
                                <div className="date">
                                    <p>Dec 12 2021 - 12:40p</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="popupNoti__container">
                        <div className="left">
                            <div className="content">
                                <p>Sam L. Placed $300 USD order!</p>
                            </div>
                            <div className="status">
                                <div className="new">
                                    <p>New Order</p>
                                </div>
                                <div className="date">
                                    <p>Dec 12 2021 - 12:40p</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                    <div className="popupNoti__container">
                        <div className="left">
                            <div className="content">
                                <p>Orange Stock out, please check!</p>
                            </div>
                            <div className="status">
                                <div className="stock-out">
                                    <p>Stock out</p>
                                </div>
                                <div className="date">
                                    <p>Dec 12 2021 - 12:40p</p>
                                </div>
                            </div>
                        </div>
                        <div className="right">
                            <i className="fas fa-times"></i>
                        </div>
                    </div>
                </div>
                <div className="header__container__user" onClick={openPopup}>
                    <img src={session.avatar} alt="" />
                </div>
                <div ref={myRef} className={`header__container__popup ${popup?'openPopup':'closePopup'}`}>
                   <Link to='/dashboard'><p><i className='fas fa-th-large'></i> Dashboard</p></Link>
                    <Link to='/profile'><p><i className='fas fa-cog'></i>Setting</p></Link>
                    <p onClick={()=>signOutButton()}><i className="fas fa-sign-out-alt"></i> Log out</p>
                </div>
            </div>
            <div className="header__container__responsive">
                <div className="header__container__responsive__wrap">
                    <div className="header__container__responsive__wrap__navbar">
                        <i id="openMenu" className="fas fa-bars" onClick={tougleStatus}></i>
                    </div>
                    <div className="header__container__responsive__wrap__info">
                        <div className="header__container__responsive__wrap__info__mode">
                            <i className="fas fa-moon"></i>
                        </div>
                        <div className="header__container__responsive__wrap__info__notify">
                        <i className="fas fa-bell"></i>
                        </div>
                        <div className="header__container__responsive__wrap__info__user">
                            <img src={session.avatar} alt="" onClick={openPopup}/>
                        </div>
                        <div ref={myRef} className={`header__container__popup ${popup?'openPopup':'closePopup'}`}>
                            <Link to='/dashboard'><p><i className='fas fa-th-large'></i> Dashboard</p></Link>
                            <Link to='/profile'><p><i className='fas fa-cog'></i>Setting</p></Link>
                            <p onClick={()=>signOutButton()}><i className="fas fa-sign-out-alt"></i> Log out</p>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    )
}
export default Header;