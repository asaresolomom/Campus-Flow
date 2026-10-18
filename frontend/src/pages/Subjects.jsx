import { useState, useEffect } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

function Subjects() {
const [subjects, setSubjects] = useState([]);
const [teachers, setTeachers] = useState([]);
const [classes, setClasses] = useState([]);


const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [showForm, setShowForm] = useState(false);

const emptyForm = {
    subjectName: "",
    subjectCode: "",
    teacher: "",
    class: ""
};

const [form, setForm] = useState(emptyForm);

const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
        ...previous,
        [name]: value
    }));
};

const loadSubjects = async () => {
    try {
        setLoading(true);

        const response = await API.get("/subjects/all");

        setSubjects(response.data?.subjects || []);
    } catch (error) {
        console.error("LOAD SUBJECTS ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to load subjects"
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
    }
};

const loadClasses = async () => {
    try {
        const response = await API.get("/classes/all");

        setClasses(response.data?.classes || []);
    } catch (error) {
        console.error("LOAD CLASSES ERROR:", error);
    }
};

useEffect(() => {
    loadSubjects();
    loadTeachers();
    loadClasses();
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

const addSubject = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        await API.post("/subjects/add", form);

        toast.success("Subject created successfully");

        clearForm();
        await loadSubjects();
    } catch (error) {
        console.error("ADD SUBJECT ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to create subject"
        );
    } finally {
        setSaving(false);
    }
};

const updateSubject = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        await API.put(
            `/subjects/${editingId}`,
            form
        );

        toast.success("Subject updated successfully");

        clearForm();
        await loadSubjects();
    } catch (error) {
        console.error("UPDATE SUBJECT ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to update subject"
        );
    } finally {
        setSaving(false);
    }
};

const editSubject = (subject) => {
    setEditingId(subject._id);

    setForm({
        subjectName: subject.subjectName || "",
        subjectCode: subject.subjectCode || "",
        teacher: subject.teacher?._id || "",
        class: subject.class?._id || ""
    });

    setShowForm(true);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const deleteSubject = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this subject?"
    );

    if (!confirmed) return;

    try {
        await API.delete(`/subjects/${id}`);

        toast.success("Subject deleted successfully");

        await loadSubjects();
    } catch (error) {
        console.error("DELETE SUBJECT ERROR:", error);

        toast.error(
            error.response?.data?.message ||
            "Failed to delete subject"
        );
    }
};

const filteredSubjects = subjects.filter((subject) => {
    const text = search.toLowerCase().trim();

    const teacherName = subject.teacher
        ? `${subject.teacher.firstName || ""} ${subject.teacher.lastName || ""}`
        : "";

    const className = subject.class
        ? `${subject.class.className || ""} ${subject.class.section || ""}`
        : "";

    const searchable = `
        ${subject.subjectName || ""}
        ${subject.subjectCode || ""}
        ${teacherName}
        ${className}
    `.toLowerCase();

    return searchable.includes(text);
});

