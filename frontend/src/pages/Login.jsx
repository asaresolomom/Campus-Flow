import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [isRegistering, setIsRegistering] = useState(false);

    // LOGIN
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // REGISTRATION
    const [schoolName, setSchoolName] = useState("");
    const [schoolCode, setSchoolCode] = useState("");
    const [address, setAddress] = useState("");
    const [registerEmail, setRegisterEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [registerPassword, setRegisterPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const navigate = useNavigate();

    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:5000/api/schools/login",
                {
                    email,
                    password
                }
            );

            localStorage.setItem(
                "token",
                response.data.token
            );

            alert("Login successful");

            navigate("/dashboard");

        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Login failed"
            );
        }
    };

    // =====================================================
    // REGISTER SCHOOL
    // =====================================================

    const handleRegister = async (e) => {
        e.preventDefault();

        if (registerPassword !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        if (registerPassword.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        try {
            await axios.post(
                "http://localhost:5000/api/schools/register",
                {
                    schoolName,
                    schoolCode,
                    address,
                    email: registerEmail,
                    phone,
                    password: registerPassword
                }
            );

            alert(
                "School account created successfully!"
            );

            // Clear registration form
            setSchoolName("");
            setSchoolCode("");
            setAddress("");
            setRegisterEmail("");
            setPhone("");
            setRegisterPassword("");
            setConfirmPassword("");

            // Put registered email into login
            setEmail(registerEmail);

            // Return to login
            setIsRegistering(false);

        } catch (error) {
            console.error(
                "REGISTER ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                "School registration failed"
            );
        }
    };

    return (
        <div className="login-container">

            {!isRegistering ? (

                // =================================================
                // LOGIN
                // =================================================

                <form onSubmit={handleLogin}>

                    <h1>
                        EduMaster Pro
                    </h1>

                    <p>
                        School Management System
                    </p>

                    <input
                        type="email"
                        placeholder="School Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Login
                    </button>

                    <div
                        style={{
                            marginTop: "20px",
                            textAlign: "center"
                        }}
                    >
                        <p>
                            Don't have a school account?
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setIsRegistering(true)
                            }
                            style={{
                                background: "transparent",
                                color: "#2563eb",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Create School Account
                        </button>
                    </div>

                </form>

            ) : (

                // =================================================
                // SCHOOL REGISTRATION
                // =================================================

                <form onSubmit={handleRegister}>

                    <h1>
                        Create School Account
                    </h1>

                    <p>
                        Register your school
                    </p>

                    {/* SCHOOL NAME */}

                    <input
                        type="text"
                        placeholder="School Name"
                        value={schoolName}
                        onChange={(e) =>
                            setSchoolName(e.target.value)
                        }
                        required
                    />

                    {/* SCHOOL CODE */}

                    <input
                        type="text"
                        placeholder="School Code"
                        value={schoolCode}
                        onChange={(e) =>
                            setSchoolCode(e.target.value)
                        }
                        required
                    />

                    {/* ADDRESS */}

                    <input
                        type="text"
                        placeholder="School Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                        required
                    />

                    {/* EMAIL */}

                    <input
                        type="email"
                        placeholder="School Email"
                        value={registerEmail}
                        onChange={(e) =>
                            setRegisterEmail(e.target.value)
                        }
                        required
                    />

                    {/* PHONE */}

                    <input
                        type="tel"
                        placeholder="School Phone"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                        required
                    />

                    {/* PASSWORD */}

                    <input
                        type="password"
                        placeholder="Password"
                        value={registerPassword}
                        onChange={(e) =>
                            setRegisterPassword(e.target.value)
                        }
                        required
                    />

                    {/* CONFIRM PASSWORD */}

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) =>
                            setConfirmPassword(e.target.value)
                        }
                        required
                    />

                    <button type="submit">
                        Create School Account
                    </button>

                    <div
                        style={{
                            marginTop: "20px",
                            textAlign: "center"
                        }}
                    >
                        <p>
                            Already have an account?
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setIsRegistering(false)
                            }
                            style={{
                                background: "transparent",
                                color: "#2563eb",
                                border: "none",
                                cursor: "pointer",
                                fontWeight: "600"
                            }}
                        >
                            Back to Login
                        </button>
                    </div>

                </form>

            )}

        </div>
    );
}

export default Login;
