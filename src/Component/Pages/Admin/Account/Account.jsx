import './account.scss';
import Navbar from '../../../Navbar/Navbar';
import Header from '../../../Header/Header';
import { useRef, useState,useEffect } from 'react';
import Random from '../../../RandomID/RandomID';
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getAuth, createUserWithEmailAndPassword,deleteUser } from "firebase/auth";
import { doc, collection,setDoc,getDocs, deleteDoc} from "firebase/firestore"; 
import { database, storage } from "../../../Api/Config/firebase-config";
import Navigation from '../../../Navigation/Navigation';
const Account =(props)=>{
    const myRef = useRef();
    const [currentPage, setCurrentPage]=useState(1);
    var [list, setList]=useState([]); // List staff
    const [sort, setSort]=useState('increase');// Sort category
    const [change, setChange]=useState(true); // Help re-render when change state
    const [fieldsInput,setFieldsInput]=useState({
        fields:{},
        errors:{}
    })
    var total=list.length;
    var roleList =[
        'Admin','CEO','Manager'
    ]
    // Get current page
    const getCurrentPage=(current)=>{
        setCurrentPage(current)
    }
    const onSort=(e)=>{
        setSort(e.target.value);
    }
    const [filterName, setFilterName]=useState([]);
    const [filterRole, setFilterRole]=useState("All");
    const getListStaff=async()=>{
        var array=[];
        const querySnapshot = await getDocs(collection(database, "users"));
        querySnapshot.forEach((doc) => {
        array.push(doc.data());
        });
        setList(array);
    }
    useEffect(()=>{
        getListStaff();
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
    if(sort==='increase'){
        list=list.sort((a,b)=>{
            if(a.name>b.name){
                return 1;
            }
            else if(a.name<b.name){
                return -1;
            }
            else return 0;
        })
    }
    else{
        list=list.sort((a,b)=>{
            if(a.name>b.name){
                return -1;
            }
            else if(a.name<b.name){
                return 1;
            }
            else return 0;
        })
    }
    if(currentPage){
        list=list.slice((currentPage-1)*10,(currentPage-1)*10+10);
    }
    let listLenght=list.length;
    var session = localStorage.getItem('session');
    var checkSession;
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
                            <div className="function__staff__sort">
                                <select name="" id="" onChange={onSort}>
                                    <option value="increase">A - Z</option>
                                    <option value="decrease">Z - A</option>
                                </select>
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
                        </div>
                        <div className="list__staff">
                            <table>
                                <tbody>
                                    <tr>
                                        <th>ID</th>
                                        <th>NAME</th>
                                        <th>EMAIL</th>
                                        <th>ROLE</th>
                                    </tr>
                                    {
                                        list.map((item,index)=>(
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td className='name'><img src={item.avatar} alt="" /> <p>{item.name}</p> </td>
                                            <td>{item.email}</td>
                                            <td>{item.role==''?'User':item.role}</td>
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
            </div>:<div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default Account;