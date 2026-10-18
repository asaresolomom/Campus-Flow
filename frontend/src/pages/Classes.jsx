import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Classes() {
const [classes, setClasses] = useState([]);
const [teachers, setTeachers] = useState([]);
const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [showForm, setShowForm] = useState(false);

const emptyForm = {
    className: "",
    section: "",
    academicYear: "",
    teacher: ""
};

const [form, setForm] = useState(emptyForm);

const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
        ...previous,
        [name]: value
    }));
};

const loadClasses = async () => {
    try {
        setLoading(true);

        const response = await API.get("/classes/all");

        setClasses(response.data?.classes || []);
    } catch (error) {
        console.error("LOAD CLASSES ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to load classes"
        );
    } finally {
        setLoading(false);
    }
};

const loadTeachers = async () => {
    try {
        const response = await API.get("/teachers/all");

        setTeachers(response.data?.teachers || []);
    } catch (error) {
        console.error("LOAD TEACHERS ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to load teachers"
        );
    }
};

useEffect(() => {
    loadClasses();
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

const addClass = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        await API.post("/classes/add", form);

        toast.success("Class created successfully");

        clearForm();

        await loadClasses();
    } catch (error) {
        console.error("ADD CLASS ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to create class"
        );
    } finally {
        setSaving(false);
    }
};

const updateClass = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        await API.put(
            `/classes/${editingId}`,
            form
        );

        toast.success("Class updated successfully");

        clearForm();

        await loadClasses();
    } catch (error) {
        console.error("UPDATE CLASS ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to update class"
        );
    } finally {
        setSaving(false);
    }
};

const editClass = (item) => {
    setEditingId(item._id);

    setForm({
        className: item.className || "",
        section: item.section || "",
        academicYear: item.academicYear || "",
        teacher: item.teacher?._id || ""
    });

    setShowForm(true);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const deleteClass = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this class?"
    );

    if (!confirmed) return;

    try {
        await API.delete(`/classes/${id}`);

        toast.success("Class deleted successfully");

        await loadClasses();
    } catch (error) {
        console.error("DELETE CLASS ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to delete class"
        );
    }
};

const filteredClasses = classes.filter((item) => {
    const text = search.toLowerCase().trim();

    const teacherName = item.teacher
        ? `${item.teacher.firstName || ""} ${item.teacher.lastName || ""}`
        : "";

    const searchable = `
        ${item.className || ""}
        ${item.section || ""}
        ${item.academicYear || ""}
        ${teacherName}
    `.toLowerCase();

    return searchable.includes(text);
});

const assignedClasses = classes.filter(
    (item) => item.teacher
).length;

const unassignedClasses = classes.filter(
    (item) => !item.teacher
).length;

const currentYear = new Date().getFullYear();

const currentYearClasses = classes.filter(
    (item) =>
        String(item.academicYear || "").includes(
            String(currentYear)
        )
).length;

const getClassInitials = (item) => {
    const name = item.className || "CL";

    return name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();
};

