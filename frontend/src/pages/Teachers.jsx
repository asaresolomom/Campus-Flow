import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Teachers() {
const emptyForm = {
firstName: "",
lastName: "",
gender: "",
email: "",
phone: "",
subject: "",
qualification: "",
address: ""
};


const [teachers, setTeachers] = useState([]);
const [search, setSearch] = useState("");
const [editingId, setEditingId] = useState(null);
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [showForm, setShowForm] = useState(false);
const [form, setForm] = useState(emptyForm);

const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
        ...previous,
        [name]: value
    }));
};

const loadTeachers = async () => {
    try {
        setLoading(true);

        const response = await API.get("/teachers/all");

        setTeachers(response.data?.teachers || []);
    } catch (error) {
        console.error("LOAD TEACHERS ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to load teachers"
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    loadTeachers();
}, []);

const clearForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
};

const openAddForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
};

const addTeacher = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        await API.post("/teachers/add", form);

        toast.success("Teacher added successfully");

        clearForm();

        await loadTeachers();
    } catch (error) {
        console.error("ADD TEACHER ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to add teacher"
        );
    } finally {
        setSaving(false);
    }
};

const updateTeacher = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        await API.put(
            `/teachers/${editingId}`,
            form
        );

        toast.success("Teacher updated successfully");

        clearForm();

        await loadTeachers();
    } catch (error) {
        console.error("UPDATE TEACHER ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to update teacher"
        );
    } finally {
        setSaving(false);
    }
};

const editTeacher = (teacher) => {
    setEditingId(teacher._id);

    setForm({
        firstName:
            teacher.firstName ||
            teacher.name?.split(" ")[0] ||
            "",

        lastName:
            teacher.lastName ||
            teacher.name?.split(" ").slice(1).join(" ") ||
            "",

        gender: teacher.gender || "",
        email: teacher.email || "",
        phone: teacher.phone || "",
        subject: teacher.subject || "",
        qualification: teacher.qualification || "",
        address: teacher.address || ""
    });

    setShowForm(true);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const deleteTeacher = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this teacher?"
    );

    if (!confirmed) return;

    try {
        await API.delete(`/teachers/${id}`);

        toast.success("Teacher deleted successfully");

        await loadTeachers();
    } catch (error) {
        console.error("DELETE TEACHER ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to delete teacher"
        );
    }
};

const getTeacherName = (teacher) => {
    if (teacher.firstName || teacher.lastName) {
        return `${teacher.firstName || ""} ${teacher.lastName || ""}`.trim();
    }

    return teacher.name || "Unknown Teacher";
};

const getInitials = (teacher) => {
    const first =
        teacher.firstName?.charAt(0) ||
        teacher.name?.charAt(0) ||
        "";

    const last =
        teacher.lastName?.charAt(0) ||
        teacher.name?.split(" ")[1]?.charAt(0) ||
        "";

    return (
        `${first}${last}`.toUpperCase() || "T"
    );
};

const filteredTeachers = teachers.filter((teacher) => {
    const text = search.toLowerCase().trim();

    const searchable = `
        ${teacher.firstName || ""}
        ${teacher.lastName || ""}
        ${teacher.name || ""}
        ${teacher.email || ""}
        ${teacher.phone || ""}
        ${teacher.subject || ""}
        ${teacher.qualification || ""}
    `.toLowerCase();

    return searchable.includes(text);
});

const totalTeachers = teachers.length;

const maleTeachers = teachers.filter(
    (teacher) => teacher.gender === "Male"
).length;

const femaleTeachers = teachers.filter(
    (teacher) => teacher.gender === "Female"
).length;

const subjects = new Set(
    teachers
        .map((teacher) => teacher.subject)
        .filter(Boolean)
).size;

