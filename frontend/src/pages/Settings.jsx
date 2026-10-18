import { useState } from "react";
import "../App.css";

function Settings() {

    const [activeSection, setActiveSection] =
        useState("school");

    const [settings, setSettings] = useState({
        schoolName: "UENR",
        schoolAddress: "SUNYANI-GHANA",
        schoolPhone: "0541737072",
        schoolEmail: "",

        academicYear: "2026/2027",
        currentTerm: "First Term",

        admissionPercentage: 30,
        admissionPrefix: "UENR",
        autoAdmission: true,

        currency: "GHS",
        allowPartialPayment: true,

        passMark: 50,
        totalMarks: 100
    });

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setSettings(previous => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : value
        }));
    };

    const saveSettings = () => {

        /*
         * For now settings are stored in the browser.
         *
         * Later we will connect this button
         * to the backend/database.
         */

        localStorage.setItem(
            "schoolSettings",
            JSON.stringify(settings)
        );

        alert("Settings saved successfully");
    };

    const sections = [
        {
            id: "school",
            icon: "🏫",
            title: "School Profile",
            description: "School information"
        },
        {
            id: "admission",
            icon: "🎓",
            title: "Admission",
            description: "Admission rules"
        },
        {
            id: "academic",
            icon: "📚",
            title: "Academic",
            description: "Academic settings"
        },
        {
            id: "fees",
            icon: "💰",
            title: "Fees",
            description: "Fee configuration"
        },
        {
            id: "results",
            icon: "📊",
            title: "Results",
            description: "Grading settings"
        },
        {
            id: "notifications",
            icon: "🔔",
            title: "Notifications",
            description: "System alerts"
        },
        {
            id: "security",
            icon: "🔐",
            title: "Security",
            description: "Account security"
        }
    ];

    return (
        <div className="settings-page">

            {/* HEADER */}

            <div className="settings-header">

                <div>

                    <span className="settings-label">
                        SYSTEM CONFIGURATION
                    </span>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage your school system
                        configuration from one place.
                    </p>

                </div>

                <div className="settings-header-icon">
                    ⚙
                </div>

            </div>


            <div className="settings-layout">

                {/* SIDEBAR */}

                <div className="settings-sidebar">

                    <h3>
                        Settings
                    </h3>

                    {sections.map(section => (

                        <button
                            key={section.id}
                            type="button"
                            className={
                                activeSection === section.id
                                    ? "settings-menu active"
                                    : "settings-menu"
                            }
                            onClick={() =>
                                setActiveSection(
                                    section.id
                                )
                            }
                        >

                            <span className="settings-menu-icon">
                                {section.icon}
                            </span>

                            <span>

                                <strong>
                                    {section.title}
                                </strong>

                                <small>
                                    {section.description}
                                </small>

                            </span>

                        </button>

                    ))}

                </div>


                {/* CONTENT */}

                <div className="settings-content">


                    {/* SCHOOL PROFILE */}

                    {activeSection === "school" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        SCHOOL INFORMATION
                                    </span>

                                    <h2>
                                        School Profile
                                    </h2>

                                    <p>
                                        Update your school's
                                        basic information.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    🏫
                                </div>

                            </div>


                            <div className="settings-form-grid">

                                <div className="settings-input">

                                    <label>
                                        School Name
                                    </label>

                                    <input
                                        name="schoolName"
                                        value={
                                            settings.schoolName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="settings-input">

                                    <label>
                                        Phone Number
                                    </label>

                                    <input
                                        name="schoolPhone"
                                        value={
                                            settings.schoolPhone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="settings-input full">

                                    <label>
                                        School Address
                                    </label>

                                    <input
                                        name="schoolAddress"
                                        value={
                                            settings.schoolAddress
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="settings-input full">

                                    <label>
                                        School Email
                                    </label>

                                    <input
                                        type="email"
                                        name="schoolEmail"
                                        value={
                                            settings.schoolEmail
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="school@example.com"
                                    />

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ADMISSION */}

                    {activeSection === "admission" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        STUDENT ADMISSION
                                    </span>

                                    <h2>
                                        Admission Settings
                                    </h2>

                                    <p>
                                        Control when students
                                        become officially admitted.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    🎓
                                </div>

                            </div>


                            <div className="settings-info-box">

                                <strong>
                                    Automatic Admission
                                </strong>

                                <p>
                                    When a student's total
                                    payments reach the required
                                    percentage of their school
                                    fees, the system can
                                    automatically generate an
                                    admission number.
                                </p>

                            </div>


                            <div className="settings-form-grid">

                                <div className="settings-input">

                                    <label>
                                        Minimum Payment %
                                    </label>

                                    <div className="settings-percent-input">

                                        <input
                                            type="number"
                                            name="admissionPercentage"
                                            min="1"
                                            max="100"
                                            value={
                                                settings.admissionPercentage
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span>
                                            %
                                        </span>

                                    </div>

                                    <small>
                                        Student must pay at least
                                        this percentage before
                                        admission.
                                    </small>

                                </div>


                                <div className="settings-input">

                                    <label>
                                        Admission Prefix
                                    </label>

                                    <input
                                        name="admissionPrefix"
                                        value={
                                            settings.admissionPrefix
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="UENR"
                                    />

                                </div>


                                <div className="settings-input full">

                                    <label>
                                        Admission Number Preview
                                    </label>

                                    <div className="settings-preview">

                                        {settings.admissionPrefix}
                                        -2026-0001

                                    </div>

                                </div>


                                <div className="settings-toggle full">

                                    <div>

                                        <strong>
                                            Automatic Admission Number
                                        </strong>

                                        <p>
                                            Automatically generate an
                                            admission number when the
                                            payment requirement is reached.
                                        </p>

                                    </div>

                                    <label className="switch">

                                        <input
                                            type="checkbox"
                                            name="autoAdmission"
                                            checked={
                                                settings.autoAdmission
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span></span>

                                    </label>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* ACADEMIC */}

                    {activeSection === "academic" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        ACADEMIC YEAR
                                    </span>

                                    <h2>
                                        Academic Settings
                                    </h2>

                                    <p>
                                        Configure the current
                                        academic period.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    📚
                                </div>

                            </div>


                            <div className="settings-form-grid">

                                <div className="settings-input">

                                    <label>
                                        Academic Year
                                    </label>

                                    <input
                                        name="academicYear"
                                        value={
                                            settings.academicYear
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="settings-input">

                                    <label>
                                        Current Term
                                    </label>

                                    <select
                                        name="currentTerm"
                                        value={
                                            settings.currentTerm
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option>
                                            First Term
                                        </option>

                                        <option>
                                            Second Term
                                        </option>

                                        <option>
                                            Third Term
                                        </option>

                                    </select>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* FEES */}

                    {activeSection === "fees" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        SCHOOL FINANCE
                                    </span>

                                    <h2>
                                        Fee Settings
                                    </h2>

                                    <p>
                                        Configure school payment
                                        behaviour.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    💰
                                </div>

                            </div>


                            <div className="settings-form-grid">

                                <div className="settings-input">

                                    <label>
                                        Currency
                                    </label>

                                    <select
                                        name="currency"
                                        value={
                                            settings.currency
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    >

                                        <option value="GHS">
                                            GHS — Ghana Cedi
                                        </option>

                                    </select>

                                </div>


                                <div className="settings-toggle">

                                    <div>

                                        <strong>
                                            Allow Partial Payments
                                        </strong>

                                        <p>
                                            Allow students to pay
                                            their fees in installments.
                                        </p>

                                    </div>

                                    <label className="switch">

                                        <input
                                            type="checkbox"
                                            name="allowPartialPayment"
                                            checked={
                                                settings.allowPartialPayment
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        />

                                        <span></span>

                                    </label>

                                </div>

                            </div>

                        </div>

                    )}


                    {/* RESULTS */}

                    {activeSection === "results" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        EXAMINATION
                                    </span>

                                    <h2>
                                        Result Settings
                                    </h2>

                                    <p>
                                        Configure marks and
                                        grading rules.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    📊
                                </div>

                            </div>


                            <div className="settings-form-grid">

                                <div className="settings-input">

                                    <label>
                                        Total Marks
                                    </label>

                                    <input
                                        type="number"
                                        name="totalMarks"
                                        value={
                                            settings.totalMarks
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>


                                <div className="settings-input">

                                    <label>
                                        Pass Mark
                                    </label>

                                    <input
                                        type="number"
                                        name="passMark"
                                        value={
                                            settings.passMark
                                        }
                                        onChange={
                                            handleChange
                                        }
                                    />

                                </div>

                            </div>

                        </div>

                    )}


                    {/* NOTIFICATIONS */}

                    {activeSection === "notifications" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        SYSTEM ALERTS
                                    </span>

                                    <h2>
                                        Notifications
                                    </h2>

                                    <p>
                                        Configure system
                                        notifications.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    🔔
                                </div>

                            </div>


                            <div className="settings-placeholder">

                                <div>
                                    🔔
                                </div>

                                <h3>
                                    Notification Settings
                                </h3>

                                <p>
                                    SMS, email and parent
                                    notifications will be
                                    configured here.
                                </p>

                            </div>

                        </div>

                    )}


                    {/* SECURITY */}

                    {activeSection === "security" && (

                        <div className="settings-card">

                            <div className="settings-card-header">

                                <div>

                                    <span>
                                        ACCOUNT PROTECTION
                                    </span>

                                    <h2>
                                        Security
                                    </h2>

                                    <p>
                                        Manage your account
                                        security settings.
                                    </p>

                                </div>

                                <div className="settings-card-icon">
                                    🔐
                                </div>

                            </div>


                            <div className="settings-placeholder">

                                <div>
                                    🔐
                                </div>

                                <h3>
                                    Security Settings
                                </h3>

                                <p>
                                    Password management,
                                    roles and permissions
                                    will be configured here.
                                </p>

                            </div>

                        </div>

                    )}


                    {/* SAVE */}

                    <div className="settings-save-area">

                        <button
                            type="button"
                            className="settings-save-button"
                            onClick={saveSettings}
                        >
                            Save Settings
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Settings;

