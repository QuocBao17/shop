import Header from "../../../../Header/Header";
import Navbar from "../../../../Navbar/Navbar";
import { useParams } from "react-router-dom";
import { database, storage } from "../../../../Api/Config/firebase-config";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { doc, collection,setDoc,getDocs, deleteDoc, getDoc} from "firebase/firestore"; 
import './detail-product.scss';
import { useEffect, useState } from "react";
const DetailProduct = ()=>{
    const [detail,setDetail]=useState([]);
    const {  id } = useParams(); 
    useEffect(()=>{
        const getItem=async()=>{
            const docRef = doc(database, "product", id);
            const docSnap = await getDoc(docRef);
            setDetail(docSnap.data());
        }
        getItem();
    },[])
    var session = JSON.parse(localStorage.getItem('session'));
    var checkSession;
    if(session.role==''){
        checkSession=false;
    }
    else{
        checkSession=true;
    }
    return(
        <div className="detail-product">
            {
                checkSession?  <div className="detail-product__container">
                <div className="detail-product__container__navbar">
                    <Navbar></Navbar>
                </div>
                <div className="detail-product__container__main">
                    <Header></Header>
                    <div className="detail-product__container__main__wrap">
                        <h2>Product Details</h2>
                        <div className="detail-info">
                            <div className="detail-info__wrap">
                                <div className="detail-info__wrap__image">
                                    <img src={detail.image} alt="" />
                                </div>
                                <div className="detail-info__wrap__main">
                                    <h4>Status: {detail.published?<span className="published">This product Published</span>:<span className="hidden">This product Hidden</span>}</h4>
                                    <div className="detail-info__wrap__main__name">
                                        <h2>{detail.name}</h2>
                                    </div>
                                    <div className="detail-info__wrap__main__price">
                                        <h2>{detail.price}VND</h2>
                                    </div>
                                    <div className="detail-info__wrap__main__stock">
                                        <p>In Stock</p>
                                        <span>Quantity: {detail.stock}</span>
                                    </div>
                                    <div className="detail-info__wrap__main__decription">
                                        <p>{detail.decription}</p>
                                    </div>
                                    <div className="detail-info__wrap__main__category">
                                        <p>Category: <span>{detail.category}</span></p>
                                    </div>
                                    <div className="detail-info__wrap__main__button">
                                       <button>Edit Product</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>: <div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default DetailProduct;