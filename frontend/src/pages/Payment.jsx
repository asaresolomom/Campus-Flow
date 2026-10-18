import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Payment() {
    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const feeId = searchParams.get("feeId");

    const [fee, setFee] = useState(null);

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [successData, setSuccessData] = useState(null);

    const [form, setForm] = useState({
        amountPaid: "",
        paymentMethod: "Cash"
    });


    // =====================================================
    // LOAD FEE
    // =====================================================

    const loadFee = async () => {
        try {
            setLoading(true);

            if (!feeId) {
                toast.error("No fee record was selected.");
                setLoading(false);
                return;
            }

            const response = await API.get("/fees/all");

            const fees = response.data?.fees || [];

            const selectedFee = fees.find(
                item => item._id === feeId
            );

            if (!selectedFee) {
                toast.error("Fee record not found.");
                setFee(null);
                return;
            }

            setFee(selectedFee);

        } catch (error) {
            console.error(
                "LOAD FEE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to load fee record."
            );

        } finally {
            setLoading(false);
        }
    };


    // =====================================================
    // LOAD
    // =====================================================

    useEffect(() => {
        loadFee();
    }, [feeId]);


    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    // =====================================================
    // MONEY
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
    // SUBMIT PAYMENT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fee) {
            toast.error(
                "Fee record is unavailable."
            );

            return;
        }

        const amount =
            Number(form.amountPaid);

        const balance =
            Number(fee.balance || 0);

        // -----------------------------------------------
        // VALIDATION
        // -----------------------------------------------

        if (!amount || amount <= 0) {
            toast.error(
                "Enter a valid payment amount."
            );

            return;
        }

        if (amount > balance) {
            toast.error(
                `Payment cannot be greater than the outstanding balance of ${money(balance)}`
            );

            return;
        }


        try {
            setSaving(true);


            // -------------------------------------------
            // CREATE PAYMENT
            // -------------------------------------------

            const response = await API.post(
                "/payments/add",
                {
                    student:
                        fee.student?._id ||
                        fee.student,

                    fee:
                        fee._id,

                    amountPaid:
                        amount,

                    paymentMethod:
                        form.paymentMethod
                }
            );


            console.log(
                "PAYMENT RESPONSE:",
                response.data
            );


            // =================================================
            // GET BACKEND ACTIVATION INFORMATION
            // =================================================

            const data =
                response.data || {};


            const payment =
                data.payment || {};


            const activatedStudent =
                data.student || null;


            const generatedAdmissionNumber =
                data.generatedAdmissionNumber ||
                activatedStudent?.admissionNumber ||
                payment.student?.admissionNumber ||
                null;


            const studentActivated =
                data.studentActivated === true ||
                activatedStudent?.isActive === true ||
                payment.student?.isActive === true;


            // =================================================
            // SHOW SUCCESS
            // =================================================

            setSuccessData({
                payment,
                studentActivated,
                admissionNumber:
                    generatedAdmissionNumber
            });


            if (studentActivated) {

                toast.success(
                    "Payment completed. Student has been admitted!"
                );

            } else {

                toast.success(
                    data.message ||
                    "Payment recorded successfully!"
                );

            }


            // =================================================
            // RELOAD FEE
            // =================================================

            await loadFee();


            // Clear amount

            setForm({
                amountPaid: "",
                paymentMethod:
                    form.paymentMethod
            });


        } catch (error) {

            console.error(
                "PAYMENT ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to record payment."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {

        return (
            <div className="payment-page">

                <div className="payment-loading">

                    <div className="payment-spinner"></div>

                    <h2>
                        Loading Fee
                    </h2>

                    <p>
                        Preparing payment details...
                    </p>

                </div>

            </div>
        );

    }


    // =====================================================
    // NO FEE
    // =====================================================

    if (!fee) {

        return (
            <div className="payment-page">

                <div className="payment-error-card">

                    <div className="payment-error-icon">
                        !
                    </div>

                    <h2>
                        Fee Record Not Found
                    </h2>

                    <p>
                        Please select a valid fee
                        record before recording
                        a payment.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/fees")
                        }
                    >
                        Back to Fees
                    </button>

                </div>

            </div>
        );

    }


    // =====================================================
    // STUDENT
    // =====================================================

    const student =
        fee.student || {};


    const studentName =
        `${student.firstName || ""} ${student.lastName || ""}`
            .trim() ||
        "Unknown Student";


    const initials =
        `${student.firstName?.charAt(0) || ""}
        ${student.lastName?.charAt(0) || ""}`
            .replace(/\s/g, "")
            .toUpperCase() ||
        "?";


    // =====================================================
    // FEE VALUES
    // =====================================================

    const totalFee =
        Number(
            fee.totalFee || 0
        );


    const amountPaid =
        Number(
            fee.amountPaid || 0
        );


    const balance =
        Number(
            fee.balance || 0
        );


    const paymentAmount =
        Number(
            form.amountPaid || 0
        );


    const remainingAfterPayment =
        Math.max(
            balance -
            paymentAmount,
            0
        );


    const paymentPercentage =
        totalFee > 0
            ? Math.min(
                100,
                (
                    amountPaid /
                    totalFee
                ) * 100
            )
            : 0;


    // =====================================================
    // PERCENTAGE AFTER THIS PAYMENT
    // =====================================================

    const percentageAfterPayment =
        totalFee > 0
            ? (
                (
                    amountPaid +
                    paymentAmount
                ) /
                totalFee
            ) * 100
            : 0;


    const reachesThirtyPercent =
        percentageAfterPayment >= 30;


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="payment-page">


            {/* =================================================
                SUCCESS / ADMISSION MESSAGE
            ================================================= */}

            {successData && (

                <div
                    style={{
                        marginBottom: "24px",
                        padding: "22px",
                        borderRadius: "16px",
                        background:
                            successData.studentActivated
                                ? "#ecfdf5"
                                : "#fff7ed",
                        border:
                            successData.studentActivated
                                ? "1px solid #a7f3d0"
                                : "1px solid #fed7aa"
                    }}
                >

                    {successData.studentActivated ? (

                        <>

                            <h2
                                style={{
                                    margin:
                                        "0 0 8px",
                                    color:
                                        "#047857"
                                }}
                            >
                                🎉 Student Admitted Successfully
                            </h2>


                            <p
                                style={{
                                    margin:
                                        "0 0 12px"
                                }}
                            >
                                The student has reached
                                the required 30% payment
                                and has been activated.
                            </p>


                            <div
                                style={{
                                    display:
                                        "inline-block",
                                    padding:
                                        "12px 18px",
                                    borderRadius:
                                        "10px",
                                    background:
                                        "#ffffff"
                                }}
                            >

                                <strong>
                                    Admission Number:
                                </strong>

                                <span
                                    style={{
                                        marginLeft:
                                            "8px",
                                        fontWeight:
                                            "800",
                                        color:
                                            "#047857"
                                    }}
                                >
                                    {
                                        successData.admissionNumber ||
                                        "Generated"
                                    }
                                </span>

                            </div>

                        </>

                    ) : (

                        <>

                            <h2
                                style={{
                                    margin:
                                        "0 0 8px",
                                    color:
                                        "#c2410c"
                                }}
                            >
                                ✓ Payment Recorded
                            </h2>


                            <p
                                style={{
                                    margin: 0
                                }}
                            >
                                The student has not yet
                                reached 30% of the school
                                fees. The admission number
                                will be generated when the
                                30% requirement is reached.
                            </p>

                        </>

                    )}

                </div>

            )}


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="payment-header">

                <div>

                    <span className="payment-badge">
                        SCHOOL FINANCE
                    </span>

                    <h1>
                        Record Payment
                    </h1>

                    <p>
                        Record a payment against
                        an existing student fee.
                    </p>

                </div>


                <button
                    type="button"
                    className="payment-back-button"
                    onClick={() =>
                        navigate("/fees")
                    }
                >
                    ← Back to Fees
                </button>

            </div>


            {/* =================================================
                CONTENT
            ================================================= */}

            <div className="payment-layout">


                {/* =================================================
                    LEFT
                ================================================= */}

                <div className="payment-left">


                    {/* STUDENT CARD */}

                    <div className="payment-card student-payment-card">

                        <div className="payment-card-title">

                            <div>

                                <h2>
                                    Student Information
                                </h2>

                                <p>
                                    Selected fee record
                                </p>

                            </div>

                        </div>


                        <div className="payment-student">

                            <div className="payment-avatar">
                                {initials}
                            </div>

                            <div>

                                <h3>
                                    {studentName}
                                </h3>

                                <p>
                                    Admission No:{" "}

                                    <strong>
                                        {student.admissionNumber ||
                                            "Pending - 30% Required"}
                                    </strong>
                                </p>

                                <p>

                                    Status:{" "}

                                    <strong
                                        style={{
                                            color:
                                                student.isActive
                                                    ? "#047857"
                                                    : "#c2410c"
                                        }}
                                    >
                                        {student.isActive
                                            ? "Active"
                                            : "Pending Admission"}
                                    </strong>

                                </p>

                            </div>

                        </div>


                        <div className="payment-meta-grid">

                            <div>

                                <span>
                                    Academic Year
                                </span>

                                <strong>
                                    {fee.academicYear ||
                                        "N/A"}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Term
                                </span>

                                <strong>
                                    {fee.term ||
                                        "N/A"}
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* FEE SUMMARY */}

                    <div className="payment-card">

                        <div className="payment-card-title">

                            <div>

                                <h2>
                                    Fee Summary
                                </h2>

                                <p>
                                    Current payment position
                                </p>

                            </div>

                        </div>


                        <div className="payment-summary-grid">


                            <div className="payment-summary-item">

                                <span>
                                    Total Fee
                                </span>

                                <strong>
                                    {money(totalFee)}
                                </strong>

                            </div>


                            <div className="payment-summary-item success">

                                <span>
                                    Already Paid
                                </span>

                                <strong>
                                    {money(amountPaid)}
                                </strong>

                            </div>


                            <div className="payment-summary-item danger">

                                <span>
                                    Outstanding
                                </span>

                                <strong>
                                    {money(balance)}
                                </strong>

                            </div>

                        </div>


                        {/* PROGRESS */}

                        <div className="payment-progress-section">

                            <div className="payment-progress-header">

                                <span>
                                    Fee Collection
                                </span>

                                <strong>
                                    {paymentPercentage.toFixed(1)}%
                                </strong>

                            </div>


                            <div className="payment-progress">

                                <div
                                    style={{
                                        width:
                                            `${paymentPercentage}%`
                                    }}
                                ></div>

                            </div>

                        </div>


                        {/* 30% NOTICE */}

                        <div
                            style={{
                                marginTop:
                                    "20px",
                                padding:
                                    "14px 16px",
                                borderRadius:
                                    "10px",
                                background:
                                    paymentPercentage >= 30
                                        ? "#ecfdf5"
                                        : "#fff7ed",
                                color:
                                    paymentPercentage >= 30
                                        ? "#047857"
                                        : "#c2410c"
                            }}
                        >

                            <strong>
                                Admission Requirement
                            </strong>

                            <div
                                style={{
                                    marginTop:
                                        "5px"
                                }}
                            >

                                {paymentPercentage >= 30

                                    ? "✓ 30% requirement reached."

                                    : `Student needs at least ${money(
                                        totalFee * 0.30 -
                                        amountPaid
                                    )} more to reach 30%.`

                                }

                            </div>

                        </div>

                    </div>

                </div>


                {/* =================================================
                    RIGHT
                ================================================= */}

                <div className="payment-card payment-form-card">

                    <div className="payment-card-title">

                        <div>

                            <span className="form-small-label">
                                NEW TRANSACTION
                            </span>

                            <h2>
                                Payment Details
                            </h2>

                            <p>
                                Enter the amount received
                                from the student.
                            </p>

                        </div>

                    </div>


                    <form
                        className="payment-form"
                        onSubmit={handleSubmit}
                    >


                        {/* AMOUNT */}

                        <div className="payment-input-group">

                            <label>
                                Amount Received
                            </label>

                            <div className="payment-amount-input">

                                <span>
                                    GHS
                                </span>

                                <input
                                    type="number"
                                    name="amountPaid"
                                    value={
                                        form.amountPaid
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="0.00"
                                    min="0.01"
                                    max={balance}
                                    step="0.01"
                                    required
                                />

                            </div>

                        </div>


                        {/* METHOD */}

                        <div className="payment-input-group">

                            <label>
                                Payment Method
                            </label>

                            <select
                                name="paymentMethod"
                                value={
                                    form.paymentMethod
                                }
                                onChange={
                                    handleChange
                                }
                            >

                                <option value="Cash">
                                    Cash
                                </option>

                                <option value="Mobile Money">
                                    Mobile Money
                                </option>

                                <option value="Bank Transfer">
                                    Bank Transfer
                                </option>

                                <option value="Card">
                                    Card
                                </option>

                            </select>

                        </div>


                        {/* 30% PREVIEW */}

                        {paymentAmount > 0 && (

                            <div
                                style={{
                                    padding:
                                        "15px",
                                    borderRadius:
                                        "12px",
                                    background:
                                        reachesThirtyPercent
                                            ? "#ecfdf5"
                                            : "#fff7ed",
                                    marginBottom:
                                        "18px"
                                }}
                            >

                                <strong>

                                    {reachesThirtyPercent

                                        ? "🎉 This payment reaches the 30% admission requirement."

                                        : `After this payment: ${percentageAfterPayment.toFixed(1)}% paid.`

                                    }

                                </strong>

                            </div>

                        )}


                        {/* PREVIEW */}

                        <div className="payment-preview">

                            <div>

                                <span>
                                    Current Balance
                                </span>

                                <strong>
                                    {money(balance)}
                                </strong>

                            </div>


                            <div>

                                <span>
                                    Payment
                                </span>

                                <strong className="preview-payment">
                                    {money(paymentAmount)}
                                </strong>

                            </div>


                            <div className="preview-total">

                                <span>
                                    Remaining Balance
                                </span>

                                <strong>
                                    {money(
                                        remainingAfterPayment
                                    )}
                                </strong>

                            </div>

                        </div>


                        {/* RECEIPT NOTICE */}

                        <div className="receipt-notice">

                            <div className="receipt-notice-icon">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Receipt generated automatically
                                </strong>

                                <p>
                                    A unique receipt number
                                    will be created when
                                    this payment is saved.
                                </p>

                            </div>

                        </div>


                        {/* BUTTONS */}

                        <div className="payment-actions">

                            <button
                                type="button"
                                className="payment-cancel"
                                onClick={() =>
                                    navigate("/fees")
                                }
                                disabled={saving}
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                className="payment-submit"
                                disabled={
                                    saving ||
                                    balance <= 0
                                }
                            >

                                {saving

                                    ? "Recording..."

                                    : balance <= 0

                                        ? "Fee Fully Paid"

                                        : "✓ Record Payment"

                                }

                            </button>

                        </div>


                    </form>

                </div>

            </div>

        </div>
    );
}

export default Payment;