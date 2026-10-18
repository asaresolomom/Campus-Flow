import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Students() {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // ============================================
    // FORM
    // ============================================

    const emptyForm = {
        firstName: "",
        lastName: "",
        gender: "",
        dateOfBirth: "",
        className: "",
        parentName: "",
        parentPhone: "",
        address: ""
    };

    const [form, setForm] = useState(emptyForm);


    // ============================================
    // HANDLE INPUT
    // ============================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };


    // ============================================
    // LOAD STUDENTS
    // ============================================

    const loadStudents = async () => {
        try {
            setLoading(true);

            const response =
                await API.get("/students/all");

            setStudents(
                response.data?.students || []
            );

        } catch (error) {

            console.error(
                "LOAD STUDENTS ERROR:",
                error
            );

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


    // ============================================
    // CLEAR FORM
    // ============================================

    const clearForm = () => {

        setEditingId(null);

        setForm(emptyForm);

        setShowForm(false);
    };


    // ============================================
    // OPEN ADD FORM
    // ============================================

    const openAddForm = () => {

        setEditingId(null);

        setForm(emptyForm);

        setShowForm(true);
    };


    // ============================================
    // ADD STUDENT
    // ============================================

    const addStudent = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            // IMPORTANT:
            // Admission number is NOT sent.
            // Backend generates it after 30% payment.

            const studentData = {
                firstName: form.firstName,
                lastName: form.lastName,
                gender: form.gender,
                dateOfBirth: form.dateOfBirth,
                className: form.className,
                parentName: form.parentName,
                parentPhone: form.parentPhone,
                address: form.address
            };

            const response =
                await API.post(
                    "/students/add",
                    studentData
                );


            toast.success(
                response.data?.message ||
                "Student registered successfully"
            );


            setForm(emptyForm);

            setShowForm(false);

            await loadStudents();

        } catch (error) {

            console.error(
                "ADD STUDENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to add student"
            );

        } finally {

            setSaving(false);

        }

    };


    // ============================================
    // UPDATE STUDENT
    // ============================================

    const updateStudent = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const studentData = {
                firstName: form.firstName,
                lastName: form.lastName,
                gender: form.gender,
                dateOfBirth: form.dateOfBirth,
                className: form.className,
                parentName: form.parentName,
                parentPhone: form.parentPhone,
                address: form.address
            };


            await API.put(
                `/students/${editingId}`,
                studentData
            );


            toast.success(
                "Student updated successfully"
            );


            clearForm();

            await loadStudents();

        } catch (error) {

            console.error(
                "UPDATE STUDENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update student"
            );

        } finally {

            setSaving(false);

        }

    };


    // ============================================
    // EDIT STUDENT
    // ============================================

    const editStudent = (student) => {

        setEditingId(student._id);

        setForm({

            firstName:
                student.firstName || "",

            lastName:
                student.lastName || "",

            gender:
                student.gender || "",

            dateOfBirth:
                student.dateOfBirth
                    ? String(
                        student.dateOfBirth
                    ).slice(0, 10)
                    : "",

            className:
                student.className || "",

            parentName:
                student.parentName || "",

            parentPhone:
                student.parentPhone || "",

            address:
                student.address || ""

        });


        setShowForm(true);


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    };


    // ============================================
    // DELETE STUDENT
    // ============================================

    const deleteStudent = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this student?"
            );


        if (!confirmed) return;


        try {

            await API.delete(
                `/students/${id}`
            );


            toast.success(
                "Student deleted successfully"
            );


            await loadStudents();

        } catch (error) {

            console.error(
                "DELETE STUDENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete student"
            );

        }

    };


    // ============================================
    // SEARCH
    // ============================================

    const filteredStudents =
        students.filter((student) => {

            const text =
                search
                    .toLowerCase()
                    .trim();


            const searchable = `
                ${student.firstName || ""}
                ${student.lastName || ""}
                ${student.admissionNumber || ""}
                ${student.className || ""}
                ${student.parentName || ""}
                ${student.parentPhone || ""}
            `.toLowerCase();


            return searchable.includes(text);

        });


    // ============================================
    // STATISTICS
    // ============================================

    const maleStudents =
        students.filter(
            (student) =>
                student.gender === "Male"
        ).length;


    const femaleStudents =
        students.filter(
            (student) =>
                student.gender === "Female"
        ).length;


    const activeStudents =
        students.filter(
            (student) =>
                student.isActive === true
        ).length;


    const pendingStudents =
        students.filter(
            (student) =>
                student.isActive !== true
        ).length;


    // ============================================
    // INITIALS
    // ============================================

    const getInitials = (student) => {

        const first =
            student.firstName?.charAt(0) ||
            "";

        const last =
            student.lastName?.charAt(0) ||
            "";

        return (
            first + last
        ).toUpperCase() || "?";
    };


    // ============================================
    // PAGE
    // ============================================

    return (

        <div className="modern-students-page">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="modern-page-header">

                <div>

                    <div className="modern-breadcrumb">

                        Dashboard

                        <span>/</span>

                        Students

                    </div>


                    <h1>
                        Students
                    </h1>


                    <p>
                        Manage student records,
                        admissions and parent
                        information.
                    </p>

                </div>


                <button
                    className="modern-primary-button"
                    onClick={openAddForm}
                >

                    <span>
                        +
                    </span>

                    Add Student

                </button>

            </div>


            {/* ======================================
                STATISTICS
            ====================================== */}

            <div className="student-stat-grid">

                <div className="student-stat-card">

                    <div className="student-stat-icon blue">
                        👨‍🎓
                    </div>

                    <div className="student-stat-content">

                        <span>
                            Total Students
                        </span>

                        <strong>
                            {students.length}
                        </strong>

                        <small>
                            Registered students
                        </small>

                    </div>

                </div>


                <div className="student-stat-card">

                    <div className="student-stat-icon green">
                        ✓
                    </div>

                    <div className="student-stat-content">

                        <span>
                            Active Students
                        </span>

                        <strong>
                            {activeStudents}
                        </strong>

                        <small>
                            30% payment completed
                        </small>

                    </div>

                </div>


                <div className="student-stat-card">

                    <div className="student-stat-icon orange">
                        ⏳
                    </div>

                    <div className="student-stat-content">

                        <span>
                            Pending Admission
                        </span>

                        <strong>
                            {pendingStudents}
                        </strong>

                        <small>
                            Waiting for 30% payment
                        </small>

                    </div>

                </div>


                <div className="student-stat-card">

                    <div className="student-stat-icon purple">
                        👩‍🎓
                    </div>

                    <div className="student-stat-content">

                        <span>
                            Female Students
                        </span>

                        <strong>
                            {femaleStudents}
                        </strong>

                        <small>
                            Female students
                        </small>

                    </div>

                </div>

            </div>


            {/* ======================================
                ADD / EDIT FORM
            ====================================== */}

            {showForm && (

                <div className="modern-student-form-card">

                    <div className="modern-card-header">

                        <div>

                            <h2>

                                {editingId
                                    ? "Update Student"
                                    : "Register New Student"}

                            </h2>


                            <p>

                                {editingId

                                    ? "Update the student's information."

                                    : "Register the student first. Admission number will be generated automatically after 30% school fee payment."

                                }

                            </p>

                        </div>


                        <button
                            className="modern-close-button"
                            type="button"
                            onClick={clearForm}
                        >
                            ×
                        </button>

                    </div>


                    {/* PAYMENT NOTICE */}

                    {!editingId && (

                        <div
                            style={{
                                margin: "0 24px 20px",
                                padding: "16px 18px",
                                borderRadius: "12px",
                                background: "#fff7ed",
                                border: "1px solid #fed7aa",
                                color: "#9a3412"
                            }}
                        >

                            <strong>
                                Admission information
                            </strong>

                            <p
                                style={{
                                    margin:
                                        "6px 0 0",
                                    lineHeight: 1.5
                                }}
                            >
                                The student will first
                                be registered as a
                                pending student.
                                After the student pays
                                at least 30% of the
                                school fees, the system
                                will automatically
                                generate the admission
                                number and activate the
                                student.
                            </p>

                        </div>

                    )}


                    <form
                        onSubmit={
                            editingId
                                ? updateStudent
                                : addStudent
                        }
                        className="modern-student-form"
                    >

                        <div className="modern-form-grid">


                            {/* FIRST NAME */}

                            <div>

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter first name"
                                    value={
                                        form.firstName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* LAST NAME */}

                            <div>

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Enter last name"
                                    value={
                                        form.lastName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* GENDER */}

                            <div>

                                <label>
                                    Gender
                                </label>

                                <select
                                    name="gender"
                                    value={
                                        form.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                >

                                    <option value="">
                                        Select gender
                                    </option>

                                    <option value="Male">
                                        Male
                                    </option>

                                    <option value="Female">
                                        Female
                                    </option>

                                </select>

                            </div>


                            {/* DATE OF BIRTH */}

                            <div>

                                <label>
                                    Date of Birth
                                </label>

                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={
                                        form.dateOfBirth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* CLASS */}

                            <div>

                                <label>
                                    Class
                                </label>

                                <input
                                    type="text"
                                    name="className"
                                    placeholder="e.g. JHS 1"
                                    value={
                                        form.className
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* STATUS — INFORMATION ONLY */}

                            {!editingId && (

                                <div>

                                    <label>
                                        Admission Status
                                    </label>

                                    <input
                                        type="text"
                                        value="Pending — 30% payment required"
                                        disabled
                                        readOnly
                                    />

                                </div>

                            )}


                            {/* PARENT */}

                            <div>

                                <label>
                                    Parent / Guardian
                                </label>

                                <input
                                    type="text"
                                    name="parentName"
                                    placeholder="Parent or guardian name"
                                    value={
                                        form.parentName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* PHONE */}

                            <div>

                                <label>
                                    Parent Phone
                                </label>

                                <input
                                    type="tel"
                                    name="parentPhone"
                                    placeholder="e.g. 024 000 0000"
                                    value={
                                        form.parentPhone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            {/* ADDRESS */}

                            <div className="modern-form-full">

                                <label>
                                    Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    placeholder="Enter student's address"
                                    value={
                                        form.address
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                        </div>


                        {/* ACTIONS */}

                        <div className="modern-form-actions">

                            <button
                                type="button"
                                className="modern-secondary-button"
                                onClick={clearForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="modern-primary-button"
                                disabled={saving}
                            >

                                {saving

                                    ? "Saving..."

                                    : editingId
                                        ? "Update Student"
                                        : "Register Student"

                                }

                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* ======================================
                STUDENT RECORDS
            ====================================== */}

            <div className="modern-students-card">

                <div className="modern-card-header student-record-header">

                    <div>

                        <h2>
                            Student Directory
                        </h2>

                        <p>
                            Search and manage all
                            registered students.
                        </p>

                    </div>


                    <div className="student-record-total">

                        <strong>
                            {filteredStudents.length}
                        </strong>

                        <span>
                            Students
                        </span>

                    </div>

                </div>


                {/* SEARCH */}

                <div className="modern-search-area">

                    <div className="modern-search">

                        <span>
                            ⌕
                        </span>

                        <input
                            type="text"
                            placeholder="Search student, admission number, class or parent..."
                            value={search}
                            onChange={(e) =>
                                setSearch(
                                    e.target.value
                                )
                            }
                        />


                        {search && (

                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>

                        )}

                    </div>

                </div>


                {/* TABLE */}

                {loading ? (

                    <div className="modern-empty-state">

                        <div className="modern-spinner"></div>

                        <h3>
                            Loading students...
                        </h3>

                        <p>
                            Please wait while
                            records are being loaded.
                        </p>

                    </div>

                ) : filteredStudents.length === 0 ? (

                    <div className="modern-empty-state">

                        <div className="modern-empty-icon">
                            👨‍🎓
                        </div>

                        <h3>

                            {search
                                ? "No students found"
                                : "No students registered"}

                        </h3>

                        <p>

                            {search
                                ? "Try another search term."
                                : "Add your first student to begin."}

                        </p>


                        {!search && (

                            <button
                                className="modern-primary-button"
                                onClick={openAddForm}
                            >
                                + Add Student
                            </button>

                        )}

                    </div>

                ) : (

                    <div className="modern-table-wrapper">

                        <table className="modern-student-table">

                            <thead>

                                <tr>

                                    <th>
                                        STUDENT
                                    </th>

                                    <th>
                                        CLASS
                                    </th>

                                    <th>
                                        GENDER
                                    </th>

                                    <th>
                                        ADMISSION NO.
                                    </th>

                                    <th>
                                        STATUS
                                    </th>

                                    <th>
                                        PARENT / GUARDIAN
                                    </th>

                                    <th>
                                        PHONE
                                    </th>

                                    <th>
                                        ACTION
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredStudents.map(
                                    (student) => (

                                        <tr
                                            key={
                                                student._id
                                            }
                                        >

                                            {/* STUDENT */}

                                            <td>

                                                <div className="modern-student-info">

                                                    <div className="modern-student-avatar">

                                                        {getInitials(
                                                            student
                                                        )}

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                student.firstName
                                                            }{" "}

                                                            {
                                                                student.lastName
                                                            }

                                                        </strong>


                                                        <small>

                                                            {student.dateOfBirth

                                                                ? `DOB: ${String(
                                                                    student.dateOfBirth
                                                                ).slice(
                                                                    0,
                                                                    10
                                                                )}`

                                                                : "DOB not provided"}

                                                        </small>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* CLASS */}

                                            <td>

                                                <span className="modern-class-badge">

                                                    {
                                                        student.className ||
                                                        "N/A"
                                                    }

                                                </span>

                                            </td>


                                            {/* GENDER */}

                                            <td>

                                                <span className="modern-gender-badge">

                                                    {
                                                        student.gender ||
                                                        "N/A"
                                                    }

                                                </span>

                                            </td>


                                            {/* ADMISSION NUMBER */}

                                            <td>

                                                <strong className="modern-admission">

                                                    {
                                                        student.admissionNumber ||

                                                        "Pending"
                                                    }

                                                </strong>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                {student.isActive === true ? (

                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-flex",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "6px",
                                                            padding:
                                                                "6px 10px",
                                                            borderRadius:
                                                                "999px",
                                                            background:
                                                                "#dcfce7",
                                                            color:
                                                                "#166534",
                                                            fontSize:
                                                                "12px",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >

                                                        ● Active

                                                    </span>

                                                ) : (

                                                    <span
                                                        style={{
                                                            display:
                                                                "inline-flex",
                                                            alignItems:
                                                                "center",
                                                            gap:
                                                                "6px",
                                                            padding:
                                                                "6px 10px",
                                                            borderRadius:
                                                                "999px",
                                                            background:
                                                                "#fff7ed",
                                                            color:
                                                                "#c2410c",
                                                            fontSize:
                                                                "12px",
                                                            fontWeight:
                                                                "700"
                                                        }}
                                                    >

                                                        ● Pending 30%

                                                    </span>

                                                )}

                                            </td>


                                            {/* PARENT */}

                                            <td>

                                                <span className="modern-parent">

                                                    {
                                                        student.parentName ||
                                                        "Not provided"
                                                    }

                                                </span>

                                            </td>


                                            {/* PHONE */}

                                            <td>

                                                <span className="modern-phone">

                                                    {
                                                        student.parentPhone ||
                                                        "Not provided"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTION */}

                                            <td>

                                                <div className="modern-actions">

                                                    <button
                                                        className="modern-edit-button"
                                                        onClick={() =>
                                                            editStudent(
                                                                student
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        className="modern-delete-button"
                                                        onClick={() =>
                                                            deleteStudent(
                                                                student._id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );
}

export default Students;
