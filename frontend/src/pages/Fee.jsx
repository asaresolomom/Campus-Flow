import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import "../App.css";
import "./Fee.css";
import Receipt from "../components/Receipt";


function Fee() {
    const navigate = useNavigate();

    // =====================================================
    // SCHOOL INFORMATION
    // Change these to your actual school details
    // =====================================================

    const SCHOOL_NAME = "UENR";
    const SCHOOL_ADDRESS = "SUNYANI-GHANA";
    const SCHOOL_PHONE = "0541737072";

    // =====================================================
    // FEE STATE
    // =====================================================

    const [students, setStudents] = useState([]);
    const [fees, setFees] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [editingId, setEditingId] = useState(null);

    // =====================================================
    // PAYMENT STATE
    // =====================================================

    const [paymentFee, setPaymentFee] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("Cash");
    const [paymentSaving, setPaymentSaving] = useState(false);

    // =====================================================
    // RECEIPT STATE
    // =====================================================

    const [receipt, setReceipt] = useState(null);

    // =====================================================
    // FEE FORM
    // =====================================================

    const [form, setForm] = useState({
        student: "",
        academicYear: "",
        term: "First Term",
        tuitionFee: "",
        otherFees: "",
        amountPaid: ""
    });

    // =====================================================
    // LOAD STUDENTS
    // =====================================================

    const loadStudents = async () => {
        try {
            const response = await API.get("/students/all");

            setStudents(
                response.data?.students || []
            );
        } catch (error) {
            console.error("LOAD STUDENTS ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load students"
            );
        }
    };

    // =====================================================
    // LOAD FEES
    // =====================================================

    const loadFees = async () => {
        try {
            setLoading(true);

            const response = await API.get("/fees/all");

            setFees(
                response.data?.fees || []
            );
        } catch (error) {
            console.error("LOAD FEES ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load fees"
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        loadStudents();
        loadFees();
    }, []);

    // =====================================================
    // FORM HANDLER
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm(previous => ({
            ...previous,
            [name]: value
        }));
    };

    // =====================================================
    // FEE CALCULATIONS
    // =====================================================

    const tuition =
        Number(form.tuitionFee) || 0;

    const otherFees =
        Number(form.otherFees) || 0;

    const amountPaid =
        Number(form.amountPaid) || 0;

    const totalFee =
        tuition + otherFees;

    const balance =
        Math.max(
            totalFee - amountPaid,
            0
        );

    let status = "Unpaid";

    if (
        totalFee > 0 &&
        amountPaid >= totalFee
    ) {
        status = "Paid";
    } else if (
        amountPaid > 0
    ) {
        status = "Partial";
    }

    // =====================================================
    // MONEY FORMAT
    // =====================================================

    const money = (amount) => {
        return `GHS ${Number(
            amount || 0
        ).toLocaleString(
            "en-GH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };

    // =====================================================
    // STATUS CLASS
    // =====================================================

    const getStatusClass = (value) => {
        if (value === "Paid") {
            return "status paid";
        }

        if (value === "Partial") {
            return "status partial";
        }

        return "status unpaid";
    };

    // =====================================================
    // GENERATE RECEIPT NUMBER
    // =====================================================

    const generateReceiptNumber = () => {
        const date = new Date();

        const year =
            date.getFullYear();

        const month =
            String(
                date.getMonth() + 1
            ).padStart(2, "0");

        const day =
            String(
                date.getDate()
            ).padStart(2, "0");

        const random =
            Math.floor(
                100000 +
                Math.random() * 900000
            );

        return `RCP-${year}${month}${day}-${random}`;
    };

    // =====================================================
    // SAVE FEE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.student) {
            toast.error(
                "Please select a student"
            );
            return;
        }

        if (!form.academicYear.trim()) {
            toast.error(
                "Please enter academic year"
            );
            return;
        }

        if (tuition <= 0) {
            toast.error(
                "Please enter the tuition fee"
            );
            return;
        }

        if (amountPaid > totalFee) {
            toast.error(
                "Amount paid cannot be greater than total fee"
            );
            return;
        }

        try {
            setSaving(true);

            const data = {
                student: form.student,
                academicYear:
                    form.academicYear.trim(),
                term: form.term,
                tuitionFee: tuition,
                otherFees: otherFees,
                amountPaid: amountPaid
            };

            if (editingId) {
                await API.put(
                    `/fees/${editingId}`,
                    data
                );

                toast.success(
                    "Fee updated successfully"
                );
            } else {
                await API.post(
                    "/fees/add",
                    data
                );

                toast.success(
                    "Fee created successfully"
                );
            }

            clearForm();

            await loadFees();

        } catch (error) {
            console.error(
                "SAVE FEE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to save fee"
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // EDIT FEE
    // =====================================================

    const editFee = (fee) => {
        setEditingId(
            fee._id
        );

        setForm({
            student:
                fee.student?._id ||
                fee.student ||
                "",

            academicYear:
                fee.academicYear ||
                "",

            term:
                fee.term ||
                "First Term",

            tuitionFee:
                fee.tuitionFee ?? "",

            otherFees:
                fee.otherFees ?? "",

            amountPaid:
                fee.amountPaid ?? ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =====================================================
    // DELETE FEE
    // =====================================================

    const deleteFee = async (id) => {
        const confirmed =
            window.confirm(
                "Delete this fee record?"
            );

        if (!confirmed) {
            return;
        }

        try {
            await API.delete(
                `/fees/${id}`
            );

            toast.success(
                "Fee deleted successfully"
            );

            await loadFees();

        } catch (error) {
            console.error(
                "DELETE FEE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to delete fee"
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
            academicYear: "",
            term: "First Term",
            tuitionFee: "",
            otherFees: "",
            amountPaid: ""
        });
    };

    // =====================================================
    // OPEN PAYMENT FORM
    // =====================================================

    const recordPayment = (fee) => {
        const feeBalance =
            Number(
                fee.balance ??
                (
                    Number(
                        fee.totalFee || 0
                    ) -
                    Number(
                        fee.amountPaid || 0
                    )
                )
            );

        if (feeBalance <= 0) {
            toast.error(
                "This fee is already fully paid"
            );

            return;
        }

        setPaymentFee(fee);
        setPaymentAmount("");
        setPaymentMethod("Cash");
    };

    // =====================================================
    // CLOSE PAYMENT FORM
    // =====================================================

    const closePayment = () => {
        if (paymentSaving) {
            return;
        }

        setPaymentFee(null);
        setPaymentAmount("");
        setPaymentMethod("Cash");
    };

    // =====================================================
    // SAVE PAYMENT + GENERATE RECEIPT
    // =====================================================

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();

        if (!paymentFee) {
            return;
        }

        const amount =
            Number(paymentAmount);

        const outstanding =
            Number(
                paymentFee.balance ??
                (
                    Number(
                        paymentFee.totalFee || 0
                    ) -
                    Number(
                        paymentFee.amountPaid || 0
                    )
                )
            );

        if (!amount || amount <= 0) {
            toast.error(
                "Enter a valid payment amount"
            );

            return;
        }

        if (amount > outstanding) {
            toast.error(
                `Payment cannot be greater than ${money(outstanding)}`
            );

            return;
        }

        if (!paymentMethod.trim()) {
            toast.error(
                "Please enter a payment method"
            );

            return;
        }

        try {
            setPaymentSaving(true);

            const response =
                await API.post(
                    "/payments/add",
                    {
                        student:
                            paymentFee.student?._id ||
                            paymentFee.student,

                        fee:
                            paymentFee._id,

                        amountPaid:
                            amount,

                        paymentMethod:
                            paymentMethod.trim()
                    }
                );

            // =================================================
            // PAYMENT RESPONSE
            // =================================================

            const savedPayment =
                response.data?.payment ||
                response.data?.data ||
                {};

            // =================================================
            // CALCULATE NEW BALANCE
            // =================================================

            const previousPaid =
                Number(
                    paymentFee.amountPaid ||
                    0
                );

            const newPaid =
                previousPaid + amount;

            const feeTotal =
                Number(
                    paymentFee.totalFee ||
                    (
                        Number(
                            paymentFee.tuitionFee ||
                            0
                        ) +
                        Number(
                            paymentFee.otherFees ||
                            0
                        )
                    )
                );

            const newBalance =
                Math.max(
                    feeTotal - newPaid,
                    0
                );

            let newStatus = "Partial";

            if (newBalance <= 0) {
                newStatus = "Paid";
            }

            // =================================================
            // RECEIPT NUMBER
            // =================================================

            const receiptNumber =
                savedPayment.receiptNumber ||
                response.data?.receiptNumber ||
                generateReceiptNumber();

            // =================================================
            // GET STUDENT
            // =================================================

            const student =
                paymentFee.student ||
                students.find(
                    item =>
                        item._id ===
                        paymentFee.student
                ) ||
                {};

            // =================================================
            // CREATE RECEIPT OBJECT
            // =================================================

            const receiptData = {
                receiptNumber,

                date:
                    savedPayment.createdAt ||
                    new Date().toISOString(),

                school: {
                    name: SCHOOL_NAME,
                    address: SCHOOL_ADDRESS,
                    phone: SCHOOL_PHONE
                },

                student: {
                    firstName:
                        student.firstName ||
                        "",

                    lastName:
                        student.lastName ||
                        "",

                    admissionNumber:
                        student.admissionNumber ||
                        "",

                    className:
                        student.className ||
                        student.class ||
                        student.level ||
                        ""
                },

                academicYear:
                    paymentFee.academicYear ||
                    "",

                term:
                    paymentFee.term ||
                    "",

                totalFee:
                    feeTotal,

                previousPaid:
                    previousPaid,

                currentPayment:
                    amount,

                totalPaid:
                    newPaid,

                balance:
                    newBalance,

                paymentMethod:
                    paymentMethod.trim(),

                status:
                    newStatus
            };

            closePayment();

            await loadFees();

            setReceipt(
                receiptData
            );

            toast.success(
                "Payment recorded successfully"
            );

        } catch (error) {
            console.error(
                "RECORD PAYMENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to record payment"
            );
        } finally {
            setPaymentSaving(false);
        }
    };

    // =====================================================
    // PRINT RECEIPT
    // =====================================================

    const printReceipt = () => {
        window.print();
    };

    // =====================================================
    // CLOSE RECEIPT
    // =====================================================

    const closeReceipt = () => {
        setReceipt(null);
    };

    // =====================================================
    // TOTALS
    // =====================================================

    const totalFees = fees.reduce(
        (sum, fee) =>
            sum +
            Number(
                fee.totalFee ||
                (
                    Number(
                        fee.tuitionFee ||
                        0
                    ) +
                    Number(
                        fee.otherFees ||
                        0
                    )
                )
            ),
        0
    );

    const totalPaid = fees.reduce(
        (sum, fee) =>
            sum +
            Number(
                fee.amountPaid ||
                0
            ),
        0
    );

    const totalBalance = fees.reduce(
        (sum, fee) =>
            sum +
            Number(
                fee.balance ||
                0
            ),
        0
    );

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="fee-page">

            {/* =================================================
                HERO HEADER
            ================================================= */}

            <div className="fee-hero">

                <div className="fee-hero-left">

                    <div className="fee-hero-icon">
                        ₵
                    </div>

                    <div>

                        <span className="fee-page-badge">
                            SCHOOL FINANCE
                        </span>

                        <h1>
                            Fee Management
                        </h1>

                        <p>
                            Manage fees, payments,
                            balances and receipts
                            from one place.
                        </p>

                    </div>

                </div>

                <button
                    type="button"
                    className="fee-finance-button"
                    onClick={() =>
                        navigate("/finance")
                    }
                >
                    <span>↗</span>
                    Finance Dashboard
                </button>

            </div>

            {/* =================================================
                MINI STATISTICS
            ================================================= */}

            <div className="fee-mini-stats">

                <div className="fee-mini-card">

                    <div className="fee-mini-icon blue">
                        ₵
                    </div>

                    <div>
                        <span>Total Fees</span>

                        <strong>
                            {money(totalFees)}
                        </strong>
                    </div>

                </div>

                <div className="fee-mini-card">

                    <div className="fee-mini-icon green">
                        ✓
                    </div>

                    <div>
                        <span>Total Collected</span>

                        <strong>
                            {money(totalPaid)}
                        </strong>
                    </div>

                </div>

                <div className="fee-mini-card">

                    <div className="fee-mini-icon orange">
                        !
                    </div>

                    <div>
                        <span>Outstanding</span>

                        <strong>
                            {money(totalBalance)}
                        </strong>
                    </div>

                </div>

                <div className="fee-mini-card">

                    <div className="fee-mini-icon purple">
                        #
                    </div>

                    <div>
                        <span>Fee Records</span>

                        <strong>
                            {fees.length}
                        </strong>
                    </div>

                </div>

            </div>

            {/* =================================================
                FEE FORM
            ================================================= */}

            <div className="fee-form-card">

                <div className="fee-card-header">

                    <div>

                        <span className="fee-small-label">
                            {editingId
                                ? "UPDATE RECORD"
                                : "NEW RECORD"}
                        </span>

                        <h2>
                            {editingId
                                ? "Update Student Fee"
                                : "Create Student Fee"}
                        </h2>

                        <p>
                            Enter the student's
                            fee information below.
                        </p>

                    </div>

                    <div className="fee-header-decoration">
                        {editingId ? "✎" : "+"}
                    </div>

                </div>

                <form
                    className="fee-form"
                    onSubmit={handleSubmit}
                >

                    <div className="fee-form-grid">

                        {/* STUDENT */}

                        <div className="fee-input-group full">

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
                                            key={
                                                student._id
                                            }
                                            value={
                                                student._id
                                            }
                                        >
                                            {student.firstName}{" "}
                                            {student.lastName}
                                            {" — "}
                                            {
                                                student.admissionNumber
                                            }
                                        </option>

                                    )
                                )}

                            </select>

                        </div>

                        {/* ACADEMIC YEAR */}

                        <div className="fee-input-group">

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

                        {/* TERM */}

                        <div className="fee-input-group">

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
                                required
                            >

                                <option value="First Term">
                                    First Term
                                </option>

                                <option value="Second Term">
                                    Second Term
                                </option>

                                <option value="Third Term">
                                    Third Term
                                </option>

                            </select>

                        </div>

                        {/* TUITION */}

                        <div className="fee-input-group">

                            <label>
                                Tuition Fee
                            </label>

                            <div className="fee-money-input">

                                <span>
                                    GHS
                                </span>

                                <input
                                    type="number"
                                    name="tuitionFee"
                                    placeholder="0.00"
                                    value={
                                        form.tuitionFee
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    required
                                />

                            </div>

                        </div>

                        {/* OTHER FEES */}

                        <div className="fee-input-group">

                            <label>
                                Other Fees
                            </label>

                            <div className="fee-money-input">

                                <span>
                                    GHS
                                </span>

                                <input
                                    type="number"
                                    name="otherFees"
                                    placeholder="0.00"
                                    value={
                                        form.otherFees
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                        </div>

                        {/* INITIAL PAYMENT */}

                        <div className="fee-input-group">

                            <label>
                                Initial Amount Paid
                            </label>

                            <div className="fee-money-input">

                                <span>
                                    GHS
                                </span>

                                <input
                                    type="number"
                                    name="amountPaid"
                                    placeholder="0.00"
                                    value={
                                        form.amountPaid
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                />

                            </div>

                            <small>
                                Additional payments can
                                be recorded later.
                            </small>

                        </div>

                    </div>

                    {/* =================================================
                        CALCULATION
                    ================================================= */}

                    <div className="fee-calculation">

                        <div className="fee-calculation-header">

                            <div>

                                <span>
                                    FEE SUMMARY
                                </span>

                                <h3>
                                    Automatic Calculation
                                </h3>

                            </div>

                            <span
                                className={
                                    getStatusClass(
                                        status
                                    )
                                }
                            >
                                ● {status}
                            </span>

                        </div>

                        <div className="fee-summary-grid">

                            <div className="fee-summary-item">

                                <span>
                                    Tuition
                                </span>

                                <strong>
                                    {money(tuition)}
                                </strong>

                            </div>

                            <div className="fee-summary-item">

                                <span>
                                    Other Fees
                                </span>

                                <strong>
                                    {money(otherFees)}
                                </strong>

                            </div>

                            <div className="fee-summary-item highlight">

                                <span>
                                    Total Fee
                                </span>

                                <strong>
                                    {money(totalFee)}
                                </strong>

                            </div>

                            <div className="fee-summary-item success">

                                <span>
                                    Amount Paid
                                </span>

                                <strong>
                                    {money(amountPaid)}
                                </strong>

                            </div>

                            <div className="fee-summary-item danger">

                                <span>
                                    Balance
                                </span>

                                <strong>
                                    {money(balance)}
                                </strong>

                            </div>

                        </div>

                    </div>

                    {/* BUTTONS */}

                    <div className="fee-form-actions">

                        <button
                            type="submit"
                            className="fee-save-button"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : editingId
                                ? "Update Fee"
                                : "Create Fee"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="fee-cancel-button"
                                onClick={clearForm}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>

            {/* =================================================
                FEE RECORDS
            ================================================= */}

            <div className="fee-records-card">

                <div className="fee-card-header fee-records-header">

                    <div>

                        <span className="fee-small-label">
                            FINANCIAL RECORDS
                        </span>

                        <h2>
                            Fee Records
                        </h2>

                        <p>
                            View fees, balances,
                            payments and receipts.
                        </p>

                    </div>

                    <div className="fee-record-count">

                        <strong>
                            {fees.length}
                        </strong>

                        <span>
                            Records
                        </span>

                    </div>

                </div>

                {loading ? (

                    <div className="fee-loading">

                        <div className="fee-spinner"></div>

                        <h3>
                            Loading fee records...
                        </h3>

                    </div>

                ) : fees.length === 0 ? (

                    <div className="fee-empty">

                        <div className="fee-empty-icon">
                            ₵
                        </div>

                        <h3>
                            No fee records yet
                        </h3>

                        <p>
                            Create a student fee
                            above to see it here.
                        </p>

                    </div>

                ) : (

                    <div className="fee-table-wrapper">

                        <table className="fee-table">

                            <thead>

                                <tr>

                                    <th>
                                        STUDENT
                                    </th>

                                    <th>
                                        TERM
                                    </th>

                                    <th>
                                        YEAR
                                    </th>

                                    <th>
                                        TOTAL
                                    </th>

                                    <th>
                                        PAID
                                    </th>

                                    <th>
                                        BALANCE
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

                                {fees.map(
                                    fee => {

                                        const student =
                                            fee.student ||
                                            {};

                                        const studentName =
                                            `${student.firstName || ""} ${student.lastName || ""}`
                                                .trim() ||
                                            "Unknown Student";

                                        const feeTotal =
                                            Number(
                                                fee.totalFee ??
                                                (
                                                    Number(
                                                        fee.tuitionFee ||
                                                        0
                                                    ) +
                                                    Number(
                                                        fee.otherFees ||
                                                        0
                                                    )
                                                )
                                            );

                                        const feePaid =
                                            Number(
                                                fee.amountPaid ||
                                                0
                                            );

                                        const feeBalance =
                                            Number(
                                                fee.balance ??
                                                Math.max(
                                                    feeTotal -
                                                    feePaid,
                                                    0
                                                )
                                            );

                                        return (

                                            <tr
                                                key={
                                                    fee._id
                                                }
                                            >

                                                <td>

                                                    <div className="fee-student-cell">

                                                        <div className="fee-student-avatar">

                                                            {student.firstName?.charAt(0) ||
                                                                "?"}

                                                            {student.lastName?.charAt(0) ||
                                                                ""}

                                                        </div>

                                                        <div>

                                                            <strong>
                                                                {
                                                                    studentName
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

                                                <td>

                                                    <span className="fee-term-badge">

                                                        {
                                                            fee.term ||
                                                            "N/A"
                                                        }

                                                    </span>

                                                </td>

                                                <td>
                                                    {
                                                        fee.academicYear ||
                                                        "N/A"
                                                    }
                                                </td>

                                                <td>
                                                    <strong>
                                                        {money(
                                                            feeTotal
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong className="fee-paid-text">
                                                        {money(
                                                            feePaid
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    <strong className="fee-balance-text">
                                                        {money(
                                                            feeBalance
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>

                                                    <span
                                                        className={
                                                            getStatusClass(
                                                                fee.status ||
                                                                "Unpaid"
                                                            )
                                                        }
                                                    >
                                                        ●{" "}
                                                        {
                                                            fee.status ||
                                                            "Unpaid"
                                                        }
                                                    </span>

                                                </td>

                                                <td>

                                                    <div className="fee-action-buttons">

                                                        <button
                                                            type="button"
                                                            className="fee-pay-button"
                                                            onClick={() =>
                                                                recordPayment(
                                                                    fee
                                                                )
                                                            }
                                                            disabled={
                                                                feeBalance <=
                                                                0
                                                            }
                                                        >
                                                            {feeBalance <= 0
                                                                ? "Paid"
                                                                : "Pay"}
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="fee-edit-button"
                                                            onClick={() =>
                                                                editFee(
                                                                    fee
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="fee-delete-button"
                                                            onClick={() =>
                                                                deleteFee(
                                                                    fee._id
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

            {/* =================================================
                PAYMENT MODAL
            ================================================= */}

            {paymentFee && (

                <div
                    className="payment-modal-overlay"
                    onClick={closePayment}
                >

                    <div
                        className="payment-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        <div className="payment-modal-header">

                            <div>

                                <span className="fee-small-label">
                                    SCHOOL FINANCE
                                </span>

                                <h2>
                                    Record Payment
                                </h2>

                                <p>
                                    Enter the payment
                                    details below.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="payment-close-button"
                                onClick={closePayment}
                                disabled={paymentSaving}
                            >
                                ×
                            </button>

                        </div>

                        {/* STUDENT */}

                        <div className="payment-student-card">

                            <div className="fee-student-avatar">

                                {
                                    paymentFee.student?.firstName?.charAt(0) ||
                                    "?"
                                }

                                {
                                    paymentFee.student?.lastName?.charAt(0) ||
                                    ""
                                }

                            </div>

                            <div>

                                <strong>

                                    {
                                        paymentFee.student
                                            ? `${paymentFee.student.firstName || ""} ${paymentFee.student.lastName || ""}`
                                            : "Unknown Student"
                                    }

                                </strong>

                                <span>

                                    {
                                        paymentFee.student?.admissionNumber ||
                                        "No admission number"
                                    }

                                </span>

                            </div>

                        </div>

                        {/* PAYMENT SUMMARY */}

                        <div className="payment-summary">

                            <div>

                                <span>
                                    Total Fee
                                </span>

                                <strong>
                                    {money(
                                        paymentFee.totalFee
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Already Paid
                                </span>

                                <strong className="payment-summary-paid">
                                    {money(
                                        paymentFee.amountPaid
                                    )}
                                </strong>

                            </div>

                            <div>

                                <span>
                                    Outstanding
                                </span>

                                <strong className="payment-summary-balance">
                                    {money(
                                        paymentFee.balance
                                    )}
                                </strong>

                            </div>

                        </div>

                        {/* PAYMENT FORM */}

                        <form
                            className="payment-form"
                            onSubmit={
                                handlePaymentSubmit
                            }
                        >

                            <div className="fee-input-group">

                                <label>
                                    Payment Amount
                                </label>

                                <div className="fee-money-input">

                                    <span>
                                        GHS
                                    </span>

                                    <input
                                        type="number"
                                        value={
                                            paymentAmount
                                        }
                                        onChange={(e) =>
                                            setPaymentAmount(
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                        min="0.01"
                                        max={
                                            Number(
                                                paymentFee.balance ||
                                                0
                                            )
                                        }
                                        step="0.01"
                                        required
                                    />

                                </div>

                                <small>
                                    Maximum payment:{" "}
                                    {money(
                                        paymentFee.balance
                                    )}
                                </small>

                            </div>

                            <div className="fee-input-group">

                                <label>
                                    Payment Method
                                </label>

                                <input
                                    type="text"
                                    value={
                                        paymentMethod
                                    }
                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }
                                    list="payment-methods"
                                    placeholder="Enter payment method"
                                    required
                                />

                                <datalist id="payment-methods">

                                    <option value="Cash" />
                                    <option value="Mobile Money" />
                                    <option value="MTN MoMo" />
                                    <option value="Telecel Cash" />
                                    <option value="AirtelTigo Money" />
                                    <option value="Bank Transfer" />
                                    <option value="Card" />
                                    <option value="Cheque" />

                                </datalist>

                                <small>
                                    You can enter any custom
                                    payment method.
                                </small>

                            </div>

                            {/* LIVE PAYMENT PREVIEW */}

                            <div className="payment-live-preview">

                                <span>
                                    New balance after payment
                                </span>

                                <strong>
                                    {money(
                                        Math.max(
                                            Number(
                                                paymentFee.balance ||
                                                0
                                            ) -
                                            Number(
                                                paymentAmount ||
                                                0
                                            ),
                                            0
                                        )
                                    )}
                                </strong>

                            </div>

                            <div className="payment-form-actions">

                                <button
                                    type="button"
                                    className="fee-cancel-button"
                                    onClick={
                                        closePayment
                                    }
                                    disabled={
                                        paymentSaving
                                    }
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="fee-save-button"
                                    disabled={
                                        paymentSaving
                                    }
                                >

                                    {paymentSaving
                                        ? "Recording..."
                                        : "Record & Generate Receipt"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

            {/* =================================================
                RECEIPT
            ================================================= */}

            {receipt && (

                <div className="receipt-modal-overlay">

                    <div className="receipt-modal-container">

                        <div className="receipt-modal-actions no-print">

                            <button
                                type="button"
                                onClick={printReceipt}
                                className="receipt-print-button"
                            >
                                🖨 Print Receipt
                            </button>

                            <button
                                type="button"
                                onClick={closeReceipt}
                                className="receipt-close-button"
                            >
                                Close
                            </button>

                        </div>

                        <Receipt
                            receipt={receipt}
                        />

                    </div>

                </div>

            )}

        </div>
    );
}

export default Fee;
