import { useEffect, useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";
import "../App.css";

function Results() {

    // =====================================================
    // DATA
    // =====================================================

    const [results, setResults] = useState([]);
    const [students, setStudents] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [exams, setExams] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");

    // =====================================================
    // FORM
    // =====================================================

    const [form, setForm] = useState({
        student: "",
        exam: "",
        subject: "",
        marksObtained: "",
        totalMarks: "",
        teacherComment: ""
    });

    // =====================================================
    // LOAD DATA
    // =====================================================

    const loadData = async () => {

        try {

            setLoading(true);

            const [
                resultResponse,
                studentResponse,
                subjectResponse,
                examResponse
            ] = await Promise.all([

                API.get("/results/all"),

                API.get("/students/all"),

                API.get("/subjects/all"),

                API.get("/exams/all")

            ]);

            setResults(
                resultResponse.data?.results || []
            );

            setStudents(
                studentResponse.data?.students || []
            );

            setSubjects(
                subjectResponse.data?.subjects || []
            );

            setExams(
                examResponse.data?.exams || []
            );

        } catch (error) {

            console.error(
                "LOAD RESULTS ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load result data"
            );

        } finally {

            setLoading(false);

        }

    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        loadData();

    }, []);

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));

    };

    // =====================================================
    // SCORE
    // =====================================================

    const marksObtained =
        Number(form.marksObtained) || 0;

    const totalMarks =
        Number(form.totalMarks) || 0;

    // =====================================================
    // PERCENTAGE
    // =====================================================

    const percentage =
        totalMarks > 0
            ? (marksObtained / totalMarks) * 100
            : 0;

    // =====================================================
    // GRADE
    // =====================================================

    const getGrade = (score) => {

        if (score >= 80) return "A";

        if (score >= 70) return "B";

        if (score >= 60) return "C";

        if (score >= 50) return "D";

        if (score >= 40) return "E";

        return "F";

    };

    // =====================================================
    // REMARK
    // =====================================================

    const getRemark = (score) => {

        if (score >= 80) {
            return "Excellent";
        }

        if (score >= 70) {
            return "Very Good";
        }

        if (score >= 60) {
            return "Good";
        }

        if (score >= 50) {
            return "Pass";
        }

        if (score >= 40) {
            return "Weak Pass";
        }

        return "Fail";

    };

    const grade =
        getGrade(percentage);

    const remark =
        getRemark(percentage);

    // =====================================================
    // SAVE RESULT
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!form.student) {

            toast.error(
                "Please select a student"
            );

            return;

        }

        if (!form.exam) {

            toast.error(
                "Please select an examination"
            );

            return;

        }

        if (!form.subject) {

            toast.error(
                "Please select a subject"
            );

            return;

        }

        if (marksObtained < 0) {

            toast.error(
                "Marks obtained cannot be negative"
            );

            return;

        }

        if (totalMarks <= 0) {

            toast.error(
                "Total marks must be greater than 0"
            );

            return;

        }

        if (marksObtained > totalMarks) {

            toast.error(
                "Marks obtained cannot be greater than total marks"
            );

            return;

        }

        try {

            setSaving(true);

            const data = {

                student:
                    form.student,

                exam:
                    form.exam,

                subject:
                    form.subject,

                marksObtained:
                    marksObtained,

                totalMarks:
                    totalMarks,

                teacherComment:
                    form.teacherComment.trim()

            };

            if (editingId) {

                await API.put(
                    `/results/${editingId}`,
                    data
                );

                toast.success(
                    "Result updated successfully"
                );

            } else {

                await API.post(
                    "/results/add",
                    data
                );

                toast.success(
                    "Result added successfully"
                );

            }

            clearForm();

            await loadData();

        } catch (error) {

            console.error(
                "SAVE RESULT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to save result"
            );

        } finally {

            setSaving(false);

        }

    };

    // =====================================================
    // EDIT RESULT
    // =====================================================

    const editResult = (result) => {

        setEditingId(
            result._id
        );

        setForm({

            student:
                result.student?._id ||
                result.student ||
                "",

            exam:
                result.exam?._id ||
                result.exam ||
                "",

            subject:
                result.subject?._id ||
                result.subject ||
                "",

            marksObtained:
                result.marksObtained ??
                "",

            totalMarks:
                result.totalMarks ??
                "",

            teacherComment:
                result.teacherComment ||
                ""

        });

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    };

    // =====================================================
    // DELETE RESULT
    // =====================================================

    const deleteResult = async (id) => {

        const confirmed =
            window.confirm(
                "Delete this result?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await API.delete(
                `/results/${id}`
            );

            toast.success(
                "Result deleted successfully"
            );

            await loadData();

        } catch (error) {

            console.error(
                "DELETE RESULT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete result"
            );

        }

    };

    // =====================================================
    // CLEAR FORM
    // =====================================================

    const clearForm = () => {

        setEditingId(null);

        setForm({

            student: "",
            exam: "",
            subject: "",
            marksObtained: "",
            totalMarks: "",
            teacherComment: ""

        });

    };

    // =====================================================
    // SEARCH
    // =====================================================

    const filteredResults =
        results.filter(result => {

            const student =
                result.student || {};

            const subject =
                result.subject || {};

            const exam =
                result.exam || {};

            const studentName =
                `${student.firstName || ""} ${student.lastName || ""}`;

            const subjectName =
                subject.subjectName || "";

            const examName =
                exam.examName || "";

            const query =
                search.toLowerCase();

            return (

                studentName
                    .toLowerCase()
                    .includes(query)

                ||

                subjectName
                    .toLowerCase()
                    .includes(query)

                ||

                examName
                    .toLowerCase()
                    .includes(query)

            );

        });

    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="results-page">

            {/* =================================================
                HERO
            ================================================= */}

            <div className="results-hero">

                <div>

                    <span className="results-badge">
                        ACADEMIC PERFORMANCE
                    </span>

                    <h1>
                        Result Management
                    </h1>

                    <p>
                        Record and manage student
                        examination results.
                    </p>

                </div>

                <div className="results-hero-icon">
                    ✓
                </div>

            </div>

            {/* =================================================
                FORM CARD
            ================================================= */}

            <div className="results-form-card">

                <div className="results-card-header">

                    <div>

                        <span>
                            {editingId
                                ? "UPDATE RESULT"
                                : "NEW RESULT"}
                        </span>

                        <h2>
                            {editingId
                                ? "Update Student Result"
                                : "Enter Student Result"}
                        </h2>

                        <p>
                            Enter the student's marks
                            and teacher comment.
                        </p>

                    </div>

                </div>

                <form
                    className="results-form"
                    onSubmit={handleSubmit}
                >

                    {/* STUDENT */}

                    <div className="results-input-group">

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
                                student => (

                                    <option
                                        key={student._id}
                                        value={student._id}
                                    >

                                        {student.firstName}{" "}
                                        {student.lastName}

                                        {" — "}

                                        {
                                            student.admissionNumber ||
                                            "No admission number"
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* EXAM */}

                    <div className="results-input-group">

                        <label>
                            Examination
                        </label>

                        <select
                            name="exam"
                            value={form.exam}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Exam
                            </option>

                            {exams.map(
                                exam => (

                                    <option
                                        key={exam._id}
                                        value={exam._id}
                                    >

                                        {exam.examName}

                                        {" — "}

                                        {exam.term}

                                        {" — "}

                                        {exam.academicYear}

                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* SUBJECT */}

                    <div className="results-input-group">

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
                                subject => (

                                    <option
                                        key={subject._id}
                                        value={subject._id}
                                    >

                                        {subject.subjectName}

                                        {" — "}

                                        {subject.subjectCode}

                                    </option>

                                )
                            )}

                        </select>

                    </div>

                    {/* MARKS OBTAINED */}

                    <div className="results-input-group">

                        <label>
                            Marks Obtained
                        </label>

                        <input
                            type="number"
                            name="marksObtained"
                            value={
                                form.marksObtained
                            }
                            onChange={
                                handleChange
                            }
                            min="0"
                            step="0.01"
                            placeholder="Enter marks"
                            required
                        />

                    </div>

                    {/* TOTAL MARKS */}

                    <div className="results-input-group">

                        <label>
                            Total Marks
                        </label>

                        <input
                            type="number"
                            name="totalMarks"
                            value={
                                form.totalMarks
                            }
                            onChange={
                                handleChange
                            }
                            min="1"
                            step="0.01"
                            placeholder="Example: 100"
                            required
                        />

                    </div>

                    {/* COMMENT */}

                    <div className="results-input-group results-full">

                        <label>
                            Teacher Comment
                        </label>

                        <textarea
                            name="teacherComment"
                            value={
                                form.teacherComment
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter teacher comment..."
                            rows="4"
                        />

                    </div>

                    {/* =================================================
                        LIVE SUMMARY
                    ================================================= */}

                    <div className="results-calculation">

                        <div>

                            <span>
                                MARKS
                            </span>

                            <strong>
                                {marksObtained}
                                {" / "}
                                {totalMarks || 0}
                            </strong>

                        </div>

                        <div>

                            <span>
                                PERCENTAGE
                            </span>

                            <strong>
                                {percentage.toFixed(1)}%
                            </strong>

                        </div>

                        <div>

                            <span>
                                GRADE
                            </span>

                            <strong>
                                {totalMarks > 0
                                    ? grade
                                    : "-"}
                            </strong>

                        </div>

                        <div>

                            <span>
                                REMARK
                            </span>

                            <strong>
                                {totalMarks > 0
                                    ? remark
                                    : "-"}
                            </strong>

                        </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="results-form-actions">

                        <button
                            type="submit"
                            className="results-save-button"
                            disabled={saving}
                        >

                            {saving
                                ? "Saving..."
                                : editingId
                                ? "Update Result"
                                : "Save Result"}

                        </button>

                        {editingId && (

                            <button
                                type="button"
                                className="results-cancel-button"
                                onClick={
                                    clearForm
                                }
                                disabled={saving}
                            >

                                Cancel

                            </button>

                        )}

                    </div>

                </form>

            </div>

            {/* =================================================
                RESULTS TABLE
            ================================================= */}

            <div className="results-records-card">

                <div className="results-records-header">

                    <div>

                        <span>
                            ACADEMIC RECORDS
                        </span>

                        <h2>
                            Student Results
                        </h2>

                        <p>
                            View and manage recorded
                            examination results.
                        </p>

                    </div>

                    <div className="results-count">

                        {results.length}

                    </div>

                </div>

                {/* SEARCH */}

                <div className="results-search">

                    <input
                        type="text"
                        placeholder="Search student, subject or exam..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

                {loading ? (

                    <div className="results-loading">

                        <div className="results-spinner"></div>

                        <p>
                            Loading results...
                        </p>

                    </div>

                ) : filteredResults.length === 0 ? (

                    <div className="results-empty">

                        <div className="results-empty-icon">
                            ✓
                        </div>

                        <h3>
                            No results found
                        </h3>

                        <p>
                            Add a student result
                            using the form above.
                        </p>

                    </div>

                ) : (

                    <div className="results-table-wrapper">

                        <table className="results-table">

                            <thead>

                                <tr>

                                    <th>
                                        STUDENT
                                    </th>

                                    <th>
                                        EXAM
                                    </th>

                                    <th>
                                        SUBJECT
                                    </th>

                                    <th>
                                        MARKS
                                    </th>

                                    <th>
                                        PERCENTAGE
                                    </th>

                                    <th>
                                        GRADE
                                    </th>

                                    <th>
                                        COMMENT
                                    </th>

                                    <th>
                                        ACTIONS
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredResults.map(
                                    result => {

                                        const student =
                                            result.student ||
                                            {};

                                        const subject =
                                            result.subject ||
                                            {};

                                        const exam =
                                            result.exam ||
                                            {};

                                        const marks =
                                            Number(
                                                result.marksObtained ||
                                                0
                                            );

                                        const maximum =
                                            Number(
                                                result.totalMarks ||
                                                0
                                            );

                                        const resultPercentage =
                                            maximum > 0
                                                ? (
                                                    marks /
                                                    maximum
                                                ) * 100
                                                : 0;

                                        const resultGrade =
                                            getGrade(
                                                resultPercentage
                                            );

                                        return (

                                            <tr
                                                key={
                                                    result._id
                                                }
                                            >

                                                {/* STUDENT */}

                                                <td>

                                                    <div className="result-student">

                                                        <div className="result-avatar">

                                                            {
                                                                student.firstName?.charAt(0) ||
                                                                "?"
                                                            }

                                                            {
                                                                student.lastName?.charAt(0) ||
                                                                ""
                                                            }

                                                        </div>

                                                        <div>

                                                            <strong>

                                                                {
                                                                    student.firstName ||
                                                                    ""
                                                                }

                                                                {" "}

                                                                {
                                                                    student.lastName ||
                                                                    ""
                                                                }

                                                            </strong>

                                                            <small>

                                                                {
                                                                    student.admissionNumber ||
                                                                    "No admission number"
                                                                }

                                                            </small>

                                                        </div>

                                                    </div>

                                                </td>

                                                {/* EXAM */}

                                                <td>

                                                    <strong>
                                                        {
                                                            exam.examName ||
                                                            "Unknown Exam"
                                                        }
                                                    </strong>

                                                    <small>

                                                        {
                                                            exam.term ||
                                                            ""
                                                        }

                                                    </small>

                                                </td>

                                                {/* SUBJECT */}

                                                <td>

                                                    {
                                                        subject.subjectName ||
                                                        "Unknown Subject"
                                                    }

                                                </td>

                                                {/* MARKS */}

                                                <td>

                                                    <strong>
                                                        {marks}
                                                    </strong>

                                                    {" / "}

                                                    {
                                                        maximum
                                                    }

                                                </td>

                                                {/* PERCENTAGE */}

                                                <td>

                                                    {
                                                        resultPercentage.toFixed(
                                                            1
                                                        )
                                                    }%

                                                </td>

                                                {/* GRADE */}

                                                <td>

                                                    <span
                                                        className={
                                                            `result-grade grade-${resultGrade}`
                                                        }
                                                    >

                                                        {
                                                            resultGrade
                                                        }

                                                    </span>

                                                </td>

                                                {/* COMMENT */}

                                                <td>

                                                    {
                                                        result.teacherComment ||
                                                        "No comment"
                                                    }

                                                </td>

                                                {/* ACTIONS */}

                                                <td>

                                                    <div className="results-actions">

                                                        <button
                                                            type="button"
                                                            className="results-edit"
                                                            onClick={() =>
                                                                editResult(
                                                                    result
                                                                )
                                                            }
                                                        >

                                                            Edit

                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="results-delete"
                                                            onClick={() =>
                                                                deleteResult(
                                                                    result._id
                                                                )
                                                            }
                                                        >

                                                            Delete

                                                        </button>

                                                    </div>

                                                </td>

                                            </tr>

                                        );

                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>

    );

}

export default Results;