import { NavLink } from "react-router-dom";

import {
    FaTachometerAlt,
    FaUserGraduate,
    FaChalkboardTeacher,
    FaSchool,
    FaBook,
    FaClipboardCheck,
    FaFileAlt,
    FaChartBar,
    FaMoneyBillWave,
    FaFileInvoiceDollar,
    FaWhatsapp,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";


function Sidebar() {

    return (

        <aside className="sidebar">


            {/* =================================================
                LOGO
            ================================================= */}

            <div className="logo">

                <h2>
                    CampusFlow
                </h2>

            </div>


            {/* =================================================
                NAVIGATION
            ================================================= */}

            <nav>


                {/* DASHBOARD */}

                <NavLink to="/dashboard">

                    <FaTachometerAlt />

                    <span>
                        Dashboard
                    </span>

                </NavLink>


                {/* STUDENTS */}

                <NavLink to="/students">

                    <FaUserGraduate />

                    <span>
                        Students
                    </span>

                </NavLink>


                {/* TEACHERS */}

                <NavLink to="/teachers">

                    <FaChalkboardTeacher />

                    <span>
                        Teachers
                    </span>

                </NavLink>


                {/* CLASSES */}

                <NavLink to="/classes">

                    <FaSchool />

                    <span>
                        Classes
                    </span>

                </NavLink>


                {/* SUBJECTS */}

                <NavLink to="/subjects">

                    <FaBook />

                    <span>
                        Subjects
                    </span>

                </NavLink>


                {/* ATTENDANCE */}

                <NavLink to="/attendance">

                    <FaClipboardCheck />

                    <span>
                        Attendance
                    </span>

                </NavLink>


                {/* EXAMS */}

                <NavLink to="/exams">

                    <FaFileAlt />

                    <span>
                        Exams
                    </span>

                </NavLink>


                {/* RESULTS */}

                <NavLink to="/results">

                    <FaChartBar />

                    <span>
                        Results
                    </span>

                </NavLink>


                {/* =================================================
                    FINANCE
                ================================================= */}

                <NavLink to="/finance">

                    <FaMoneyBillWave />

                    <span>
                        Finance
                    </span>

                </NavLink>


                {/* =================================================
                    FEES
                ================================================= */}

                <NavLink to="/fees">

                    <FaFileInvoiceDollar />

                    <span>
                        Fees
                    </span>

                </NavLink>


                {/* =================================================
                    WHATSAPP
                ================================================= */}

                <NavLink to="/whatsapp">

                    <FaWhatsapp />

                    <span>
                        WhatsApp
                    </span>

                </NavLink>


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <NavLink to="/settings">

                    <FaCog />

                    <span>
                        Settings
                    </span>

                </NavLink>

            </nav>


            {/* =================================================
                LOGOUT
            ================================================= */}

            <div className="logout">

                <NavLink to="/">

                    <FaSignOutAlt />

                    <span>
                        Logout
                    </span>

                </NavLink>

            </div>


        </aside>

    );

}


export default Sidebar;