return (
    <div className="modern-students-page">

        {/* PAGE HEADER */}

        <div className="modern-page-header">

            <div>

                <div className="modern-breadcrumb">
                    Dashboard
                    <span>/</span>
                    Teachers
                </div>

                <h1>Teachers</h1>

                <p>
                    Manage teachers, staff information,
                    subjects and qualifications.
                </p>

            </div>

            <button
                className="modern-primary-button"
                onClick={openAddForm}
            >
                <span>+</span>
                Add Teacher
            </button>

        </div>


        {/* STATISTICS */}

        <div className="student-stat-grid">

            <div className="student-stat-card">

                <div className="student-stat-icon blue">
                    👨‍🏫
                </div>

                <div className="student-stat-content">

                    <span>Total Teachers</span>

                    <strong>
                        {totalTeachers}
                    </strong>

                    <small>
                        Registered teachers
                    </small>

                </div>

            </div>


            <div className="student-stat-card">

                <div className="student-stat-icon green">
                    👨
                </div>

                <div className="student-stat-content">

                    <span>Male Teachers</span>

                    <strong>
                        {maleTeachers}
                    </strong>

                    <small>
                        Male staff
                    </small>

                </div>

            </div>


            <div className="student-stat-card">

                <div className="student-stat-icon purple">
                    👩
                </div>

                <div className="student-stat-content">

                    <span>Female Teachers</span>

                    <strong>
                        {femaleTeachers}
                    </strong>

                    <small>
                        Female staff
                    </small>

                </div>

            </div>


            <div className="student-stat-card">

                <div className="student-stat-icon orange">
                    📚
                </div>

                <div className="student-stat-content">

                    <span>Subjects</span>

                    <strong>
                        {subjects}
                    </strong>

                    <small>
                        Subjects assigned
                    </small>

                </div>

            </div>

        </div>


        {/* ADD / EDIT FORM */}

        {showForm && (
            <div className="modern-student-form-card">

                <div className="modern-card-header">

                    <div>

                        <h2>
                            {editingId
                                ? "Update Teacher"
                                : "Register New Teacher"}
                        </h2>

                        <p>
                            Enter the teacher's information
                            to create a staff record.
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


                <form
                    onSubmit={
                        editingId
                            ? updateTeacher
                            : addTeacher
                    }
                    className="modern-student-form"
                >

                    <div className="modern-form-grid">

                        {/* FIRST NAME */}

                        <div>

                            <label>First Name</label>

                            <input
                                type="text"
                                name="firstName"
                                placeholder="Enter first name"
                                value={form.firstName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* LAST NAME */}

                        <div>

                            <label>Last Name</label>

                            <input
                                type="text"
                                name="lastName"
                                placeholder="Enter last name"
                                value={form.lastName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* GENDER */}

                        <div>

                            <label>Gender</label>

                            <select
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
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


                        {/* EMAIL */}

                        <div>

                            <label>Email</label>

                            <input
                                type="email"
                                name="email"
                                placeholder="teacher@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* PHONE */}

                        <div>

                            <label>Phone</label>

                            <input
                                type="tel"
                                name="phone"
                                placeholder="e.g. 024 000 0000"
                                value={form.phone}
                                onChange={handleChange}
                            />

                        </div>


                        {/* SUBJECT */}

                        <div>

                            <label>Subject</label>

                            <input
                                type="text"
                                name="subject"
                                placeholder="e.g. Mathematics"
                                value={form.subject}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* QUALIFICATION */}

                        <div>

                            <label>Qualification</label>

                            <input
                                type="text"
                                name="qualification"
                                placeholder="e.g. B.Ed Mathematics"
                                value={form.qualification}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        {/* ADDRESS */}

                        <div>

                            <label>Address</label>

                            <input
                                type="text"
                                name="address"
                                placeholder="Enter teacher's address"
                                value={form.address}
                                onChange={handleChange}
                            />

                        </div>

                    </div>


                    {/* FORM ACTIONS */}

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
                                ? "Update Teacher"
                                : "Add Teacher"}
                        </button>

                    </div>

                </form>

            </div>
        )}


        {/* TEACHER DIRECTORY */}

        <div className="modern-students-card">

            <div className="modern-card-header student-record-header">

                <div>

                    <h2>
                        Teacher Directory
                    </h2>

                    <p>
                        Search and manage all registered
                        teachers.
                    </p>

                </div>

                <div className="student-record-total">

                    <strong>
                        {filteredTeachers.length}
                    </strong>

                    <span>
                        Teachers
                    </span>

                </div>

            </div>


            {/* SEARCH */}

            <div className="modern-search-area">

                <div className="modern-search">

                    <span>⌕</span>

                    <input
                        type="text"
                        placeholder="Search teacher, email, subject or qualification..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
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
                        Loading teachers...
                    </h3>

                    <p>
                        Please wait while teacher records
                        are being loaded.
                    </p>

                </div>

            ) : filteredTeachers.length === 0 ? (

                <div className="modern-empty-state">

                    <div className="modern-empty-icon">
                        👨‍🏫
                    </div>

                    <h3>
                        {search
                            ? "No teachers found"
                            : "No teachers registered"}
                    </h3>

                    <p>
                        {search
                            ? "Try another search term."
                            : "Add your first teacher to begin."}
                    </p>

                    {!search && (
                        <button
                            className="modern-primary-button"
                            onClick={openAddForm}
                        >
                            + Add Teacher
                        </button>
                    )}

                </div>

            ) : (

                <div className="modern-table-wrapper">

                    <table className="modern-student-table">

                        <thead>

                            <tr>

                                <th>TEACHER</th>
                                <th>SUBJECT</th>
                                <th>GENDER</th>
                                <th>EMAIL</th>
                                <th>PHONE</th>
                                <th>QUALIFICATION</th>
                                <th>ACTION</th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredTeachers.map(
                                (teacher) => (

                                    <tr key={teacher._id}>

                                        {/* TEACHER */}

                                        <td>

                                            <div className="modern-student-info">

                                                <div className="modern-student-avatar">

                                                    {getInitials(
                                                        teacher
                                                    )}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {getTeacherName(
                                                            teacher
                                                        )}
                                                    </strong>

                                                    <small>
                                                        {teacher.address ||
                                                            "Address not provided"}
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        {/* SUBJECT */}

                                        <td>

                                            <span className="modern-class-badge">

                                                {teacher.subject ||
                                                    "Not assigned"}

                                            </span>

                                        </td>


                                        {/* GENDER */}

                                        <td>

                                            <span className="modern-gender-badge">

                                                {teacher.gender ||
                                                    "N/A"}

                                            </span>

                                        </td>


                                        {/* EMAIL */}

                                        <td>

                                            <span className="modern-parent">

                                                {teacher.email ||
                                                    "Not provided"}

                                            </span>

                                        </td>


                                        {/* PHONE */}

                                        <td>

                                            <span className="modern-phone">

                                                {teacher.phone ||
                                                    "Not provided"}

                                            </span>

                                        </td>


                                        {/* QUALIFICATION */}

                                        <td>

                                            <span className="modern-parent">

                                                {teacher.qualification ||
                                                    "Not provided"}

                                            </span>

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <div className="modern-actions">

                                                <button
                                                    className="modern-edit-button"
                                                    onClick={() =>
                                                        editTeacher(
                                                            teacher
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="modern-delete-button"
                                                    onClick={() =>
                                                        deleteTeacher(
                                                            teacher._id
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

export default Teachers;
