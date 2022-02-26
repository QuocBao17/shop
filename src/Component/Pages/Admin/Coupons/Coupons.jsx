import Header from "../../../Header/Header";
import Navbar from "../../../Navbar/Navbar";
import { useState, useRef, useEffect} from "react";
import Navigation from "../../../Navigation/Navigation";
import Random from "../../../RandomID/RandomID";
import { database, storage } from "../../../Api/Config/firebase-config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore"; 
import './coupons.scss';
const Counpons=(props)=>{
    const [change, setChange]=useState(true); // Help re-render when change state
    var [listCategory, setListCategory]=useState([]); // List category
    var [list, setList]=useState([]); // List coupons
    const [currentPage, setCurrentPage]=useState(1);
    const [idSelectEdit, setIdSelectEdit]=useState(""); // check edit or save
    const [campaignName, setCampaignName]=useState([]); // save campaign name
    const [campaignCode, setCampaignCode]=useState([]); // save campaign code
    const [discount,setDiscount]=useState([]); // save discount of coupons
    const [minimum, setMinimum]=useState([]); // save minimum
    const [category,setCategory]=useState([]); //save category to discount
    const [startDate, setStartDate]=useState([]); // save time
    const [endDate, setEndDate]=useState([]); // save time 
    const [filterName, setFilterName]=useState([]); // Filter name coupons
    // Delete product
    const deleteCoupons=async(itemId)=>{
        await deleteDoc(doc(database, "coupons",itemId));
        setChange(!change);
        console.log('delete done')
    }
    // Edit category on Firebase
    const editCoupons=async(item)=>{
        openForm();
        setIdSelectEdit(item.id);
        setCampaignCode(item.code);
        setCampaignName(item.name);
        setDiscount(item.discount);
        setStartDate(item.start);
        setEndDate(item.end);
        setCategory(item.category);
        setMinimum(item.minimum);
    }
    const myRef = useRef();
    // Open add product form
    const openForm=()=>{
        props.getFormStatus(true);
    }
    // Close add product form
    const closeForm=()=>{
        props.getFormStatus(false);
    }
     // clear data
    const onClear=()=>{
        setIdSelectEdit('');
        setMinimum('');
        setCampaignCode('');
        setCampaignName('');
        setDiscount('');
        setStartDate('');
        setEndDate('');
        setCategory('');
        console.log('clear done')
    }
    // Get current page
    const getCurrentPage=(current)=>{
        setCurrentPage(current)
    }
    var total=list.length;
    var day= new Date();
    var today = day.getFullYear()+'-'+day.getMonth()+1+"-"+day.getDate();
    // Get list category from firebase realtime
       const getListCategory= async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "category"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setListCategory(array);
    }
     // Get list coupons from firebase
     const getListCoupons= async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "coupons"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setList(array);
    }
     // Save and edit product
     const handleCoupons=async(e)=>{
        closeForm();
        e.preventDefault();
        if(idSelectEdit==''){
            const RandomID=Random();
            const request={
                id:RandomID,
                name:campaignName,
                code:campaignCode,
                discount:discount,
                category:category,
                start:startDate,
                end:endDate,
                minimum:minimum
            }
            await setDoc(doc(database, "coupons",RandomID),request);
            console.log("Save done")
            onClear();
            setChange(!change);
        }
        else{
            const request={
                id:idSelectEdit,
                name:campaignName,
                code:campaignCode,
                discount:discount,
                category:category,
                start:startDate,
                end:endDate
            }
            await setDoc(doc(database, "coupons",idSelectEdit),request);
            setChange(!change);
            onClear();
            console.log('Update done')
        }
    }
    const handleClickOutside = (e) => {
        if (!myRef.current.contains(e.target)) {
          closeForm();
          onClear();
        }
    };
    useEffect(()=>{
        getListCoupons();
        getListCategory();
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    },[change]);
    if(filterName){
        list=list.filter((item)=>{
            return item.name.toLowerCase().indexOf(filterName)!== -1;
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
    return (
        <div className="coupons">
            {
                checkSession?<div className={`coupons__container ${props.formStatus?'openForm':'closeForm'}`}>
                <div className="coupons__container__navbar">
                    <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                </div>
                <div className="coupons__container__main">
                    <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                    <div className="coupons__container__main__wrap">
                        <h2>Coupons</h2>
                        <div className="function__coupons">
                            <div className="function__coupons__search">
                                <input type="text" onChange={(e)=>setFilterName(e.target.value)} placeholder="Search by product name"/>
                            </div>
                            <div className="function__coupons__add-coupons">
                                <button onClick={openForm}><span><i className="fas fa-plus" ></i></span>Add Coupons</button>
                            </div>
                        </div>
                        <div className="list__coupons">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>START DATE</th>
                                        <th>END DATE</th>
                                        <th>CAMPAIGNS NAME</th>
                                        <th>CODE</th>
                                        <th>DISCOUNT</th>
                                        <th>CATEGORY</th>
                                        <th>STATUS</th>
                                        <th>ACTIONS</th>
                                    </tr>
                                   {
                                       list.map((item,index)=>(
                                           <tr key={index}>
                                                <td>{index+1}</td>
                                                <td>{item.start}</td>
                                                <td>{item.end}</td>
                                                <td>{item.name}</td>
                                                <td>{item.code}</td>
                                                <td>{item.discount}</td>
                                                <td>{item.category}</td>
                                                {item.end > today?<td className="active"><p>Active</p></td>:<td className="expire"><p>Expired</p></td>}
                                               
                                                <td><i className="far fa-clipboard" onClick={(e)=>editCoupons(item)}></i><i className="far fa-trash-alt" onClick={(e)=>deleteCoupons(item.id)}></i></td>
                                           </tr>
                                       ))
                                   }
                                </tbody>
                            </table>
                        </div>
                        <div className="list__coupons__navigation">
                            <Navigation listLenght={listLenght} getCurrentPage={getCurrentPage} total={total} title={'COUPONS'} currentPage={currentPage}></Navigation>
                        </div>
                    </div>
                </div>
                <div ref={myRef} className="coupons__container__popup-add-coupons">
                    <div className="coupons__container__popup-add-coupons__wrap">
                        <form action="">
                            <div className="add-coupons__top-form">
                                <div className="add-coupons__top-form__decription">
                                    <h2>Add Coupons</h2>
                                    <h3>Add your Coupons and necessary information from here</h3>
                                </div>
                                <div className="add-coupons__top-form__close">
                                <i className="fas fa-times"onClick={closeForm}></i>
                                </div>
                            </div>
                            <div className="add-coupons__center-form">
                            <div className="add-coupons__name">
                                <p>Campaign Name</p>
                                <input required type="text" value={campaignName|| ''} onChange={(e)=> setCampaignName(e.target.value)}/>
                            </div>
                            <div className="add-coupons__name">
                                <p>Campaign Code</p>
                                <input required type="text" value={campaignCode||''} onChange={(e)=>setCampaignCode(e.target.value)}/>
                            </div>
                            <div className="add-coupons__name">
                                <p>Discount</p>
                                <input required type="text" value={discount||''} onChange={(e)=>setDiscount(e.target.value)}/>
                            </div>
                            <div className="add-coupons__name">
                                <p>Minimum Amount</p>
                                <input required type="text" value={minimum} onChange={(e)=>setMinimum(e.target.value)}/>
                            </div>
                            <div className="add-coupons__name">
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
                            <div className="add-coupons__name">
                                <p>Start Date</p>
                                <input type="date" value={startDate} onChange={(e)=>setStartDate(e.target.value)}/>
                            </div>
                            <div className="add-coupons__name">
                                <p>End Date</p>
                                <input type="date"value={endDate} onChange={(e)=>setEndDate(e.target.value)}/>
                            </div>
                            <div className="add-coupons__button">
                                <div className="add-coupons__button__cancel">
                                    <button >Cancel</button>
                                </div>
                                <div className="add-coupons__button__add">
                                    <button type='submit'  onClick={handleCoupons}>{idSelectEdit==''?'Add Coupons':'Update Coupons'}</button>
                                </div>
                            </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>: <div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default Counpons;