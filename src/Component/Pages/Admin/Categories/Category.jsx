import Header from "../../../Header/Header";
import Navbar from "../../../Navbar/Navbar";
import { useState,useRef, useEffect } from "react";
import { database, storage } from "../../../Api/Config/firebase-config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore"; 
import './category.scss'
import Random from "../../../RandomID/RandomID";
import Navigation from "../../../Navigation/Navigation";
// chưa fix dc onchange img
const Category =(props)=>{
    const [category, setCategory]=useState([]);  // save current category
    const [imageFile,setImageFile]=useState(null); // save current image
    const [idSelectEdit, setIdSelectEdit]=useState("");
    const [imageEdit, setImageEdit]=useState(''); 
    const [publishedStatusEdit, setPublishedStatusEdit]=useState([]); // Change published status
    const [filterName, setFilterName]=useState([]); // Filter category
    const [sort, setSort]=useState('increase');// Sort category
    const [change, setChange]=useState(true); // Help re-render when change state
    const [currentPage, setCurrentPage]=useState(1);
    var [list, setList]=useState([]); // List category
    const openForm=()=>{
        props.getFormStatus(true);
    }
    const closeForm=()=>{
        props.getFormStatus(false);
    }
    // clear data
    const onClear=()=>{
        setCategory('');
        setImageFile('');
        setIdSelectEdit('');
        setImageEdit('');
        setPublishedStatusEdit('');
    }
    const myRef = useRef();
    const handleClickOutside = (e) => {
      if (!myRef.current.contains(e.target)) {
        closeForm();
        onClear();
      }
    };
    const ChangeInputFile=(e)=>{
        console.log('a')
        const imgURl = e.target.files[0]
        setImageFile(imgURl)
    }
    // change input filter
    const ChangeInputFilter=(e)=>{
        setFilterName(e.target.value);
    }
    //upload image to Firebase
    const uploadImage=()=>{
        console.log(imageFile);
        if (!imageFile) return;
        const storageRef = ref(storage, `category/${imageFile.name}`);
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
    // Add category to Firebase
    const handleCategory=async(e)=>{
        closeForm();
        e.preventDefault();
        // Save category
        if(idSelectEdit==''){
            var uploadTask= await uploadImage();
            var firebaseImg=await getImageFile(uploadTask);
            const RandomID=Random();
            const request={
                id:RandomID,
                type:category,
                image:firebaseImg,
                published:true
            }
            await setDoc(doc(database, "category",RandomID),request);
            console.log("Save done")
            setChange(!change);
            onClear();
        }
        else{
            //Edit category if pick new image
            if(imageFile){
                var uploadTask= await uploadImage();
                var firebaseImg=await getImageFile(uploadTask);
                const request={
                    id:idSelectEdit,
                    type:category,
                    image:firebaseImg,
                    published:publishedStatusEdit
                }
                await setDoc(doc(database, "category",idSelectEdit),request);
                await getListCategory();
                setChange(!change);
                onClear();
                console.log('Update done')
            }
            //Edit category if dont pick new image
            else{
                const request={
                    id:idSelectEdit,
                    type:category,
                    image:imageEdit,
                    published:publishedStatusEdit
                }
                await setDoc(doc(database, "category",idSelectEdit),request);
                getListCategory();
                console.log('Update no pick image done')
            }
        }
    }
    // delete category
    const deleteCategory=async(itemId)=>{
        await deleteDoc(doc(database, "category",itemId));
        setChange(!change);
        console.log('delete done')
    }
    // Edit category on Firebase
    const editCategory=async(item)=>{
        openForm();
        setCategory(item.type);
        setIdSelectEdit(item.id)
        setImageEdit(item.image);
        setPublishedStatusEdit(item.published);
       
    }
    // Edit puclic status
    const changePublishedStatus= async(item)=>{
        const request={
            id:item.id,
            type:item.type,
            image:item.image,
            published:!item.published
        }
        await setDoc(doc(database, "category",item.id),request);
        console.log('Change done')
        setChange(!change);
        
    }
    // Get list category from firebase realtime
    const getListCategory= async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "category"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setList(array);
    }
    const onSort=(e)=>{
        setSort(e.target.value);
    }
    const getCurrentPage=(current)=>{
        setCurrentPage(current)
    }
    var total=list.length;
    useEffect(()=>{
        getListCategory();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[change]);
    // Change list before render => filter , sort
    if(filterName){
        list=list.filter((item)=>{
            return item.type.toLowerCase().indexOf(filterName)!== -1;
        })
    }
    if(sort==='increase'){
        list=list.sort((a,b)=>{
            if(a.type>b.type){
                return 1;
            }
            else if(a.type<b.type){
                return -1;
            }
            else return 0;
        })
    }
    else{
        list=list.sort((a,b)=>{
            if(a.type>b.type){
                return -1;
            }
            else if(a.type<b.type){
                return 1;
            }
            else return 0;
        })
    }
    if(currentPage){
        list=list.slice((currentPage-1)*10,(currentPage-1)*10+10);
    }
    let listLenght=list.length;
    var session = JSON.parse(localStorage.getItem('session'));
    var checkSession;
    if(session.role==''){
        checkSession=false;
    }
    else{
        checkSession=true;
    }
    return(
        <div className="category">
            {
                checkSession?<div className={`category__container ${props.formStatus?'openForm':'closeForm'}`}>
                <div className="category__container__navbar">
                    <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                </div>
                <div className="category__container__main">
                    <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                    <div className="category__container__main__wrap">
                        <h2>Category</h2>
                        <div className="function__category">
                            <div className="function__category__search">
                                <input onChange={ChangeInputFilter} type="text" placeholder="Search by category type"/>
                            </div>
                            <div className="function__category__sort">
                                <select name="" id="" onChange={onSort}>
                                    <option value="increase">A - Z</option>
                                    <option value="decrease">Z - A</option>
                                </select>
                            </div>
                            <div className="function__category__add-category">
                                <button onClick={openForm}><span><i className="fas fa-plus"></i></span>Add Category</button>
                            </div>
                        </div>
                        <div className="list__category">
                            <table>
                                <tbody>
                                <tr>
                                    <th>ID</th>
                                    <th>TYPE</th>
                                    <th>IMAGE</th>
                                    <th>PUBLISHED</th>
                                    <th>ACTION</th>
                                </tr>
                                {
                                    list.map((item, index)=>(
                                       <tr key={index}>
                                           <td>{index+1}</td>
                                           <td>{item.type}</td>
                                           <td><img src={item.image} alt="" /></td>
                                           <td><div onClick={()=>changePublishedStatus(item)} className={item.published?'published':'published-disable'}></div></td>
                                           <td><i className="far fa-clipboard" onClick={()=>editCategory(item)}></i><i onClick={()=>deleteCategory(item.id)} className="far fa-trash-alt"></i></td>
                                       </tr>
                                    ))
                                }
                                </tbody>
                            </table>
                        </div>
                        <div className="list__category__navigation">
                            <Navigation listLenght={listLenght} getCurrentPage={getCurrentPage} total={total} title={'CATEGORY'} currentPage={currentPage}></Navigation>
                        </div>
                    </div>
                </div>
                <div ref={myRef} className="category__container__popup-add-category">
                    <div className="category__container__popup-add-category__wrap">
                        <form action="">
                            <div className="add-category__top-form">
                                <div className="add-category__top-form__decription">
                                    <h2>{idSelectEdit==''?'Add Category':'Update Category'}</h2>
                                    <h3>Add your Product category and necessary information from here</h3>
                                </div>
                                <div className="add-category__top-form__close">
                                <i className="fas fa-times" onClick={closeForm}></i>
                                </div>
                            </div>
                            <div className="add-category__center-form">
                            <div className="add-category__type">
                                <p>Product Type</p>
                                <input required type="text" placeholder="Product type" value={category||''} onChange={(e)=>{
                                    setCategory(e.target.value);
                                }}/>
                            </div>
                            <div className="add-category__image">
                                <p>Category icon</p>
                                <label htmlFor="image-icon">
                                    <img id='image' src='' alt="" />
                                    <i className="fas fa-file-upload"></i>
                                    <p>Pick your image here</p>
                                    <h6>(Only *.jpeg and *.png images will be accepted)</h6>
                                </label>
                                <input required id='image-icon' type="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e)=>{ChangeInputFile(e)}}/>
                            </div>
                            <div className="add-category__button">
                                <div className="add-category__button__cancel">
                                    <button onClick={onClear}>Cancel</button>
                                </div>
                                <div className="add-category__button__add">
                                    <button type='submit' onClick={handleCategory}>{idSelectEdit==''?'Add Category':'Update Category'}</button>
                                </div>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>:  <div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default Category;