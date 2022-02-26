import './staff.scss';
import Navbar from '../../../Navbar/Navbar';
import Header from '../../../Header/Header';
import { useRef, useState,useEffect } from 'react';
import Random from '../../../RandomID/RandomID';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword,deleteUser } from "firebase/auth";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore"; 
import { database, storage } from "../../../Api/Config/firebase-config";
import Navigation from '../../../Navigation/Navigation';
import { async } from '@firebase/util';
import CheckRole from '../../../CheckRole/CheckRole';
const Staff =(props)=>{
    const myRef = useRef();
    const [currentPage, setCurrentPage]=useState(1);
    var [list, setList]=useState([]); // List staff
    const [imageFile,setImageFile]=useState(null); // save current image
    const [change, setChange]=useState(true); // Help re-render when change state
    const [fieldsInput,setFieldsInput]=useState({
        fields:{},
        errors:{}
    })
    var total=list.length;
    var roleList =[
        'Admin','CEO','Manager'
    ]
    const [filterName, setFilterName]=useState([]);
    const [filterRole, setFilterRole]=useState("All");
     // Open add product form
     const openForm=()=>{
        props.getFormStatus(true);
    }
    // Get current page
    const getCurrentPage=(current)=>{
        setCurrentPage(current)
    }
    // Close add product form
    const closeForm=()=>{
  
        props.getFormStatus(false);
    }
    const ChangeInputFile=(e)=>{
        const imgURl = e.target.files[0]
        setImageFile(imgURl)
    }
    const uploadImage=()=>{
        console.log(imageFile);
        if (!imageFile) return;
        const storageRef = ref(storage, `staff/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        return uploadTask;
    }
    // Get url image from firabase
    const getImageFile =async(uploadTask)=>{
        var url;
        await getDownloadURL(uploadTask.ref).then((downloadURL) => {
            url=downloadURL;
          });
        return url;
    }
    // Edit category on Firebase
    const createUser=()=>{
        const auth = getAuth();
        const email = fieldsInput.fields['email'];
        const password = fieldsInput.fields['password'];
        createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            console.log("Add Staff done")
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            // ..
        });
    }
    const clearForm=()=>{
        let unknow;
        let errors={};
        let fields=fieldsInput.fields;
        setImageFile(null);
        setFieldsInput({
            ...fieldsInput,
            fields:{
                ...fields,
                email:unknow,
                password:unknow,
                name:unknow,
                role:unknow,
                phone:unknow
            },
            errors
        })
    }
    const handleChange=(e)=>{
        const target=e.target;
        const name=target.name;
        const value=target.value;
        const fields =fieldsInput.fields;
        console.log(name);
        console.log(value);
        setFieldsInput({
            ...fieldsInput,
            fields:{
                ...fields,
                [name]:value
            }
        })
    }
    //Save and edit staff
    const handleSubmit=async(e)=>{
        e.preventDefault();
        let errors={};
        let formisEnter=true;
        if(checkEnterInput(errors,formisEnter)){
            closeForm();
            await save();
            await createUser();
            await setChange(!change)
            console.log('save done');
        }

        setChange(!change);
        // clearForm();
        setFieldsInput({
            ...fieldsInput,
            errors,
        })
    }
    // Check input not null
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
        // Name
        if(typeof fields['name']=='undefined'){
            formIsEnter=false;
            errors['name']='Please enter name'
        }
        // Phone
        if(typeof fields['phone']=='undefined'){
            formIsEnter=false;
            errors['phone']='Please enter your phone'
        }
        // Role
        if(typeof fields['role']=='undefined'){
            formIsEnter=false;
            errors['role']="Please choose the role"
        }
        // Image
        if(imageFile == null){
            formIsEnter=false;
            errors['image']="Please pick the image"
        }
        return formIsEnter;
    }
    const save=async()=>{
        var uploadTask= await uploadImage();
        var firebaseImg=await getImageFile(uploadTask);
        let fields= fieldsInput.fields;
        let day= new Date();
        let today = day.getFullYear()+'-'+day.getMonth()+1+"-"+day.getDate();
        const RandomID=Random();
        const request={
            name:fields['name'],
            avatar:firebaseImg,
            email:fields['email'],
            phone:fields['phone'],
            password:fields['password'],
            joinDate:today,
            role:fields['role']
        }
        const requestUser={
            email:fields['email'],
            name:fields['name'],
            password:fields['password'],
            avatar:firebaseImg,
            role:fields['role']
        }
        console.log(request)
    
        await setDoc(doc(database, "users",fields['email']),requestUser);
        await setDoc(doc(database, "staff",fields['email']),request);
    }

    const handleClickOutside = (e) => {
        if (!myRef.current.contains(e.target)) {
          closeForm();
          clearForm();
        }
      };
    const getListStaff=async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "staff"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setList(array);
    }
    useEffect(()=>{
        getListStaff();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[change]);
    if(filterName){
        list=list.filter((item)=>{
            return item.name.toLowerCase().indexOf(filterName)!== -1;
        })
    }
    if(filterRole!='All'){
        list=list.filter((item)=>{
            return item.role=== filterRole;
        })
    }
    var session = localStorage.getItem('session');
    var checkSession;
    if(currentPage){
        list=list.slice((currentPage-1)*10,(currentPage-1)*10+10);
    }
    let listLenght=list.length;
    if(session==''){
        checkSession=false;
    }
    else{
        checkSession=true;
    }
    return(
        <div className="staff">
            {
                checkSession?<div className={`staff__container ${props.formStatus?'openForm':'closeForm'}`}>
                <div className="staff__container__navbar">
                    <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                </div>
                <div className="staff__container__main">
                    <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                    <div className="staff__container__main__wrap">
                        <h2>Our Staffs</h2>
                        <div className="function__staff">
                            <div className="function__staff__search">
                                <input type="text" placeholder="Search by product name" onChange={(e)=>setFilterName(e.target.value)}/>
                            </div>
                            <div className="function__staff__select">
                            <select name="" id="" onChange={(e)=>setFilterRole(e.target.value)}>
                                <option value="All">All</option>
                                    {
                                        roleList.map((item,index)=>(
                                            <option value={item} key={index}>{item}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="function__staff__add-staff">
                                <button onClick={openForm}><span><i className="fas fa-plus" ></i></span>Add Staff</button>
                            </div>
                        </div>
                        <div className="list__staff">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>PHONE</th>
                                        <th>JOINING DATE</th>
                                        <th>ROLE</th>
                                    </tr>
                                   
                                    {
                                        list.map((item,index)=>(
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td className='name'><img src={item.avatar} alt="" /> <p>{item.name}</p> </td>
                                            <td>{item.email}</td>
                                            <td>{item.phone}</td>
                                            <td>{item.joinDate}</td>
                                            <td>{item.role}</td>
                                        </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                        <div className="list__staff__navigation">
                            <Navigation listLenght={listLenght} getCurrentPage={getCurrentPage} total={total} title={'STAFF'} currentPage={currentPage}></Navigation>
                        </div>
                    </div>
                </div>
                <div ref={myRef} className="staff__container__popup-add-staff">
                    <div className="staff__container__popup-add-staff__wrap">
                        <form action="">
                            <div className="add-staff__top-form">
                                <div className="add-staff__top-form__decription">
                                    <h2>Add Staff</h2>
                                    <h3>Add your Staff and necessary information from here</h3>
                                </div>
                                <div className="add-staff__top-form__close">
                                <i className="fas fa-times" onClick={closeForm} ></i>
                                </div>
                            </div>
                            <div className="add-staff__center-form">
                            <div className="add-staff__name">
                                <p>Name</p>
                                <div className="input">
                                    <input  type="text" placeholder='Staff name' name='name' value={fieldsInput.fields['name']||''} onChange={handleChange}/>
                                    <span>{fieldsInput.errors['name']}</span>
                                </div>
                            </div>
                            
                            <div className="add-staff__name">
                                <p>Email</p>
                                <div className="input">
                                    <input  type="email" placeholder='Email' name='email' value={fieldsInput.fields['email']||''} onChange={handleChange}/>
                                    <span>{fieldsInput.errors['email']}</span>
                                </div>
                            </div>
                            <div className="add-staff__name">
                                <p>Password</p>
                                <div className="input">
                                    <input  type="password" placeholder='Password' name='password' value={fieldsInput.fields['password']||''} onChange={handleChange}/>
                                    <span>{fieldsInput.errors['password']}</span>
                                </div>
                            </div>
                            <div className="add-staff__name">
                                <p>Contact Number</p>
                                <div className="input">
                                    <input type="text" placeholder='Phone number' name='phone' value={fieldsInput.fields['phone']||''} onChange={handleChange}/>
                                    <span>{fieldsInput.errors['phone']}</span>
                                </div>
                            </div>
                            <div className="add-staff__name">
                                <p>Staff role</p>
                                <div className="input">
                                    <select name="" id="" name='role' value={fieldsInput.fields['role']||''} onChange={handleChange}>
                                        {
                                            roleList.map((item,index)=>(
                                                <option value={item} key={index}>{item}</option>
                                            ))
                                        }
                                    </select>
                                    <span>{fieldsInput.errors['role']}</span>
                                </div>
                            </div>
                            <div className="add-staff__image">
                                <p>Staff Image</p>
                                <div className="input">
                                    <label htmlFor="image-icon">
                                        <img id='image' src='' alt="" />
                                        <i className="fas fa-file-upload"></i>
                                        <p>Pick your image here</p>
                                        <h6>(Only *.jpeg and *.png images will be accepted)</h6>
                                    </label>
                                    <input id='image-icon' type="file" name='image' accept="image/x-png,image/gif,image/jpeg"  onChange={ChangeInputFile}/>
                                    <span>{fieldsInput.errors['image']}</span>
                                </div>
                            </div>
                            <div className="add-staff__button">
                                <div className="add-staff__button__cancel">
                                    <button >Cancel</button>
                                </div>
                                <div className="add-staff__button__add">
                                    <button type='submit' onClick={handleSubmit}> Add Staff</button>
                                </div>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>:<div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default Staff;