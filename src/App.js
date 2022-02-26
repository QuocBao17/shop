import './App.scss';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckRole from './Component/CheckRole/CheckRole';
import { useState } from 'react';
import Navbar from './Component/Navbar/Navbar';
import Category from './Component/Pages/Admin/Categories/Category';
import Product from './Component/Pages/Admin/Product/Product';
import Navigation from './Component/Navigation/Navigation';
import DetailProduct from './Component/Pages/Admin/Detail/Detail-Product/Detail-Product';
import Counpons from './Component/Pages/Admin/Coupons/Coupons';
import Banners from './Component/Pages/Admin/Banners/Banners';
import Login from './Component/Pages/Login/Login';
import ForgotPassword from './Component/Pages/ForgotPassword/ForgotPassword';
import CreateAccount from './Component/Pages/CreateAccount/CreateAccount';
import Staff from './Component/Pages/Admin/Staff/Staff';
import Account from './Component/Pages/Admin/Account/Account';
import Profile from './Component/Pages/Admin/Profile/Profile';
import Dashboard from './Component/Pages/Admin/Dashboard/Dashboard';
import ChartBar from './Component/Chart/ChartBar';
function App() {
  const [darkMenu,setDarkMenu]=useState(false); // Dark mode
  const [menuStatus, setMenuStatus]=useState(false); // Open and Close Navbar in mobile display
  const [formStatus, setFormStatus]=useState(false); // Open add Close Add/Update Category form
  const getMenuStatus=(menuStt)=>{
    setMenuStatus(menuStt);
  }
  const getFormStatus=(formStt)=>{
    setFormStatus(formStt);
  }
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<Login></Login>}></Route>
            <Route path='/products' element={<Product menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Product>}></Route>
            <Route path='/category' element={<Category menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Category>}></Route>
            <Route path='/products/:id/detail' element={<DetailProduct></DetailProduct>}></Route>
            <Route path='/coupons' element={<Counpons  menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Counpons>}></Route>
            <Route path='/banners' element={<Banners  menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Banners>}></Route>
            {/* <Route path='/login' element={<Login></Login>}></Route> */}
            <Route path='/forgot-password' element={<ForgotPassword></ForgotPassword>}></Route>
            <Route path='/sign-up' element={<CreateAccount></CreateAccount>}></Route>
            <Route path='/staff' element={<Staff  menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Staff>}></Route>
            <Route path='/account' element={<Account  menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Account>}></Route>
             <Route path='/profile' element={<Profile menuStatus={menuStatus} formStatus={formStatus} getFormStatus={getFormStatus} 
            getMenuStatus={getMenuStatus}></Profile>}></Route>
            <Route path='/dashboard' element={<Dashboard menuStatus={menuStatus} getMenuStatus={getMenuStatus}></Dashboard>}></Route>
        </Routes>
    
    </BrowserRouter>
  );
}

export default App;
