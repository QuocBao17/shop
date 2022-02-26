import { doc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword,deleteUser } from "firebase/auth";
import { database } from "../Api/Config/firebase-config";
const CheckRole =async ()=>{
    const auth = getAuth();
    const currentUser = auth.currentUser;
    console.log(currentUser);
    if(currentUser!==null){
        let currentMail=currentUser.email;
        const docRef = doc(database, "users",currentMail);
        const docSnap = await getDoc(docRef);
        localStorage.setItem('session', JSON.stringify({
            role:docSnap.data().role,
            name:docSnap.data().name,
            avatar:docSnap.data().avatar,
            email:docSnap.data().email
        }));
    }
    else{
        localStorage.setItem('session', JSON.stringify({
            role:'',
            name:'',
            avatar:'',
            email:''
        }));
    }
}
export default CheckRole;