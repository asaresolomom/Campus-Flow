import { useState, useEffect } from "react";
import API from "../services/api";

function Attendance() {
const [attendance, setAttendance] = useState([]);
const [students, setStudents] = useState([]);
const [teachers, setTeachers] = useState([]);
const [classes, setClasses] = useState([]);
const [subjects, setSubjects] = useState([]);


const [editingId, setEditingId] = useState(null);
const [search, setSearch] = useState("");
const [loading, setLoading] = useState(false);
const [saving, setSaving] = useState(false);
const [showForm, setShowForm] = useState(false);

const emptyForm = {
    student: "",
    class: "",
    subject: "",
    teacher: "",
    attendanceDate: "",
    status: "Present"
};

const [form, setForm] = useState(emptyForm);

const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
        ...previous,
        [name]: value
    }));
};

const loadData = async () => {
    try {
        setLoading(true);

        const [
            attendanceData,
            studentData,
            teacherData,
            classData,
            subjectData
        ] = await Promise.all([
            API.get("/attendance/all"),
            API.get("/students/all"),
            API.get("/teachers/all"),
            API.get("/classes/all"),
            API.get("/subjects/all")
        ]);

        setAttendance(
            attendanceData.data?.attendance || []
        );

        setStudents(
            studentData.data?.students || []
        );

        setTeachers(
            teacherData.data?.teachers || []
        );

        setClasses(
            classData.data?.classes || []
        );

        setSubjects(
            subjectData.data?.subjects || []
        );
    } catch (error) {
        console.error("LOAD ATTENDANCE DATA ERROR:", error);

        alert(
            error.response?.data?.message ||
            "Failed to load attendance data"
        );
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    loadData();
}, []);

const clearForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(false);
};

const openAddForm = () => {
    setEditingId(null);
    setForm({
        ...emptyForm,
        attendanceDate: new Date()
            .toISOString()
            .substring(0, 10)
    });
    setShowForm(true);
};

const saveAttendance = async (e) => {
    e.preventDefault();

    try {
        setSaving(true);

        if (editingId) {
            await API.put(
                `/attendance/${editingId}`,
                form
            );

            alert("Attendance updated successfully");
        } else {
            await API.post(
                "/attendance/add",
                form
            );

            alert("Attendance saved successfully");
        }

        clearForm();

        await loadData();
    } catch (error) {
        console.error("SAVE ATTENDANCE ERROR:", error);

        alert(
            error.response?.data?.message ||
            "Attendance failed"
        );
    } finally {
        setSaving(false);
    }
};

const editAttendance = (item) => {
    setEditingId(item._id);

    setForm({
        student: item.student?._id || "",
        class: item.class?._id || "",
        subject: item.subject?._id || "",
        teacher: item.teacher?._id || "",
        attendanceDate: item.attendanceDate
            ? item.attendanceDate.substring(0, 10)
            : "",
        status: item.status || "Present"
    });

    setShowForm(true);

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
};

const deleteAttendance = async (id) => {
    const confirmed = window.confirm(
        "Are you sure you want to delete this attendance record?"
    );

    if (!confirmed) return;

    try {
        await API.delete(
            `/attendance/${id}`
        );

        alert("Attendance deleted successfully");

        await loadData();
    } catch (error) {
        console.error(
            "DELETE ATTENDANCE ERROR:",
            error
        );

        alert(
            error.response?.data?.message ||
            "Failed to delete attendance"
        );
    }
};

const filteredAttendance = attendance.filter((item) => {
    const text = search.toLowerCase().trim();

    const studentName = `
        ${item.student?.firstName || ""}
        ${item.student?.lastName || ""}
    `;

    const className = `
        ${item.class?.className || ""}
        ${item.class?.section || ""}
    `;

    const subjectName =
        item.subject?.subjectName || "";

    const teacherName = `
        ${item.teacher?.firstName || ""}
        ${item.teacher?.lastName || ""}
    `;

    const searchable = `
        ${studentName}
        ${className}
        ${subjectName}
        ${teacherName}
        ${item.status || ""}
        ${item.attendanceDate || ""}
    `.toLowerCase();

    return searchable.includes(text);
});

