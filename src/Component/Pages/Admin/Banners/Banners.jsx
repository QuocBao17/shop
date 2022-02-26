import Navbar from "../../../Navbar/Navbar";
import Header from "../../../Header/Header";
import Navigation from "../../../Navigation/Navigation";
import Random from "../../../RandomID/RandomID";
import { useState, useRef, useEffect} from "react";
import { database, storage } from "../../../Api/Config/firebase-config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore"; 
import './banner.scss';
const Banners =(props)=>{
    const myRef = useRef();
    const [filterName, setFilterName]=useState([]); // Filter name banner
    const [bannerName, setBannerName]=useState([]); // save banner name
    const [imageFile,setImageFile]=useState([]); // save image current
    const [change, setChange]=useState(true); // Help re-render when change state
    const [currentPage, setCurrentPage]=useState(1);
    //================================================
    //check edit
    const [idSelectEdit, setIdSelectEdit]=useState("");
    const [imageEdit, setImageEdit]=useState(''); 
    //================================================
    const [publishedStatus, setPublishedStatus]=useState([]); // Change published status
    var [list, setList]=useState([]); // List category
    const [sort, setSort]=useState('increase');// Sort category
      // Open add banner form
    const openForm=()=>{
        props.getFormStatus(true);
    }
    // Close add banner form
    const closeForm=()=>{
        props.getFormStatus(false);
    }
    // Edit banner on Firebase
    const editBanner=async(item)=>{
        openForm();
        setBannerName(item.bannerName);
        setIdSelectEdit(item.id)
        setImageEdit(item.image);
        setPublishedStatus(item.published);
    }
    const ChangeInputFile=(e)=>{
        const imgURl = e.target.files[0]
        setImageFile(imgURl)
    }
    const uploadImage=()=>{
        console.log(imageFile);
        if (!imageFile) return;
        const storageRef = ref(storage, `banner/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        return uploadTask;
    }
    const onSort=(e)=>{
        setSort(e.target.value);
    }
    // Get url image from firabase
    const getImageFile =async(uploadTask)=>{
        var url;
        await getDownloadURL(uploadTask.ref).then((downloadURL) => {
            url=downloadURL;
          });
        return url;
    }
    // Add banner to Firebase
     const handleBanner=async(e)=>{
        closeForm();
        e.preventDefault();
        // Save category
        if(idSelectEdit==''){
            var uploadTask= await uploadImage();
            var firebaseImg=await getImageFile(uploadTask);
            const RandomID=Random();
            const request={
                id:RandomID,
                bannerName:bannerName,
                image:firebaseImg,
                published:true
            }
            await setDoc(doc(database, "banner",RandomID),request);
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
                    bannerName:bannerName,
                    image:firebaseImg,
                    published:publishedStatus
                }
                await setDoc(doc(database, "banner",idSelectEdit),request);
                await getListBanner();
                setChange(!change);
                onClear();
                console.log('Update done')
            }
            //Edit category if dont pick new image
            else{
                const request={
                    id:idSelectEdit,
                    bannerName:bannerName,
                    image:imageEdit,
                    published:publishedStatus
                }
                await setDoc(doc(database, "banner",idSelectEdit),request);
                getListBanner();
                console.log('Update no pick image done')
            }
        }
    }
    // delete banner
    const deleteBanner=async(itemId)=>{
        await deleteDoc(doc(database, "banner",itemId));
        setChange(!change);
        console.log('delete done')
    }
      // clear data
    const onClear=()=>{
        setBannerName('');
        setImageFile('');
        setIdSelectEdit('');
        setImageEdit('');
        setPublishedStatus('');
    }
    const handleClickOutside = (e) => {
        if (!myRef.current.contains(e.target)) {
          closeForm();
          onClear();
        }
    };
      // Get list banner from firebase realtime
      const getListBanner= async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "banner"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setList(array);
    }
    // Get current page
    const getCurrentPage=(current)=>{
        setCurrentPage(current)
    }
    // Edit puclished status
    const changePublishedStatus= async(item)=>{
        const request={
            id:item.id,
            bannerName:item.bannerName,
            image:item.image,
            published:!item.published
        }
        await setDoc(doc(database, "banner",item.id),request);
        console.log('Change done')
        setChange(!change); 
    }
    var total=list.length;
    useEffect(()=>{
        getListBanner();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[change]);
    if(filterName){
        list=list.filter((item)=>{
            return item.bannerName.toLowerCase().indexOf(filterName)!== -1;
        })
    }
    if(sort==='increase'){
        list=list.sort((a,b)=>{
            if(a.bannerName>b.bannerName){
                return 1;
            }
            else if(a.bannerName<b.bannerName){
                return -1;
            }
            else return 0;
        })
    }
    else{
        list=list.sort((a,b)=>{
            if(a.bannerName>b.bannerName){
                return -1;
            }
            else if(a.bannerName<b.bannerName){
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
        <div className="banner">
            {
                checkSession?<div className={`banner__container ${props.formStatus?'openForm':'closeForm'}`}>
                <div className="banner__container__navbar">
                    <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                </div>
                <div className="banner__container__main">
                    <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                    <div className="banner__container__main__wrap">
                        <h2>Banner</h2>
                        <div className="function__banner">
                            <div className="function__banner__search">
                                <input type="text" onChange={(e)=>setFilterName(e.target.value)} placeholder="Search by product name"/>
                            </div>
                            <div className="function__banner__sort">
                            <select name="" id="" onChange={onSort}>
                                    <option value="increase">A - Z</option>
                                    <option value="decrease">Z - A</option>
                                </select>
                            </div>
                            <div className="function__banner__add-banner">
                                <button onClick={openForm}><span><i className="fas fa-plus" ></i></span>Add Coupons</button>
                            </div>
                        </div>
                        <div className="list__banner">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>IMAGE</th>
                                        <th>PUBLISHED</th>
                                        <th>ACTIVE</th>
                                    </tr>
                                   {   
                                       list.map((item,index)=>(
                                           <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.bannerName}</td>
                                                <td><img src={item.image} alt="" /></td>
                                                <td><div onClick={()=>changePublishedStatus(item)} className={item.published?'published':'published-disable'}></div></td>
                                                <td><i className="far fa-clipboard"  onClick={()=>editBanner(item)}></i><i className="far fa-trash-alt" onClick={()=>deleteBanner(item.id)}></i></td>
                                           </tr>
                                       ))
                                   }
                                </tbody>
                            </table>
                        </div>
                        <div className="list__coupons__navigation">
                            <Navigation listLenght={listLenght} getCurrentPage={getCurrentPage} total={total} title={'BANNERS'} currentPage={currentPage}></Navigation>
                        </div>
                    </div>
                </div>
                <div ref={myRef} className="banner__container__popup-add-banner">
                    <div className="banner__container__popup-add-banner__wrap">
                        <form action="">
                            <div className="add-banner__top-form">
                                <div className="add-banner__top-form__decription">
                                    <h2>Add banner</h2>
                                    <h3>Add your banner and necessary information from here</h3>
                                </div>
                                <div className="add-banner__top-form__close">
                                <i className="fas fa-times"onClick={closeForm}></i>
                                </div>
                            </div>
                            <div className="add-banner__center-form">
                            <div className="add-banner__name">
                                <p>Banner Name</p>
                                <input required type="text" value={bannerName|| ''} onChange={(e)=> setBannerName(e.target.value)}/>
                            </div>
                            <div className="add-banner__image">
                            <p>Banner Image</p>
                                <label htmlFor="image-icon">
                                    <img id='image' src='' alt="" />
                                    <i className="fas fa-file-upload"></i>
                                    <p>Pick your image here</p>
                                    <h6>(Only *.jpeg and *.png images will be accepted)</h6>
                                </label>
                                <input required id='image-icon' type="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e)=>{ChangeInputFile(e)}}/>
                            </div>
                            <div className="add-banner__button">
                                <div className="add-banner__button__cancel">
                                    <button >Cancel</button>
                                </div>
                                <div className="add-banner__button__add">
                                    <button type='submit' onClick={handleBanner}> Add Banner</button>
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
export default Banners;