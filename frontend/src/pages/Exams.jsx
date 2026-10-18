import { useState } from "react";
import "../App.css";

function Exams() {

    const [search, setSearch] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [exams, setExams] = useState([
        {
            id: 1,
            name: "End of Term Examination",
            term: "First Term",
            year: "2026/2027",
            startDate: "2026-10-12",
            endDate: "2026-10-23",
            status: "Upcoming"
        },
        {
            id: 2,
            name: "Mid-Term Examination",
            term: "First Term",
            year: "2026/2027",
            startDate: "2026-09-21",
            endDate: "2026-09-25",
            status: "Upcoming"
        }
    ]);

    const [form, setForm] = useState({
        examName: "",
        term: "First Term",
        academicYear: "",
        startDate: "",
        endDate: ""
    });

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };

    const createExam = (e) => {

        e.preventDefault();

        if (
            !form.examName ||
            !form.academicYear ||
            !form.startDate ||
            !form.endDate
        ) {
            return;
        }

        const newExam = {

            id: Date.now(),

            name: form.examName,

            term: form.term,

            year: form.academicYear,

            startDate: form.startDate,

            endDate: form.endDate,

            status: "Upcoming"

        };

        setExams([
            newExam,
            ...exams
        ]);

        setForm({
            examName: "",
            term: "First Term",
            academicYear: "",
            startDate: "",
            endDate: ""
        });

        setShowForm(false);

    };

    const deleteExam = (id) => {

        if (
            window.confirm(
                "Delete this examination?"
            )
        ) {

            setExams(
                exams.filter(
                    exam => exam.id !== id
                )
            );

        }

    };

    const filteredExams =
        exams.filter(
            exam =>
                exam.name
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    ) ||
                exam.term
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
        );

    return (

        <div className="exam-page">

            {/* =========================================
                HERO
            ========================================= */}

            <div className="exam-hero">

                <div className="exam-hero-content">

                    <div className="exam-icon">
                        📝
                    </div>

                    <div>

                        <span className="exam-label">
                            ACADEMIC MANAGEMENT
                        </span>

                        <h1>
                            Exams Management
                        </h1>

                        <p>
                            Create and manage school
                            examinations, schedules
                            and academic assessments.
                        </p>

                    </div>

                </div>

                <button
                    className="exam-create-button"
                    onClick={() =>
                        setShowForm(!showForm)
                    }
                >
                    <span>+</span>
                    Create Exam
                </button>

            </div>


            {/* =========================================
                STATISTICS
            ========================================= */}

            <div className="exam-stats">

                <div className="exam-stat-card">

                    <div className="exam-stat-icon blue">
                        📝
                    </div>

                    <div>

                        <span>
                            Total Exams
                        </span>

                        <strong>
                            {exams.length}
                        </strong>

                    </div>

                </div>


                <div className="exam-stat-card">

                    <div className="exam-stat-icon green">
                        ✓
                    </div>

                    <div>

                        <span>
                            Completed
                        </span>

                        <strong>
                            0
                        </strong>

                    </div>

                </div>


                <div className="exam-stat-card">

                    <div className="exam-stat-icon orange">
                        ⏳
                    </div>

                    <div>

                        <span>
                            Upcoming
                        </span>

                        <strong>
                            {exams.length}
                        </strong>

                    </div>

                </div>


                <div className="exam-stat-card">

                    <div className="exam-stat-icon purple">
                        📅
                    </div>

                    <div>

                        <span>
                            Academic Year
                        </span>

                        <strong>
                            2026/27
                        </strong>

                    </div>

                </div>

            </div>


            {/* =========================================
                CREATE EXAM FORM
            ========================================= */}

            {showForm && (

                <div className="exam-form-card">

                    <div className="exam-card-header">

                        <div>

                            <span className="exam-small-label">
                                NEW EXAMINATION
                            </span>

                            <h2>
                                Create New Exam
                            </h2>

                            <p>
                                Enter the examination
                                information below.
                            </p>

                        </div>

                        <div className="exam-header-symbol">
                            +
                        </div>

                    </div>


                    <form
                        className="exam-form"
                        onSubmit={createExam}
                    >

                        <div className="exam-form-grid">


                            <div className="exam-input full">

                                <label>
                                    Exam Name
                                </label>

                                <input
                                    type="text"
                                    name="examName"
                                    placeholder="e.g. End of Term Examination"
                                    value={
                                        form.examName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="exam-input">

                                <label>
                                    Academic Year
                                </label>

                                <input
                                    type="text"
                                    name="academicYear"
                                    placeholder="2026/2027"
                                    value={
                                        form.academicYear
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="exam-input">

                                <label>
                                    Term
                                </label>

                                <select
                                    name="term"
                                    value={
                                        form.term
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


                            <div className="exam-input">

                                <label>
                                    Start Date
                                </label>

                                <input
                                    type="date"
                                    name="startDate"
                                    value={
                                        form.startDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>


                            <div className="exam-input">

                                <label>
                                    End Date
                                </label>

                                <input
                                    type="date"
                                    name="endDate"
                                    value={
                                        form.endDate
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    required
                                />

                            </div>

                        </div>


                        <div className="exam-form-actions">

                            <button
                                type="submit"
                                className="exam-save-button"
                            >
                                Create Examination
                            </button>

                            <button
                                type="button"
                                className="exam-cancel-button"
                                onClick={() =>
                                    setShowForm(false)
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =========================================
                EXAM RECORDS
            ========================================= */}

            <div className="exam-records-card">

                <div className="exam-record-header">

                    <div>

                        <span className="exam-small-label">
                            EXAMINATION RECORDS
                        </span>

                        <h2>
                            School Examinations
                        </h2>

                        <p>
                            View and manage all
                            scheduled examinations.
                        </p>

                    </div>

                    <div className="exam-record-count">

                        <strong>
                            {exams.length}
                        </strong>

                        <span>
                            Exams
                        </span>

                    </div>

                </div>


                {/* SEARCH */}

                <div className="exam-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search examinations..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>


                {/* TABLE */}

                <div className="exam-table-wrapper">

                    <table className="exam-table">

                        <thead>

                            <tr>

                                <th>
                                    EXAMINATION
                                </th>

                                <th>
                                    TERM
                                </th>

                                <th>
                                    ACADEMIC YEAR
                                </th>

                                <th>
                                    START DATE
                                </th>

                                <th>
                                    END DATE
                                </th>

                                <th>
                                    STATUS
                                </th>

                                <th>
                                    ACTIONS
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {filteredExams.map(
                                exam => (

                                    <tr
                                        key={
                                            exam.id
                                        }
                                    >

                                        <td>

                                            <div className="exam-name-cell">

                                                <div className="exam-row-icon">
                                                    📝
                                                </div>

                                                <div>

                                                    <strong>
                                                        {
                                                            exam.name
                                                        }
                                                    </strong>

                                                    <small>
                                                        Examination
                                                    </small>

                                                </div>

                                            </div>

                                        </td>


                                        <td>

                                            <span className="exam-term">
                                                {
                                                    exam.term
                                                }
                                            </span>

                                        </td>


                                        <td>
                                            {
                                                exam.year
                                            }
                                        </td>


                                        <td>
                                            {
                                                exam.startDate
                                            }
                                        </td>


                                        <td>
                                            {
                                                exam.endDate
                                            }
                                        </td>


                                        <td>

                                            <span className="exam-status upcoming">
                                                ● Upcoming
                                            </span>

                                        </td>


                                        <td>

                                            <div className="exam-actions">

                                                <button
                                                    className="exam-view"
                                                >
                                                    View
                                                </button>

                                                <button
                                                    className="exam-edit"
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="exam-delete"
                                                    onClick={() =>
                                                        deleteExam(
                                                            exam.id
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

            </div>

        </div>

    );

}

export default Exams;