const presentCount = attendance.filter(
    (item) => item.status === "Present"
).length;

const absentCount = attendance.filter(
    (item) => item.status === "Absent"
).length;

const lateCount = attendance.filter(
    (item) => item.status === "Late"
).length;

const getStatusClass = (status) => {
    switch (status) {
        case "Present":
            return "attendance-status-present";

        case "Absent":
            return "attendance-status-absent";

        case "Late":
            return "attendance-status-late";

        case "Excused":
            return "attendance-status-excused";

        default:
            return "attendance-status-default";
    }
};

return (
    <div className="modern-attendance-page">

        {/* PAGE HEADER */}

        <div className="modern-page-header">

            <div>

                <div className="modern-breadcrumb">
                    Dashboard
                    <span>/</span>
                    Attendance
                </div>

                <h1>
                    Attendance
                </h1>

                <p>
                    Track and manage student attendance
                    records across classes and subjects.
                </p>

            </div>

            <button
                className="modern-primary-button"
                onClick={openAddForm}
            >
                <span>+</span>
                Record Attendance
            </button>

        </div>


        {/* STATISTICS */}

        <div className="attendance-stat-grid">

            <div className="attendance-stat-card">

                <div className="attendance-stat-icon blue">
                    ✓
                </div>

                <div>
                    <span>Total Records</span>

                    <strong>
                        {attendance.length}
                    </strong>

                    <small>
                        Attendance records
                    </small>
                </div>

            </div>


            <div className="attendance-stat-card">

                <div className="attendance-stat-icon green">
                    ✓
                </div>

                <div>
                    <span>Present</span>

                    <strong>
                        {presentCount}
                    </strong>

                    <small>
                        Students present
                    </small>
                </div>

            </div>


            <div className="attendance-stat-card">

                <div className="attendance-stat-icon red">
                    !
                </div>

                <div>
                    <span>Absent</span>

                    <strong>
                        {absentCount}
                    </strong>

                    <small>
                        Students absent
                    </small>
                </div>

            </div>


            <div className="attendance-stat-card">

                <div className="attendance-stat-icon orange">
                    ◷
                </div>

                <div>
                    <span>Late</span>

                    <strong>
                        {lateCount}
                    </strong>

                    <small>
                        Late arrivals
                    </small>
                </div>

            </div>

        </div>


        {/* FORM */}

        {showForm && (

            <div className="modern-attendance-form-card">

                <div className="modern-card-header">

                    <div>

                        <h2>
                            {editingId
                                ? "Update Attendance"
                                : "Record Attendance"}
                        </h2>

                        <p>
                            Enter the attendance information
                            below.
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
                    className="modern-attendance-form"
                    onSubmit={saveAttendance}
                >

                    <div className="modern-attendance-form-grid">

                        <div>

                            <label>
                                Student
                            </label>

                            <select
                                name="student"
                                value={form.student}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Student
                                </option>

                                {students.map(
                                    (student) => (

                                        <option
                                            key={student._id}
                                            value={student._id}
                                        >
                                            {student.firstName}{" "}
                                            {student.lastName}
                                        </option>

                                    )
                                )}

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
                                required
                            >

                                <option value="">
                                    Select Class
                                </option>

                                {classes.map(
                                    (item) => (

                                        <option
                                            key={item._id}
                                            value={item._id}
                                        >
                                            {item.className}{" "}
                                            {item.section || ""}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div>

                            <label>
                                Subject
                            </label>

                            <select
                                name="subject"
                                value={form.subject}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Subject
                                </option>

                                {subjects.map(
                                    (subject) => (

                                        <option
                                            key={subject._id}
                                            value={subject._id}
                                        >
                                            {subject.subjectName}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div>

                            <label>
                                Teacher
                            </label>

                            <select
                                name="teacher"
                                value={form.teacher}
                                onChange={handleChange}
                                required
                            >

                                <option value="">
                                    Select Teacher
                                </option>

                                {teachers.map(
                                    (teacher) => (

                                        <option
                                            key={teacher._id}
                                            value={teacher._id}
                                        >
                                            {teacher.firstName}{" "}
                                            {teacher.lastName}
                                        </option>

                                    )
                                )}

                            </select>

                        </div>


                        <div>

                            <label>
                                Attendance Date
                            </label>

                            <input
                                type="date"
                                name="attendanceDate"
                                value={form.attendanceDate}
                                onChange={handleChange}
                                required
                            />

                        </div>


                        <div>

                            <label>
                                Status
                            </label>

                            <select
                                name="status"
                                value={form.status}
                                onChange={handleChange}
                            >

                                <option value="Present">
                                    Present
                                </option>

                                <option value="Absent">
                                    Absent
                                </option>

                                <option value="Late">
                                    Late
                                </option>

                                <option value="Excused">
                                    Excused
                                </option>

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
                                ? "Update Attendance"
                                : "Save Attendance"}
                        </button>

                    </div>

                </form>

            </div>

        )}


        {/* RECORDS */}

        <div className="modern-attendance-card">

            <div className="modern-card-header attendance-record-header">

                <div>

                    <h2>
                        Attendance Records
                    </h2>

                    <p>
                        Search and manage all attendance
                        records.
                    </p>

                </div>

                <div className="attendance-record-total">

                    <strong>
                        {filteredAttendance.length}
                    </strong>

                    <span>
                        Records
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
                        placeholder="Search student, class, subject, teacher or status..."
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
                        Loading attendance...
                    </h3>

                    <p>
                        Please wait while records are
                        being loaded.
                    </p>

                </div>

            ) : filteredAttendance.length === 0 ? (

                <div className="modern-empty-state">

                    <div className="modern-empty-icon">
                        ✓
                    </div>

                    <h3>
                        {search
                            ? "No attendance found"
                            : "No attendance records"}
                    </h3>

                    <p>
                        {search
                            ? "Try another search term."
                            : "Record your first attendance entry to begin."}
                    </p>

                    {!search && (

                        <button
                            className="modern-primary-button"
                            onClick={openAddForm}
                        >
                            + Record Attendance
                        </button>

                    )}

                </div>

            ) : (

                <div className="modern-table-wrapper">

                    <table className="modern-attendance-table">

                        <thead>

                            <tr>

                                <th>
                                    STUDENT
                                </th>

                                <th>
                                    CLASS
                                </th>

                                <th>
                                    SUBJECT
                                </th>

                                <th>
                                    TEACHER
                                </th>

                                <th>
                                    DATE
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

                            {filteredAttendance.map(
                                (item) => (

                                    <tr key={item._id}>

                                        <td>

                                            <div className="modern-attendance-student">

                                                <div className="modern-attendance-avatar">

                                                    {(
                                                        item.student?.firstName?.charAt(0) ||
                                                        "?"
                                                    ).toUpperCase()}

                                                </div>

                                                <div>

                                                    <strong>
                                                        {item.student?.firstName}{" "}
                                                        {item.student?.lastName}
                                                    </strong>

                                                    <small>
                                                        Student
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        <td>

                                            <span className="modern-class-badge">
                                                {item.class?.className || "N/A"}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="attendance-subject">
                                                {item.subject?.subjectName || "N/A"}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="attendance-teacher">
                                                {item.teacher?.firstName}{" "}
                                                {item.teacher?.lastName}
                                            </span>

                                        </td>


                                        <td>

                                            <span className="attendance-date">
                                                {item.attendanceDate
                                                    ? item.attendanceDate.substring(0, 10)
                                                    : "N/A"}
                                            </span>

                                        </td>


                                        <td>

                                            <span
                                                className={`attendance-status ${getStatusClass(
                                                    item.status
                                                )}`}
                                            >
                                                {item.status || "N/A"}
                                            </span>

                                        </td>


                                        <td>

                                            <div className="modern-actions">

                                                <button
                                                    className="modern-edit-button"
                                                    onClick={() =>
                                                        editAttendance(item)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="modern-delete-button"
                                                    onClick={() =>
                                                        deleteAttendance(
                                                            item._id
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

export default Attendance;
