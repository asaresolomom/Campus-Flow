import React, { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "./WhatsApp.css";

function WhatsApp() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

    const [selectedStudent, setSelectedStudent] = useState("");
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");

    const [selectedStudents, setSelectedStudents] = useState([]);

    // =====================================================
    // MESSAGE TEMPLATES
    // =====================================================

    const templates = [
        {
            name: "School Announcement",
            message:
                "Dear Parent/Guardian,\n\nWe would like to inform you about an important announcement from the school.\n\nThank you.\n\nCampusFlow"
        },
        {
            name: "Fee Reminder",
            message:
                "Dear Parent/Guardian,\n\nThis is a friendly reminder regarding your child's outstanding school fees.\n\nPlease contact the school office for more information.\n\nThank you.\n\nCampusFlow"
        },
        {
            name: "Payment Confirmation",
            message:
                "Dear Parent/Guardian,\n\nWe confirm that your child's school fee payment has been received successfully.\n\nThank you for your payment.\n\nCampusFlow"
        },
        {
            name: "Meeting Reminder",
            message:
                "Dear Parent/Guardian,\n\nThis is a reminder about an upcoming school meeting. Please contact the school for further details.\n\nThank you.\n\nCampusFlow"
        }
    ];

    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = async () => {
        try {
            setLoading(true);

            const response = await API.get("/students/all");

            setStudents(response.data?.students || []);
        } catch (error) {
            console.error("LOAD STUDENTS ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load students"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStudents();
    }, []);

    // =====================================================
    // SELECTED STUDENT
    // =====================================================

    const currentStudent = useMemo(() => {
        return students.find(
            student => student._id === selectedStudent
        );
    }, [students, selectedStudent]);

    // =====================================================
    // FILTER STUDENTS
    // =====================================================

    const filteredStudents = students.filter(student => {
        const fullName =
            `${student.firstName || ""} ${student.lastName || ""}`
                .toLowerCase();

        const admission =
            String(student.admissionNumber || "")
                .toLowerCase();

        const parent =
            String(student.parentName || "")
                .toLowerCase();

        const searchValue = search.toLowerCase();

        return (
            fullName.includes(searchValue) ||
            admission.includes(searchValue) ||
            parent.includes(searchValue)
        );
    });

    // =====================================================
    // SELECT STUDENT
    // =====================================================

    const handleStudentChange = (e) => {
        const id = e.target.value;

        setSelectedStudent(id);

        const student = students.find(
            item => item._id === id
        );

        if (student) {
            setMessage(
                `Dear ${student.parentName || "Parent/Guardian"},\n\n`
            );
        }
    };

    // =====================================================
    // TEMPLATE
    // =====================================================

    const useTemplate = (template) => {
        let finalMessage = template.message;

        if (currentStudent) {
            finalMessage = finalMessage
                .replace(
                    "Dear Parent/Guardian",
                    `Dear ${currentStudent.parentName || "Parent/Guardian"}`
                )
                .replace(
                    "your child's",
                    `your child's (${currentStudent.firstName} ${currentStudent.lastName})`
                );
        }

        setMessage(finalMessage);

        toast.success(
            `${template.name} loaded`
        );
    };

    // =====================================================
    // FORMAT PHONE
    // =====================================================

    const formatPhone = (phone) => {
        if (!phone) return "";

        let value = String(phone)
            .replace(/\s/g, "")
            .replace(/-/g, "")
            .replace(/\+/g, "");

        // Ghana number beginning with 0
        if (value.startsWith("0")) {
            value = "233" + value.substring(1);
        }

        // Ghana number without country code
        if (
            value.length === 9 &&
            !value.startsWith("233")
        ) {
            value = "233" + value;
        }

        return value;
    };

    // =====================================================
    // OPEN WHATSAPP
    // =====================================================

    const sendWhatsApp = () => {
        if (!currentStudent) {
            toast.error(
                "Please select a student"
            );
            return;
        }

        if (!currentStudent.parentPhone) {
            toast.error(
                "This student has no parent phone number"
            );
            return;
        }

        if (!message.trim()) {
            toast.error(
                "Please enter a message"
            );
            return;
        }

        const phone =
            formatPhone(
                currentStudent.parentPhone
            );

        const url =
            `https://wa.me/${phone}?text=${encodeURIComponent(
                message
            )}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =====================================================
    // SELECT MULTIPLE
    // =====================================================

    const toggleStudent = (id) => {
        setSelectedStudents(previous => {
            if (previous.includes(id)) {
                return previous.filter(
                    studentId =>
                        studentId !== id
                );
            }

            return [
                ...previous,
                id
            ];
        });
    };

    // =====================================================
    // SELECT ALL
    // =====================================================

    const selectAll = () => {
        const validStudents =
            filteredStudents
                .filter(
                    student =>
                        student.parentPhone
                )
                .map(
                    student =>
                        student._id
                );

        setSelectedStudents(
            validStudents
        );
    };

    // =====================================================
    // CLEAR SELECTION
    // =====================================================

    const clearSelection = () => {
        setSelectedStudents([]);
    };

    // =====================================================
    // BULK WHATSAPP
    // =====================================================

    const sendBulkWhatsApp = () => {
        if (
            selectedStudents.length === 0
        ) {
            toast.error(
                "Select at least one student"
            );
            return;
        }

        if (!message.trim()) {
            toast.error(
                "Please enter a message"
            );
            return;
        }

        const selected =
            students.filter(
                student =>
                    selectedStudents.includes(
                        student._id
                    )
            );

        if (selected.length === 0) {
            return;
        }

        /*
         * Browsers may block multiple popup windows.
         * We therefore open the first selected
         * parent immediately.
         */

        const firstStudent =
            selected[0];

        if (!firstStudent.parentPhone) {
            toast.error(
                "The first selected student has no parent phone number"
            );
            return;
        }

        const personalizedMessage =
            message.replace(
                /\{student\}/gi,
                `${firstStudent.firstName} ${firstStudent.lastName}`
            ).replace(
                /\{parent\}/gi,
                firstStudent.parentName || "Parent/Guardian"
            );

        const phone =
            formatPhone(
                firstStudent.parentPhone
            );

        const url =
            `https://wa.me/${phone}?text=${encodeURIComponent(
                personalizedMessage
            )}`;

        window.open(
            url,
            "_blank",
            "noopener,noreferrer"
        );

        toast.success(
            `${selected.length} parent(s) selected. WhatsApp opened for the first parent.`
        );
    };

    return (
        <div className="whatsapp-page">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="whatsapp-header">

                <div>
                    <span className="whatsapp-badge">
                        PARENT COMMUNICATION
                    </span>

                    <h1>
                        WhatsApp Communication
                    </h1>

                    <p>
                        Send announcements, fee reminders
                        and school information directly to parents.
                    </p>
                </div>

                <div className="whatsapp-header-icon">
                    WA
                </div>

            </div>


            <div className="whatsapp-layout">

                {/* =================================================
                    LEFT SIDE
                ================================================= */}

                <div className="whatsapp-main-card">

                    <div className="whatsapp-card-title">

                        <div>
                            <span>
                                MESSAGE CENTER
                            </span>

                            <h2>
                                Compose Message
                            </h2>
                        </div>

                        <div className="whatsapp-online">
                            ● Ready
                        </div>

                    </div>


                    {/* STUDENT */}

                    <div className="whatsapp-field">

                        <label>
                            Select Student
                        </label>

                        <select
                            value={selectedStudent}
                            onChange={handleStudentChange}
                        >

                            <option value="">
                                Select a student
                            </option>

                            {students.map(student => (
                                <option
                                    key={student._id}
                                    value={student._id}
                                >
                                    {student.firstName}{" "}
                                    {student.lastName}
                                    {" — "}
                                    {student.admissionNumber}
                                </option>
                            ))}

                        </select>

                    </div>


                    {/* PARENT INFO */}

                    {currentStudent && (

                        <div className="parent-info-card">

                            <div className="parent-avatar">
                                {currentStudent.parentName
                                    ?.charAt(0)
                                    ?.toUpperCase() || "P"}
                            </div>

                            <div className="parent-info-text">

                                <span>
                                    PARENT / GUARDIAN
                                </span>

                                <strong>
                                    {currentStudent.parentName ||
                                        "Not provided"}
                                </strong>

                                <small>
                                    📱{" "}
                                    {currentStudent.parentPhone ||
                                        "No phone number"}
                                </small>

                            </div>

                            <div className="student-mini-info">

                                <span>
                                    STUDENT
                                </span>

                                <strong>
                                    {currentStudent.firstName}{" "}
                                    {currentStudent.lastName}
                                </strong>

                            </div>

                        </div>

                    )}


                    {/* MESSAGE */}

                    <div className="whatsapp-field">

                        <div className="message-label-row">

                            <label>
                                Message
                            </label>

                            <span>
                                {message.length} characters
                            </span>

                        </div>

                        <textarea
                            value={message}
                            onChange={e =>
                                setMessage(
                                    e.target.value
                                )
                            }
                            placeholder="Write your message to the parent..."
                            rows="10"
                        />

                    </div>


                    {/* VARIABLES */}

                    <div className="message-hint">

                        <strong>
                            Personalization:
                        </strong>

                        Use{" "}
                        <code>
                            {"{student}"}
                        </code>{" "}
                        for the student's name and{" "}
                        <code>
                            {"{parent}"}
                        </code>{" "}
                        for the parent's name.

                    </div>


                    {/* SEND */}

                    <div className="whatsapp-actions">

                        <button
                            className="whatsapp-send-btn"
                            onClick={sendWhatsApp}
                        >
                            <span>
                                WhatsApp
                            </span>

                            Send Message →
                        </button>

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE — TEMPLATES
                ================================================= */}

                <div className="whatsapp-template-card">

                    <div className="template-header">

                        <span>
                            QUICK MESSAGES
                        </span>

                        <h2>
                            Message Templates
                        </h2>

                        <p>
                            Choose a ready-made message.
                        </p>

                    </div>


                    <div className="template-list">

                        {templates.map(
                            (template, index) => (

                                <button
                                    key={index}
                                    className="template-item"
                                    onClick={() =>
                                        useTemplate(
                                            template
                                        )
                                    }
                                >

                                    <div className="template-number">
                                        {index + 1}
                                    </div>

                                    <div>
                                        <strong>
                                            {template.name}
                                        </strong>

                                        <span>
                                            Click to use
                                        </span>
                                    </div>

                                    <b>
                                        →
                                    </b>

                                </button>

                            )
                        )}

                    </div>

                </div>

            </div>


            {/* =================================================
                BULK MESSAGING
            ================================================= */}

            <div className="bulk-card">

                <div className="bulk-header">

                    <div>

                        <span>
                            BULK COMMUNICATION
                        </span>

                        <h2>
                            Send to Multiple Parents
                        </h2>

                        <p>
                            Select students and prepare
                            one message for their parents.
                        </p>

                    </div>

                    <div className="bulk-count">
                        {selectedStudents.length}
                        <small>
                            Selected
                        </small>
                    </div>

                </div>


                {/* SEARCH */}

                <div className="student-search-row">

                    <input
                        type="text"
                        placeholder="Search student, admission number or parent..."
                        value={search}
                        onChange={e =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                    <button
                        onClick={selectAll}
                    >
                        Select All
                    </button>

                    <button
                        onClick={clearSelection}
                        className="clear-selection"
                    >
                        Clear
                    </button>

                </div>


                {/* STUDENTS */}

                <div className="bulk-student-list">

                    {loading ? (

                        <div className="bulk-loading">
                            Loading students...
                        </div>

                    ) : filteredStudents.length === 0 ? (

                        <div className="bulk-loading">
                            No students found.
                        </div>

                    ) : (

                        filteredStudents.map(
                            student => {

                                const selected =
                                    selectedStudents.includes(
                                        student._id
                                    );

                                return (

                                    <button
                                        key={
                                            student._id
                                        }
                                        className={
                                            `bulk-student ${
                                                selected
                                                    ? "selected"
                                                    : ""
                                            }`
                                        }
                                        onClick={() =>
                                            toggleStudent(
                                                student._id
                                            )
                                        }
                                    >

                                        <div className="bulk-check">

                                            {selected
                                                ? "✓"
                                                : ""}

                                        </div>

                                        <div className="bulk-avatar">

                                            {student.firstName
                                                ?.charAt(0)}

                                            {student.lastName
                                                ?.charAt(0)}

                                        </div>

                                        <div className="bulk-student-details">

                                            <strong>
                                                {
                                                    student.firstName
                                                }{" "}
                                                {
                                                    student.lastName
                                                }
                                            </strong>

                                            <span>
                                                {
                                                    student.parentName
                                                }
                                                {" • "}
                                                {
                                                    student.parentPhone ||
                                                    "No phone"
                                                }
                                            </span>

                                        </div>

                                    </button>

                                );

                            }
                        )

                    )}

                </div>


                {/* BULK MESSAGE */}

                <div className="bulk-message">

                    <label>
                        Bulk Message
                    </label>

                    <textarea
                        value={message}
                        onChange={e =>
                            setMessage(
                                e.target.value
                            )
                        }
                        placeholder="Write the message..."
                        rows="5"
                    />

                </div>


                <div className="bulk-actions">

                    <button
                        className="bulk-send-btn"
                        onClick={
                            sendBulkWhatsApp
                        }
                    >
                        Send to{" "}
                        {selectedStudents.length}{" "}
                        Parent(s) →
                    </button>

                </div>

            </div>


            {/* =================================================
                INFORMATION
            ================================================= */}

            <div className="whatsapp-notice">

                <div className="notice-icon">
                    !
                </div>

                <div>

                    <strong>
                        WhatsApp connection
                    </strong>

                    <p>
                        Messages are opened through WhatsApp
                        using the parent's registered phone number.
                        The school administrator confirms and sends
                        the message from WhatsApp.
                    </p>

                </div>

            </div>

        </div>
    );
}

export default WhatsApp;

