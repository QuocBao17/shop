import './navigation.scss';
const Navigation =(props)=>{
    const next =()=>{
        props.getCurrentPage(props.currentPage+1);
    }
    const prev=()=>{
        if(props.currentPage!=1){
            props.getCurrentPage(props.currentPage-1);
        }
    }
    return(
        <div className='navigation'>
            <p>TOTAL {props.total} {props.title}</p>
            {
                props.total<10?null:  <div className="navigation__wrap">
                <i onClick={()=>prev()} className="fas fa-angle-left"></i>
                {props.currentPage==1?
                <div className="navigation__wrap__button">
                    <div className="navigation-btn-2">
                        <button >{props.currentPage}</button>
                    </div>
                    <div className="navigation-btn-3">
                        <button onClick={()=>next()}>{props.currentPage+1}</button>
                   </div>
                </div>:   
                <div className="navigation__wrap__button">
                   <div className="navigation-btn-1">
                        <button onClick={()=>prev()} >{props.currentPage-1}</button>                                                </div>
                   <div className="navigation-btn-2">
                       <button>{props.currentPage}</button>
                   </div>
                   {
                       props.listLenght<10?<div className="navigation-btn-3">
                       <button disabled='disabled' onClick={()=>next()} >{props.currentPage+1}</button>
                        </div>:<div className="navigation-btn-3">
                                <button onClick={()=>next()} >{props.currentPage+1}</button>
                        </div>
                   }
                </div>}
                {
                    props.listLenght<10?null: <i onClick={()=>next()} className="fas fa-angle-right"></i>
                }
            </div> 
            }
        </div>
    )
}
export default Navigation