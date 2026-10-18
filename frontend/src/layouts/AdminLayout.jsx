import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";


function AdminLayout(){

    return (

        <div className="admin-layout">


            <Sidebar />


            <div className="main-area">


                <Navbar />


                <main>

                    <Outlet />

                </main>


            </div>


        </div>

    );

}


export default AdminLayout;