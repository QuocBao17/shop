import { Link } from 'react-router-dom'
import logo from './../Image/logo.png'
import CheckRole from '../CheckRole/CheckRole';
import { useRef, useState, useEffect } from 'react';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';
import './navbar.scss';
const Navbar=(props)=>{
    var menuStatus=props.menuStatus;
    const NavList =[
        {
            display:"Dashboard",
            path:'/dashboard',
            icon:'fas fa-th-large'
        },
        {
            display:"Products",
            path:'/products',
            icon:'fas fa-shopping-bag'
        },
        {
            display:"Category",
            path:'/category',
            icon:'fas fa-bars'
        },
        {
            display:"Users",
            path:'/account',
            icon:'far fa-user'
        },
        {
            display:"Orders",
            path:'/orders',
            icon:'far fa-compass'
        },
        {
            display:"Coupons",
            path:'/coupons',
            icon:'fas fa-gift'
        },
        {
            display:"Banners",
            path:'/banners',
            icon:'fab fa-artstation'
        },
        {
            display:"Our Staff",
            path:'/staff',
            icon:'fas fa-users'
        },
        {
            display:"Setting",
            path:'/profile',
            icon:'fas fa-cog'
        }
    ]
    const menuRef = useRef();
    
    const closeMenu=()=>{
        props.getMenuStatus(false);
    }
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
    const handleClickOutside = (e) => {
        var openMenuIcon =document.getElementById('openMenu');
        if (!menuRef.current.contains(e.target) && e.target!==openMenuIcon) {
          closeMenu();
        }
      };
      useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
     },[]);
    return(
        <div className={`navbar ${menuStatus?'openMenu':'closeMenu'}`}>
            <div className="navbar__container">
                <div className="navbar__container__logo">
                    <Link to='/dashboard'> <img src={logo} alt="" /></Link>
                </div>
                <div className="navbar__container__list">
                    <ul>
                        {
                            NavList.map((item, index)=>(
                                <li  key={index}>
                                   <Link to={item.path}>
                                   <span className={item.icon}></span>
                                   <p>{item.display}</p>
                                   </Link>
                                </li>
                            ))
                        }
                    </ul>
                    <div className="navbar__container__list__button">
                        <button onClick={()=>signOutButton()}><span className="fas fa-sign-out-alt"></span>Log out</button>
                    </div>
                </div>
            </div>
            <div ref ={menuRef} className='navbar__container__responsive'>
                <div className='navbar__container__responsive__wrap'>
                    <div className="navbar__container__responsive__wrap__logo">
                        <img src={logo} alt="" />
                    </div>
                    <div className="navbar__container__responsive__wrap__list">
                        <ul>
                            {
                                NavList.map((item, index)=>(
                                    <li  key={index}>
                                    <Link to={item.path}>
                                    <span className={item.icon}></span>
                                    <p>{item.display}</p>
                                    </Link>
                                    </li>
                                ))
                            }
                        </ul>
                        <div className="navbar__container__responsive__wrap__list__button">
                            <button  onClick={()=>signOutButton()}><span className="fas fa-sign-out-alt"></span>Log out</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Navbar;