return (
    <div className="modern-classes-page">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="modern-page-header">

            <div>

                <div className="modern-breadcrumb">
                    Dashboard
                    <span>/</span>
                    Classes
                </div>

                <h1>
                    Classes
                </h1>

                <p>
                    Manage classes, sections, academic years
                    and assigned teachers.
                </p>

            </div>

            <button
                className="modern-primary-button"
                onClick={openAddForm}
            >
                <span>+</span>
                Add Class
            </button>

        </div>


        {/* =================================================
            STATISTICS
        ================================================= */}

        <div className="classes-stat-grid">

            <div className="classes-stat-card">

                <div className="classes-stat-icon blue">
                    🏫
                </div>

                <div className="classes-stat-content">

                    <span>
                        Total Classes
                    </span>

                    <strong>
                        {classes.length}
                    </strong>

                    <small>
                        Registered classes
                    </small>

                </div>

            </div>


            <div className="classes-stat-card">

                <div className="classes-stat-icon green">
                    👨‍🏫
                </div>

                <div className="classes-stat-content">

                    <span>
                        Assigned Teachers
                    </span>

                    <strong>
                        {assignedClasses}
                    </strong>

                    <small>
                        Classes with teachers
                    </small>

                </div>

            </div>


            <div className="classes-stat-card">

                <div className="classes-stat-icon orange">
                    ⚠️
                </div>

                <div className="classes-stat-content">

                    <span>
                        Unassigned
                    </span>

                    <strong>
                        {unassignedClasses}
                    </strong>

                    <small>
                        Need a teacher
                    </small>

                </div>

            </div>


            <div className="classes-stat-card">

                <div className="classes-stat-icon purple">
                    📚
                </div>

                <div className="classes-stat-content">

                    <span>
                        Showing
                    </span>

                    <strong>
                        {filteredClasses.length}
                    </strong>

                    <small>
                        Current results
                    </small>

                </div>

            </div>

        </div>


        {/* =================================================
            ADD / EDIT FORM
        ================================================= */}

        {showForm && (

            <div className="modern-class-form-card">

                <div className="modern-card-header">

                    <div>

                        <h2>
                            {editingId
                                ? "Update Class"
                                : "Create New Class"}
                        </h2>

                        <p>
                            Enter the class information below.
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
                            ? updateClass
                            : addClass
                    }
                    className="modern-class-form"
                >

                    <div className="modern-form-grid">

                        <div>

                            <label>
                                Class Name
                            </label>

                            <input
                                type="text"
                                name="className"
                                placeholder="e.g. JHS 1"
                                value={form.className}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Section
                            </label>

                            <input
                                type="text"
                                name="section"
                                placeholder="e.g. A"
                                value={form.section}
                                onChange={handleChange}
                            />

                        </div>


                        <div>

                            <label>
                                Academic Year
                            </label>

                            <input
                                type="text"
                                name="academicYear"
                                placeholder="e.g. 2026/2027"
                                value={form.academicYear}
                                onChange={handleChange}
                            />

                        </div>


                        <div>

                            <label>
                                Class Teacher
                            </label>

                            <select
                                name="teacher"
                                value={form.teacher}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Teacher
                                </option>

                                {teachers.map((teacher) => (

                                    <option
                                        key={teacher._id}
                                        value={teacher._id}
                                    >
                                        {teacher.firstName}{" "}
                                        {teacher.lastName}
                                    </option>

                                ))}

                            </select>

                        </div>

                    </div>


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
                                ? "Update Class"
                                : "Create Class"}
                        </button>

                    </div>

                </form>

            </div>

        )}


        {/* =================================================
            CLASS DIRECTORY
        ================================================= */}

        <div className="modern-classes-card">

            <div className="modern-card-header class-record-header">

                <div>

                    <h2>
                        Class Directory
                    </h2>

                    <p>
                        Search and manage all registered
                        classes.
                    </p>

                </div>

                <div className="class-record-total">

                    <strong>
                        {filteredClasses.length}
                    </strong>

                    <span>
                        Classes
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
                        placeholder="Search class, section, academic year or teacher..."
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


            {/* =================================================
                TABLE
            ================================================= */}

            {loading ? (

                <div className="modern-empty-state">

                    <div className="modern-spinner"></div>

                    <h3>
                        Loading classes...
                    </h3>

                    <p>
                        Please wait while class records
                        are being loaded.
                    </p>

                </div>

            ) : filteredClasses.length === 0 ? (

                <div className="modern-empty-state">

                    <div className="modern-empty-icon">
                        🏫
                    </div>

                    <h3>
                        {search
                            ? "No classes found"
                            : "No classes registered"}
                    </h3>

                    <p>
                        {search
                            ? "Try another search term."
                            : "Create your first class to begin."}
                    </p>

                    {!search && (

                        <button
                            className="modern-primary-button"
                            onClick={openAddForm}
                        >
                            + Add Class
                        </button>

                    )}

                </div>

            ) : (

                <div className="modern-table-wrapper">

                    <table className="modern-class-table">

                        <thead>

                            <tr>

                                <th>
                                    CLASS
                                </th>

                                <th>
                                    SECTION
                                </th>

                                <th>
                                    ACADEMIC YEAR
                                </th>

                                <th>
                                    CLASS TEACHER
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    ACTION
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredClasses.map((item) => (

                                <tr key={item._id}>

                                    <td>

                                        <div className="modern-class-info">

                                            <div className="modern-class-avatar">
                                                {getClassInitials(item)}
                                            </div>

                                            <div>

                                                <strong>
                                                    {item.className}
                                                </strong>

                                                <small>
                                                    Class record
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>

                                        <span className="modern-section-badge">
                                            {item.section || "No section"}
                                        </span>

                                    </td>


                                    <td>

                                        <span className="modern-year">
                                            {item.academicYear || "Not provided"}
                                        </span>

                                    </td>


                                    <td>

                                        {item.teacher ? (

                                            <div className="modern-teacher-info">

                                                <div className="modern-teacher-avatar">

                                                    {(
                                                        item.teacher.firstName?.charAt(0) ||
                                                        ""
                                                    ) + (
                                                        item.teacher.lastName?.charAt(0) ||
                                                        ""
                                                    )}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {item.teacher.firstName}{" "}
                                                        {item.teacher.lastName}
                                                    </strong>

                                                    <small>
                                                        Class Teacher
                                                    </small>

                                                </div>

                                            </div>

                                        ) : (

                                            <span className="modern-no-teacher">
                                                No teacher assigned
                                            </span>

                                        )}

                                    </td>


                                    <td>

                                        {item.teacher ? (

                                            <span className="modern-assigned-badge">
                                                Assigned
                                            </span>

                                        ) : (

                                            <span className="modern-unassigned-badge">
                                                Unassigned
                                            </span>

                                        )}

                                    </td>


                                    <td>

                                        <div className="modern-actions">

                                            <button
                                                className="modern-edit-button"
                                                onClick={() =>
                                                    editClass(item)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="modern-delete-button"
                                                onClick={() =>
                                                    deleteClass(
                                                        item._id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            )}

        </div>

    </div>
);


}

export default Classes;
