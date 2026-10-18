import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import "../App.css";

function Dashboard() {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [fees, setFees] = useState([]);

    const [loading, setLoading] = useState(true);

    // =====================================================
    // LOAD DASHBOARD DATA
    // =====================================================

    useEffect(() => {
        const loadDashboard = async () => {
            setLoading(true);

            const results = await Promise.allSettled([
                API.get("/students/all"),
                API.get("/teachers/all"),
                API.get("/classes/all"),
                API.get("/fees/all")
            ]);

            const studentsResult = results[0];
            const teachersResult = results[1];
            const classesResult = results[2];
            const feesResult = results[3];

            if (studentsResult.status === "fulfilled") {
                setStudents(
                    studentsResult.value.data?.students || []
                );
            }

            if (teachersResult.status === "fulfilled") {
                setTeachers(
                    teachersResult.value.data?.teachers || []
                );
            }

            if (classesResult.status === "fulfilled") {
                setClasses(
                    classesResult.value.data?.classes || []
                );
            }

            if (feesResult.status === "fulfilled") {
                setFees(
                    feesResult.value.data?.fees || []
                );
            }

            setLoading(false);
        };

        loadDashboard();
    }, []);

    // =====================================================
    // FORMAT MONEY
    // =====================================================

    const formatMoney = (amount) => {
        return new Intl.NumberFormat("en-GH", {
            style: "currency",
            currency: "GHS",
            minimumFractionDigits: 2
        }).format(Number(amount) || 0);
    };

    // =====================================================
    // TOTAL FEE COLLECTION
    // =====================================================

    const totalCollected = useMemo(() => {
        return fees.reduce((total, fee) => {
            return (
                total +
                Number(
                    fee.amountPaid ||
                    fee.paidAmount ||
                    fee.paymentAmount ||
                    0
                )
            );
        }, 0);
    }, [fees]);

    // =====================================================
    // THIS MONTH'S COLLECTION
    // =====================================================

    const monthlyCollection = useMemo(() => {
        const now = new Date();

        return fees.reduce((total, fee) => {
            const dateValue =
                fee.paymentDate ||
                fee.createdAt ||
                fee.updatedAt;

            if (!dateValue) {
                return total;
            }

            const date = new Date(dateValue);

            if (
                date.getMonth() === now.getMonth() &&
                date.getFullYear() === now.getFullYear()
            ) {
                return (
                    total +
                    Number(
                        fee.amountPaid ||
                        fee.paidAmount ||
                        fee.paymentAmount ||
                        0
                    )
                );
            }

            return total;
        }, 0);
    }, [fees]);

    // =====================================================
    // FEE BALANCE
    // =====================================================

    const outstandingBalance = useMemo(() => {
        return fees.reduce((total, fee) => {
            return (
                total +
                Number(
                    fee.balance ||
                    0
                )
            );
        }, 0);
    }, [fees]);

    // =====================================================
    // ATTENDANCE
    // =====================================================

    const attendance = {
        present: 92,
        absent: 6,
        leave: 2
    };

    // =====================================================
    // EXAM RESULTS
    // =====================================================

    const examResults = {
        passed: 78,
        failed: 18,
        pending: 4
    };

    // =====================================================
    // RECENT STUDENTS
    // =====================================================

    const recentStudents = useMemo(() => {
        return [...students]
            .sort((a, b) => {
                const dateA =
                    new Date(a.createdAt || 0).getTime();

                const dateB =
                    new Date(b.createdAt || 0).getTime();

                return dateB - dateA;
            })
            .slice(0, 5);
    }, [students]);

    // =====================================================
    // MONTHLY CHART DATA
    // =====================================================

    const monthlyData = useMemo(() => {
        const now = new Date();

        const months = [];

        for (let i = 5; i >= 0; i--) {
            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );

            const month = date.toLocaleString(
                "en-US",
                {
                    month: "short"
                }
            );

            const value = fees.reduce(
                (total, fee) => {
                    const dateValue =
                        fee.paymentDate ||
                        fee.createdAt ||
                        fee.updatedAt;

                    if (!dateValue) {
                        return total;
                    }

                    const feeDate =
                        new Date(dateValue);

                    if (
                        feeDate.getMonth() ===
                            date.getMonth() &&
                        feeDate.getFullYear() ===
                            date.getFullYear()
                    ) {
                        return (
                            total +
                            Number(
                                fee.amountPaid ||
                                fee.paidAmount ||
                                fee.paymentAmount ||
                                0
                            )
                        );
                    }

                    return total;
                },
                0
            );

            months.push({
                month,
                value
            });
        }

        const maximum =
            Math.max(
                ...months.map(
                    item => item.value
                ),
                1
            );

        return months.map(item => ({
            ...item,
            height:
                Math.max(
                    12,
                    (item.value / maximum) * 100
                )
        }));
    }, [fees]);

    // =====================================================
    // DATE
    // =====================================================

    const today = new Date();

    const formattedDate =
        today.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    // =====================================================
    // INITIALS
    // =====================================================

    const getInitials = (student) => {
        const first =
            student.firstName?.charAt(0) || "";

        const last =
            student.lastName?.charAt(0) || "";

        return (
            first + last
        ).toUpperCase() || "?";
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="modern-dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="dashboard-welcome">

                <div>
                    <h1>
                        Dashboard
                    </h1>

                    <p>
                        Welcome back, Administrator
                    </p>
                </div>

                <div className="dashboard-date">
                    {formattedDate}
                </div>

            </div>


            {/* =================================================
                STATISTICS
            ================================================= */}

            <div className="dashboard-stat-grid">

                {/* STUDENTS */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                        <div className="dashboard-stat-icon blue">
                            👨‍🎓
                        </div>

                        <span>
                            Total Students
                        </span>

                    </div>

                    <strong>
                        {loading
                            ? "..."
                            : students.length.toLocaleString()}
                    </strong>

                    <small className="positive">
                        ↑ 12.5%
                        <span>
                            This Month
                        </span>
                    </small>

                </div>


                {/* STAFF */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                        <div className="dashboard-stat-icon green">
                            👨‍🏫
                        </div>

                        <span>
                            Total Staff
                        </span>

                    </div>

                    <strong>
                        {loading
                            ? "..."
                            : teachers.length.toLocaleString()}
                    </strong>

                    <small className="positive">
                        ↑ 6.3%
                        <span>
                            This Month
                        </span>
                    </small>

                </div>


                {/* FEES */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                        <div className="dashboard-stat-icon orange">
                            ₵
                        </div>

                        <span>
                            Fee Collection
                        </span>

                    </div>

                    <strong className="money-value">
                        {loading
                            ? "..."
                            : formatMoney(monthlyCollection)}
                    </strong>

                    <small className="positive">
                        ↑ 18.7%
                        <span>
                            This Month
                        </span>
                    </small>

                </div>


                {/* CLASSES */}

                <div className="dashboard-stat-card">

                    <div className="dashboard-stat-top">

                        <div className="dashboard-stat-icon purple">
                            🏫
                        </div>

                        <span>
                            Total Classes
                        </span>

                    </div>

                    <strong>
                        {loading
                            ? "..."
                            : classes.length.toLocaleString()}
                    </strong>

                    <small className="positive">
                        ↑ 7.1%
                        <span>
                            This Month
                        </span>
                    </small>

                </div>

            </div>


            {/* =================================================
                MAIN DASHBOARD GRID
            ================================================= */}

            <div className="dashboard-main-grid">


                {/* =================================================
                    ATTENDANCE
                ================================================= */}

                <div className="dashboard-panel attendance-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Attendance Overview
                            </h2>

                            <p>
                                Student attendance summary
                            </p>
                        </div>

                        <button className="dashboard-more-button">
                            This Month ▾
                        </button>

                    </div>


                    <div className="attendance-content">

                        <div
                            className="attendance-donut"
                            style={{
                                "--present": `${attendance.present}%`,
                                "--absent": `${attendance.absent}%`
                            }}
                        >

                            <div className="attendance-donut-inner">

                                <strong>
                                    {attendance.present}%
                                </strong>

                                <span>
                                    Present
                                </span>

                            </div>

                        </div>


                        <div className="attendance-legend">

                            <div>
                                <span className="legend-dot present"></span>

                                <span>
                                    Present
                                </span>

                                <strong>
                                    {attendance.present}%
                                </strong>
                            </div>

                            <div>
                                <span className="legend-dot absent"></span>

                                <span>
                                    Absent
                                </span>

                                <strong>
                                    {attendance.absent}%
                                </strong>
                            </div>

                            <div>
                                <span className="legend-dot leave"></span>

                                <span>
                                    Leave
                                </span>

                                <strong>
                                    {attendance.leave}%
                                </strong>
                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    FEE COLLECTION CHART
                ================================================= */}

                <div className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Fee Collection Overview
                            </h2>

                            <p>
                                Monthly collection performance
                            </p>
                        </div>

                        <button className="dashboard-more-button">
                            Last 6 Months ▾
                        </button>

                    </div>


                    <div className="fee-chart">

                        <div className="fee-chart-y">

                            <span>
                                {formatMoney(
                                    Math.max(
                                        ...monthlyData.map(
                                            item => item.value
                                        ),
                                        1
                                    )
                                )}
                            </span>

                            <span>
                                {formatMoney(
                                    Math.max(
                                        ...monthlyData.map(
                                            item => item.value
                                        ),
                                        1
                                    ) / 2
                                )}
                            </span>

                            <span>
                                ₵0
                            </span>

                        </div>


                        <div className="fee-chart-area">

                            <div className="fee-grid-line line-1"></div>
                            <div className="fee-grid-line line-2"></div>
                            <div className="fee-grid-line line-3"></div>

                            <svg
                                className="fee-line-svg"
                                viewBox="0 0 600 190"
                                preserveAspectRatio="none"
                            >

                                <defs>
                                    <linearGradient
                                        id="feeAreaGradient"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="0%"
                                            stopColor="#4F7CFF"
                                            stopOpacity="0.25"
                                        />

                                        <stop
                                            offset="100%"
                                            stopColor="#4F7CFF"
                                            stopOpacity="0"
                                        />
                                    </linearGradient>
                                </defs>

                                <polygon
                                    points={
                                        monthlyData
                                            .map(
                                                (item, index) => {
                                                    const x =
                                                        monthlyData.length === 1
                                                            ? 300
                                                            : index *
                                                              (600 /
                                                                  (monthlyData.length -
                                                                      1));

                                                    const y =
                                                        180 -
                                                        (item.height *
                                                            1.45);

                                                    return `${x},${y}`;
                                                }
                                            )
                                            .join(" ") +
                                        " 600,190 0,190"
                                    }
                                    fill="url(#feeAreaGradient)"
                                />

                                <polyline
                                    points={monthlyData
                                        .map(
                                            (item, index) => {
                                                const x =
                                                    monthlyData.length === 1
                                                        ? 300
                                                        : index *
                                                          (600 /
                                                              (monthlyData.length -
                                                                  1));

                                                const y =
                                                    180 -
                                                    (item.height *
                                                        1.45);

                                                return `${x},${y}`;
                                            }
                                        )
                                        .join(" ")}
                                    fill="none"
                                    stroke="#4F7CFF"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />

                            </svg>


                            <div className="fee-chart-points">

                                {monthlyData.map(
                                    (item, index) => (
                                        <span
                                            key={
                                                `${item.month}-${index}`
                                            }
                                            style={{
                                                left:
                                                    monthlyData.length ===
                                                    1
                                                        ? "50%"
                                                        : `${(
                                                              index /
                                                              (monthlyData.length -
                                                                  1)
                                                          ) *
                                                          100}%`,
                                                bottom:
                                                    `${Math.min(
                                                        90,
                                                        Math.max(
                                                            7,
                                                            item.height *
                                                                0.83
                                                        )
                                                    )}%`
                                            }}
                                        ></span>
                                    )
                                )}

                            </div>


                            <div className="fee-chart-months">

                                {monthlyData.map(
                                    item => (
                                        <span
                                            key={
                                                item.month
                                            }
                                        >
                                            {item.month}
                                        </span>
                                    )
                                )}

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RECENT STUDENTS
                ================================================= */}

                <div className="dashboard-panel recent-students-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Recent Students
                            </h2>

                            <p>
                                Latest registered students
                            </p>
                        </div>

                        <a
                            href="/students"
                            className="dashboard-view-link"
                        >
                            View All →
                        </a>

                    </div>


                    <div className="recent-students-table">

                        <div className="recent-students-head">

                            <span>
                                STUDENT
                            </span>

                            <span>
                                CLASS
                            </span>

                            <span>
                                STATUS
                            </span>

                        </div>


                        {recentStudents.length === 0 ? (

                            <div className="dashboard-empty">
                                No students registered yet.
                            </div>

                        ) : (

                            recentStudents.map(
                                student => (

                                    <div
                                        className="recent-student-row"
                                        key={
                                            student._id
                                        }
                                    >

                                        <div className="recent-student-name">

                                            <div className="recent-student-avatar">
                                                {getInitials(
                                                    student
                                                )}
                                            </div>

                                            <strong>
                                                {
                                                    student.firstName
                                                }{" "}
                                                {
                                                    student.lastName
                                                }
                                            </strong>

                                        </div>

                                        <span>
                                            {
                                                student.className ||
                                                "N/A"
                                            }
                                        </span>

                                        <span className="active-status">
                                            Active
                                        </span>

                                    </div>

                                )
                            )

                        )}

                    </div>

                </div>


                {/* =================================================
                    EXAM RESULTS
                ================================================= */}

                <div className="dashboard-panel">

                    <div className="dashboard-panel-header">

                        <div>
                            <h2>
                                Exam Results Overview
                            </h2>

                            <p>
                                Overall student performance
                            </p>
                        </div>

                        <button className="dashboard-more-button">
                            This Year ▾
                        </button>

                    </div>


                    <div className="exam-results-content">

                        <div
                            className="exam-donut"
                            style={{
                                "--pass": `${examResults.passed}%`
                            }}
                        >

                            <div className="exam-donut-inner">

                                <strong>
                                    {examResults.passed}%
                                </strong>

                                <span>
                                    Pass Rate
                                </span>

                            </div>

                        </div>


                        <div className="exam-legend">

                            <div>

                                <span className="legend-dot pass"></span>

                                <span>
                                    Passed
                                </span>

                                <strong>
                                    {examResults.passed}%
                                </strong>

                            </div>

                            <div>

                                <span className="legend-dot exam-fail"></span>

                                <span>
                                    Failed
                                </span>

                                <strong>
                                    {examResults.failed}%
                                </strong>

                            </div>

                            <div>

                                <span className="legend-dot pending"></span>

                                <span>
                                    Pending
                                </span>

                                <strong>
                                    {examResults.pending}%
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =================================================
                BOTTOM SUMMARY
            ================================================= */}

            <div className="dashboard-bottom-grid">

                <div className="dashboard-mini-card">

                    <div className="mini-icon blue">
                        ₵
                    </div>

                    <div>
                        <span>
                            Total Collected
                        </span>

                        <strong>
                            {formatMoney(
                                totalCollected
                            )}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-mini-card">

                    <div className="mini-icon orange">
                        !
                    </div>

                    <div>
                        <span>
                            Outstanding Balance
                        </span>

                        <strong>
                            {formatMoney(
                                outstandingBalance
                            )}
                        </strong>
                    </div>

                </div>


                <div className="dashboard-mini-card">

                    <div className="mini-icon purple">
                        ✓
                    </div>

                    <div>
                        <span>
                            Total Fee Records
                        </span>

                        <strong>
                            {fees.length}
                        </strong>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Dashboard;