import Header from "../../../Header/Header";
import Navbar from "../../../Navbar/Navbar";
import { database, storage } from "../../../Api/Config/firebase-config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore"; 
import './product.scss';
import { useState, useRef, useEffect} from "react";
import Navigation from "../../../Navigation/Navigation";
import Random from "../../../RandomID/RandomID";
import { Link } from "react-router-dom";
import ReactLoading from 'react-loading';
import IndexPage from "../../User/IndexPage/IndexPage";
const Product =(props)=>{
    const myRef = useRef();
    const [currentPage, setCurrentPage]=useState(1);
    const [idSelectEdit, setIdSelectEdit]=useState(""); // check edit or save
    const [imageEdit, setImageEdit]=useState(''); // check image edit ?
    const [productName, setProductName]=useState();  // save name product
    const [price,setPrice]=useState(); // save price product
    const [stock,setStock]=useState(); // save stock of product
    const [decription, setDecription]=useState(); //save decrtption to show in detail
    const [discount,setDiscount]=useState(0); // save discount of product
    const [imageFile,setImageFile]=useState(null); // save current image
    const [category, setCategory]=useState(); //save category of product
    const [published, setPublished]=useState(); // Change publish status
    const [change, setChange]=useState(true); // Help re-render when change state
    var [list, setList]=useState([]); // List product
    var [listCategory, setListCategory]=useState([]); // List category
    const [filterName, setFilterName]=useState(); // Filter name product
    const [filterCategory, setFilterCategory]=useState('all'); // Filter category
    const [sort, setSort]=useState('increase');// Sort product
    const getCurrentPage=(current)=>{
        setCurrentPage(current);
    }
    // Open add product form
    const openForm=()=>{
        props.getFormStatus(true);
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
        const storageRef = ref(storage, `product/${imageFile.name}`);
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
    // Delete product
      const deleteProduct=async(itemId)=>{
        await deleteDoc(doc(database, "product",itemId));
        setChange(!change);
        console.log('delete done')
    }
    // Edit puclished status
    const changePublished= async(item)=>{
        const request={
            id:item.id,
            name:item.name,
            image:item.image,
            decription:item.decription,
            discount:item.discount,
            price:item.price,
            stock:item.stock,
            category:item.category,
            published:!item.published
        }
        await setDoc(doc(database, "product",item.id),request);
        console.log('Change done')
        setChange(!change);            
    }
    // Edit category on Firebase
    const editProduct=async(item)=>{
        console.log(item)
        openForm();
        setIdSelectEdit(item.id);
        setImageEdit(item.image);// save url image current
        setProductName(item.name);
        setCategory(item.category);
        setDecription(item.decription);
        setStock(item.stock);
        setDiscount(item.discount);
        setPrice(item.price);
        setPublished(item.published);
    }
    // clear data
    const onClear=()=>{
        setCategory('');
        setIdSelectEdit('');
        setDecription('');
        setDiscount(0);
        setPrice('');
        setStock('');
        setPublished('');
        setProductName('');
        setImageFile('');
        console.log('clear done')
    }
    // Save and edit product
    const handleProduct=async(e)=>{
        closeForm();
        e.preventDefault();
        console.log(idSelectEdit)
        if(idSelectEdit==''){
            console.log(idSelectEdit)
            var uploadTask= await uploadImage();
            var firebaseImg=await getImageFile(uploadTask);
            const RandomID=Random();
            const request={
                id:RandomID,
                name:productName,
                image:firebaseImg,
                decription:decription,
                discount:discount,
                price:price,
                stock:stock,
                category:category,
                published:true
            }
            console.log(request)
            await setDoc(doc(database, "product",RandomID),request);
            console.log("Save done")
            onClear();
            setChange(!change);
        }
        else{
            //Edit category if pick new image
            if(imageFile){
                var uploadTask= await uploadImage();
                var firebaseImg=await getImageFile(uploadTask);
                const request={
                    id:idSelectEdit,
                    name:productName,
                    price:price,
                    decription:decription,
                    stock:stock,
                    category:category,
                    discount:discount,
                    image:firebaseImg,
                    published:published
                }
                await setDoc(doc(database, "product",idSelectEdit),request);
                setChange(!change);
                onClear();
                console.log('Update done')
            }
            //Edit category if dont pick new image
            else{
                const request={
                    id:idSelectEdit,
                    name:productName,
                    price:price,
                    stock:stock,
                    decription:decription,
                    discount:discount,
                    category:category,
                    image:imageEdit,
                    published:published
                }
                console.log(request)
                await setDoc(doc(database, "product",idSelectEdit),request);
                console.log('Update no pick image done');
                setChange(!change);
                onClear();
            }
        }
    }
    var total=list.length; // get total product
    const handleClickOutside = (e) => {
        if (!myRef.current.contains(e.target)) {
          closeForm();
          onClear();
        }
      }; 
    // Get list product from firebase
    const getListProduct= async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "product"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setList(array);
    }
    // Get list category from firebase realtime
    const getListCategory= async()=>{
    var array=[];
    const querySnapshot = await getDocs(collection(database, "category"));
    querySnapshot.forEach((doc) => {
    array.push(doc.data());
    });
    setListCategory(array);
    }
    useEffect(()=>{
        getListProduct();
        getListCategory();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[change]);
    if(filterName){
        list=list.filter((item)=>{
            return item.name.toLowerCase().indexOf(filterName)!== -1;
        })
    }
    if(sort==='increase'){
        list=list.sort((a,b)=>{
            if(+a.price>+b.price){
                return 1;
            }
            else if(+a.price<+b.price){
                return -1;
            }
            else return 0;
        })
    }
    else{
        list=list.sort((a,b)=>{
            if(+a.price>+b.price){
                return -1;
            }
            else if(+a.price<+b.price){
                return 1;
            }
            else return 0;
        })
    }
    if(filterCategory!='all'){
        list=list.filter((item)=>{
            console.log(item)
            console.log(filterCategory)
            return item.category=== filterCategory;
        })
    }
    if(currentPage){
        list=list.slice((currentPage-1)*10,(currentPage-1)*10+10);
    }
    let listLenght=list.length;
    var session = JSON.parse(localStorage.getItem('session'));
    console.log(session);
    var checkSession;
    var loading;
    if(session.role==''&&session.email==''){
        loading=true;
    }
    else{
        loading=false;
    }
    if(session.role==''){
        checkSession=false;
    }
    else{
        checkSession=true;
    }
    return(
        <div>
            {
                loading?<ReactLoading className="load" type={"spinningBubbles"} color={"#0E9F6E"} height={200} width={100} />:<div className="product">
                {
                    checkSession?<div className={`product__container ${props.formStatus?'openForm':'closeForm'}`}>
                    <div className="product__container__navbar">
                        <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                    </div>
                    <div className="product__container__main">
                        <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                        <div className="product__container__main__wrap">
                            <h2>Product</h2>
                            <div className="function__product">
                                <div className="function__product__search">
                                    <input type="text" placeholder="Search by product name" onChange={(e)=>setFilterName(e.target.value)}/>
                                </div>
                                <div className="function__product__filter" onChange={(e)=>setFilterCategory(e.target.value)}>
                                    <select name="" id="">
                                        <option value="all">All</option>
                                        {
                                            listCategory.map((item,index)=>(
                                                <option key={index} value={item.type}>{item.type}</option>
                                            ))
                                        }
    
                                    </select>
                                </div>
                                <div className="function__product__sort">
                                    <select name="" id="" onChange={(e)=>setSort(e.target.value)}>
                                        <option value="increase">Low to high</option>
                                        <option value="decrease">High to low</option>
                                    </select>
                                </div>
                                <div className="function__product__add-product">
                                    <button onClick={openForm}><span><i className="fas fa-plus"></i></span>Add Product</button>
                                </div>
                            </div>
                            <div className="list__product">
                            <table>
                                    <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>IMAGE</th>
                                        <th>CATEGORY</th>
                                        <th>PRICE</th>
                                        <th>STOCK</th>
                                        <th>DISCOUNT</th>
                                        <th>DETAILS</th>
                                        <th>PUBLISHED</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                    {
                                        list.map((item,index)=>(
                                            <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.name}</td>
                                                <td><img src={item.image} alt="" /></td>
                                                <td>{item.category}</td>
                                                <td>{item.price}</td>
                                                <td>{item.stock}</td>
                                                <td>{item.discount}%</td>
                                                <td><Link to={`${item.id}/detail`}><span className="far fa-eye" ></span></Link></td>
                                                <td><div className={`${item.published?'published':'published-disable'}`} onClick={()=>changePublished(item)}></div></td>
                                                <td><i onClick={()=>editProduct(item)} className="far fa-clipboard"></i><i onClick={()=>deleteProduct(item.id)} className="far fa-trash-alt"></i></td>
                                            </tr>
                                        ))
                                    }
                                    </tbody>
                                </table>
                            </div>
                            <div className="list__product__navigation">
                                <Navigation listLenght={listLenght} getCurrentPage={getCurrentPage} title={'PRODUCT'} currentPage={currentPage} total={total}></Navigation>
                            </div>
                        </div>
                    </div>
                    <div ref={myRef} className="product__container__popup-add-product">
                        <div className="product__container__popup-add-product__wrap">
                            <form action="">
                                <div className="add-product__top-form">
                                    <div className="add-product__top-form__decription">
                                        <h2>{idSelectEdit==''?'Add Product':'Update Product'}</h2>
                                        <h3>Add your Product category and necessary information from here</h3>
                                    </div>
                                    <div className="add-product__top-form__close">
                                    <i className="fas fa-times" onClick={closeForm} ></i>
                                    </div>
                                </div>
                                <div className="add-product__center-form">
                                <div className="add-product__name">
                                    <p>Product Name</p>
                                    <input required type="text" value={productName || ''} placeholder="Product name" onChange={(e)=>{
                                        setProductName(e.target.value);
                                    }} />
                                </div>
                                <div className="add-product__image">
                                    <p>Product image</p>
                                    <label htmlFor="image-icon">
                                        <img id='image' src='' alt="" />
                                        <i className="fas fa-file-upload"></i>
                                        <p>Pick your image here</p>
                                        <h6>(Only *.jpeg and *.png images will be accepted)</h6>
                                    </label>
                                    <input required id='image-icon' type="file" accept="image/x-png,image/gif,image/jpeg" onChange={(e)=>{ChangeInputFile(e)}} />
                                </div>
                                <div className="add-product__name">
                                    <p>Product Type</p>
                                    <select name="" id="" onChange={(e)=>{
                                        setCategory(e.target.value);
                                    }}>
                                        {
                                            listCategory.map((item,index)=>(
                                                <option key={index} >{item.type}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="add-product__name">
                                    <p>Price</p>
                                    <input required type="text" value={price||''} placeholder="Price" onChange={(e)=>{
                                        setPrice(e.target.value);
                                    }} />
                                </div>
                                <div className="add-product__decription">
                                    <p>Decription</p>
                                    <textarea name="" id="" cols="30" rows="5" placeholder="Typing ..." value={decription||''} onChange={(e)=>setDecription(e.target.value)}></textarea>
                                </div>
                                <div className="add-product__name">
                                    <p>Stock</p>
                                    <input required type="text" placeholder="Stock" value={stock||''} onChange={(e)=>{
                                        setStock(e.target.value);
                                    }}/>
                                </div>
                                <div className="add-product__name">
                                    <p>Discount</p>
                                    <input required type="text" placeholder="Discount" value={discount} onChange={(e)=>{
                                        setDiscount(e.target.value);
                                    }} />
                                </div>
                                <div className="add-product__button">
                                    <div className="add-product__button__cancel">
                                        <button >Cancel</button>
                                    </div>
                                    <div className="add-product__button__add">
                                        <button type='submit' onClick={handleProduct} >{idSelectEdit==''?'Add Product':'Update Product'}</button>
                                    </div>
                                </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>: <IndexPage></IndexPage>
                }
            </div>
            }
        </div>
    )
}
export default Product;