return (
    <div className="modern-subjects-page">

        {/* PAGE HEADER */}

        <div className="modern-page-header">

            <div>

                <div className="modern-breadcrumb">
                    Dashboard
                    <span>/</span>
                    Subjects
                </div>

                <h1>Subjects</h1>

                <p>
                    Manage subjects, teachers and class assignments.
                </p>

            </div>

            <button
                className="modern-primary-button"
                onClick={openAddForm}
            >
                <span>+</span>
                Add Subject
            </button>

        </div>


        {/* STATISTICS */}

        <div className="student-stat-grid">

            <div className="student-stat-card">

                <div className="student-stat-icon blue">
                    📚
                </div>

                <div className="student-stat-content">

                    <span>Total Subjects</span>

                    <strong>
                        {subjects.length}
                    </strong>

                    <small>
                        Registered subjects
                    </small>

                </div>

            </div>


            <div className="student-stat-card">

                <div className="student-stat-icon green">
                    👨‍🏫
                </div>

                <div className="student-stat-content">

                    <span>Teachers</span>

                    <strong>
                        {teachers.length}
                    </strong>

                    <small>
                        Available teachers
                    </small>

                </div>

            </div>


            <div className="student-stat-card">

                <div className="student-stat-icon purple">
                    🏫
                </div>

                <div className="student-stat-content">

                    <span>Classes</span>

                    <strong>
                        {classes.length}
                    </strong>

                    <small>
                        Active classes
                    </small>

                </div>

            </div>


            <div className="student-stat-card">

                <div className="student-stat-icon orange">
                    🔎
                </div>

                <div className="student-stat-content">

                    <span>Showing</span>

                    <strong>
                        {filteredSubjects.length}
                    </strong>

                    <small>
                        Current results
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
                                ? "Update Subject"
                                : "Create New Subject"}
                        </h2>

                        <p>
                            Enter the subject details and assign
                            a teacher and class.
                        </p>

                    </div>

                    <button
                        type="button"
                        className="modern-close-button"
                        onClick={clearForm}
                    >
                        ×
                    </button>

                </div>


                <form
                    onSubmit={
                        editingId
                            ? updateSubject
                            : addSubject
                    }
                    className="modern-student-form"
                >

                    <div className="modern-form-grid">

                        <div>

                            <label>
                                Subject Name
                            </label>

                            <input
                                type="text"
                                name="subjectName"
                                placeholder="e.g. Mathematics"
                                value={form.subjectName}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Subject Code
                            </label>

                            <input
                                type="text"
                                name="subjectCode"
                                placeholder="e.g. MAT101"
                                value={form.subjectCode}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Teacher
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


                        <div>

                            <label>
                                Class
                            </label>

                            <select
                                name="class"
                                value={form.class}
                                onChange={handleChange}
                            >

                                <option value="">
                                    Select Class
                                </option>

                                {classes.map((item) => (
                                    <option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.className}{" "}
                                        {item.section
                                            ? `- ${item.section}`
                                            : ""}
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
                                ? "Update Subject"
                                : "Create Subject"}
                        </button>

                    </div>

                </form>

            </div>
        )}


        {/* SUBJECT DIRECTORY */}

        <div className="modern-students-card">

            <div className="modern-card-header student-record-header">

                <div>

                    <h2>
                        Subject Directory
                    </h2>

                    <p>
                        Search and manage all registered subjects.
                    </p>

                </div>

                <div className="student-record-total">

                    <strong>
                        {filteredSubjects.length}
                    </strong>

                    <span>
                        Subjects
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
                        placeholder="Search subject, code, teacher or class..."
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


            {/* CONTENT */}

            {loading ? (

                <div className="modern-empty-state">

                    <div className="modern-spinner"></div>

                    <h3>
                        Loading subjects...
                    </h3>

                    <p>
                        Please wait while records are being loaded.
                    </p>

                </div>

            ) : filteredSubjects.length === 0 ? (

                <div className="modern-empty-state">

                    <div className="modern-empty-icon">
                        📚
                    </div>

                    <h3>
                        {search
                            ? "No subjects found"
                            : "No subjects registered"}
                    </h3>

                    <p>
                        {search
                            ? "Try another search term."
                            : "Create your first subject to begin."}
                    </p>

                    {!search && (
                        <button
                            className="modern-primary-button"
                            onClick={openAddForm}
                        >
                            + Add Subject
                        </button>
                    )}

                </div>

            ) : (

                <div className="modern-table-wrapper">

                    <table className="modern-student-table">

                        <thead>

                            <tr>
                                <th>SUBJECT</th>
                                <th>CODE</th>
                                <th>TEACHER</th>
                                <th>CLASS</th>
                                <th>ACTIONS</th>
                            </tr>

                        </thead>


                        <tbody>

                            {filteredSubjects.map((subject) => (

                                <tr key={subject._id}>

                                    <td>

                                        <div className="modern-student-info">

                                            <div className="modern-student-avatar">
                                                📚
                                            </div>

                                            <div>

                                                <strong>
                                                    {subject.subjectName}
                                                </strong>

                                                <small>
                                                    Academic subject
                                                </small>

                                            </div>

                                        </div>

                                    </td>


                                    <td>

                                        <span className="modern-admission">
                                            {subject.subjectCode || "N/A"}
                                        </span>

                                    </td>


                                    <td>

                                        <span className="modern-parent">

                                            {subject.teacher
                                                ? `${subject.teacher.firstName} ${subject.teacher.lastName}`
                                                : "No teacher"}

                                        </span>

                                    </td>


                                    <td>

                                        <span className="modern-class-badge">

                                            {subject.class
                                                ? `${subject.class.className} ${subject.class.section || ""}`
                                                : "No class"}

                                        </span>

                                    </td>


                                    <td>

                                        <div className="modern-actions">

                                            <button
                                                className="modern-edit-button"
                                                onClick={() =>
                                                    editSubject(subject)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="modern-delete-button"
                                                onClick={() =>
                                                    deleteSubject(
                                                        subject._id
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

export default Subjects;
