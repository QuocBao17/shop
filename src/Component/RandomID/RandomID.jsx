const Random =()=>{
    const r1=()=>{
        return Math.floor((1+Math.random())*0x100000).toString(16).substring(1);
    }
    return r1()+'-'+r1()+'-'+r1()+'-'+r1();
}
export default Random;