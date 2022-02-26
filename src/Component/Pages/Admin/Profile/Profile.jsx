import './profile.scss';
import Navbar from '../../../Navbar/Navbar';
import Header from '../../../Header/Header';
import { useRef, useState,useEffect } from 'react';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword,updateEmail } from "firebase/auth";
import { doc, collection,setDoc,getDocs, deleteDoc, getDoc} from "firebase/firestore"; 
import { database, storage } from "../../../Api/Config/firebase-config";
import CheckRole from '../../../CheckRole/CheckRole';
const Profile =(props)=>{
    
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
    var session = localStorage.getItem('session');
    var infoUser= JSON.parse(session);
    const findUser= async(infoUser)=>{
        var email =infoUser.email;
        const docRef = doc(database, "staff",email);
        const docSnap = await getDoc(docRef);
        setFieldsInput({
            ...fieldsInput,
            fields:{
                ...fieldsInput.fields,
                name:docSnap.data().name,
                avatar:docSnap.data().avatar,
                email:docSnap.data().email,
                role:docSnap.data().role,
                phone:docSnap.data().phone,
                password:docSnap.data().password,
                joinDate:docSnap.data().joinDate
            }
        })
    }
    var checkSession;
    if(session==''){
        checkSession=false;
    }
    else{
        checkSession=true;
    }
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
        if(imageFile!==null){
           await edit();
        }
        else{
            await save();
        }
        setChange(!change);
    }
    // Delete staff
    const deleteStaff=async(email)=>{
        await deleteDoc(doc(database, "product",email));
        setChange(!change);
        console.log('delete done')
    }
     // Delete user
     const deleteUser=async(email)=>{
        await deleteDoc(doc(database, "users",email));
        setChange(!change);
        console.log('delete done')
    }
    const edit=async()=>{
        var uploadTask= await uploadImage();
        var firebaseImg=await getImageFile(uploadTask);
        let fields= fieldsInput.fields;
        const request={
            name:fields['name'],
            avatar:firebaseImg,
            email:fields['email'],
            phone:fields['phone'],
            password:fields['password'],
            joinDate:fields['joinDate'],
            role:fields['role']
        }
        const requestUser={
            email:fields['email'],
            name:fields['name'],
            password:fields['password'],
            avatar:firebaseImg,
            role:fields['role']
        }
        await setDoc(doc(database, "staff",fieldsInput.fields['email']),request);
        await setDoc(doc(database, "users",fieldsInput.fields['email']),requestUser);
    }
    const save=async()=>{
        let fields= fieldsInput.fields;
        const request={
            name:fields['name'],
            avatar:fields['avatar'],
            email:fields['email'],
            phone:fields['phone'],
            password:fields['password'],
            joinDate:fields['joinDate'],
            role:fields['role']
        }
        const requestUser={
            email:fields['email'],
            name:fields['name'],
            password:fields['password'],
            avatar:fields['avatar'],
            role:fields['role']
        }
        await setDoc(doc(database, "staff",fieldsInput.fields['email']),request);
        await setDoc(doc(database, "users",fieldsInput.fields['email']),requestUser);
        const auth = getAuth();
        updateEmail(auth.currentUser, fieldsInput.fields['email']).then(() => {
        // Email updated!
        // ...
        }).catch((error) => {
        // An error occurred
        // ...
        });
        setChange(!change);
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
        findUser(infoUser);
        // document.addEventListener("mousedown", handleClickOutside);
        // return () => document.removeEventListener("mousedown", handleClickOutside);
    },[change]);
  
    return(
        <div className="profile">
            {
                checkSession?<div className={`profile__container ${props.formStatus?'openForm':'closeForm'}`}>
                <div className="profile__container__navbar">
                    <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                </div>
                <div className="profile__container__main">
                    <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                    <div className="profile__container__main__wrap">
                        <h2>Edit Profile</h2>
                        <div className="form-profile">
                            <form action="">
                                <div className="form-profile__image">
                                <p>Profile Picture</p>
                                <input type="file" id='image-profile'  onChange={ChangeInputFile}/>
                                <label htmlFor="image-profile">
                                        <img id='image' src='' alt="" />
                                        <i className="fas fa-file-upload"></i>
                                        <p>Pick your image here</p>
                                        <h6>(Only *.jpeg and *.png images will be accepted)</h6>
                                    </label>
                                </div>
                                <div className="form-profile__name">
                                    <p>Name</p>
                                    <input type="text" value={fieldsInput.fields['name']||''} name='name' onChange={handleChange} />
                                </div>
                                <div className="form-profile__name">
                                    <p>Contact Phone</p>
                                    <input type="text" value={fieldsInput.fields['phone']||''} name="phone" onChange={handleChange} />
                                </div>
                                <div className="form-profile__name">
                                    <p>Role</p>
                                    <select name="" id="" name='role' value={fieldsInput.fields['role']||''} onChange={handleChange}>
                                        {
                                            roleList.map((item,index)=>(
                                                <option value={item} key={index}>{item}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="form-profile__button">
                                    <button type='submit' onClick={handleSubmit}>Update Profile</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>:<div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default Profile;