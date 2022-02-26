import './dashboard.scss'
import Header from '../../../Header/Header';
import Navbar from '../../../Navbar/Navbar';
import ChartBar from '../../../Chart/ChartBar';

const Dashboard =(props)=>{
    var session = JSON.parse(localStorage.getItem('session'));
    var checkSession;
    if(session.role==''){
        checkSession=false;
    }
    else{
        checkSession=true;
    }
    return(
        <div className="dashboard">
            {
                checkSession?<div className='dashboard__container'>
                <div className="dashboard__container__navbar">
                    <Navbar menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Navbar>
                </div>
                <div className="dashboard__container__main">
                    <Header menuStatus={props.menuStatus} getMenuStatus={props.getMenuStatus}></Header>
                    <div className="dashboard__container__main__wrap">
                        <h2>Dashboard Overview</h2>
                        <div className="all-data">
                            <div className="today">
                                <i className="fas fa-clipboard-list"></i>
                                <p>Today Offer</p>
                                <h6>$300</h6>
                            </div>
                            <div className="month">
                                <i className="fas fa-shopping-cart"></i>
                                <p>This month</p>
                                <h6>$5000</h6>
                            </div>
                            <div className="total">
                            <i className="fas fa-credit-card"></i>
                                <p>Total Order</p>
                                <h6>$95000</h6>
                            </div>
                        </div>
                        <div className="count-data">
                            <div className="order-total">
                                <i className="fas fa-shopping-cart"></i>
                                <div className="order-total__count">
                                    <p>Total Order</p>
                                    <h6>169</h6>
                                </div>
                            </div>
                            <div className="order-pending">
                                <i className="fas fa-sync"></i>
                                <div className="order-pending__count">
                                    <p>Order Pending</p>
                                    <h6>34</h6>
                                </div>
                            </div>
                            <div className="order-processing">
                            <i className="fas fa-truck-moving"></i>
                                <div className="order-processing__count">
                                    <p>Order Processing</p>
                                    <h6>59</h6>
                                </div>
                            </div>
                            <div className="order-delivered">
                                <i className="fas fa-check"></i>
                                <div className="order-delivered__count">
                                    <p>Order Delivered</p>
                                    <h6>65</h6>
                                </div>
                            </div>
                        </div>
                        <div className="charts">
                            <div className="chart-bar">
                              <ChartBar></ChartBar>
                            </div>
                        </div>
                    </div>
                </div>
            </div>: <div className="notFound"><img src="https://www.designrush.com/uploads/users/customer-11/image_1530905677_TfTLA1D0ueXh4hOj8hb4zpbDxjpm8jnMoINOk5uu.jpeg" alt="" /></div>
            }
        </div>
    )
}
export default Dashboard;