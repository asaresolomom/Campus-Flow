import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

function Navbar() {

    const today = new Date().toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const logout = () => {
        localStorage.removeItem("token");
        window.location = "/";
    };

    return (

        <header className="navbar">

            <div className="navbar-left">

                <h2>Welcome back 👋</h2>

                <p>{today}</p>

            </div>

            <div className="navbar-center">

                <div className="search-box">

                    <FaSearch />

                    <input
                        type="text"
                        placeholder="Search..."
                    />

                </div>

            </div>

            <div className="navbar-right">

                <button className="notification-btn">

                    <FaBell />

                </button>

                <div className="profile">

                    <FaUserCircle className="profile-icon" />

                    <div>

                        <strong>Administrator</strong>

                        <p>School Admin</p>

                    </div>

                </div>

                <button
                    className="logout-btn"
                    onClick={logout}
                >
                    Logout
                </button>

            </div>

        </header>

    );

}

export default Navbar;