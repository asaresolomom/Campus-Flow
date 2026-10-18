import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "../App.css";

function Finance() {
    const navigate = useNavigate();

    const [fees, setFees] = useState([]);
    const [payments, setPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const loadFinanceData = async () => {
        try {
            setLoading(true);

            const [feesResponse, paymentsResponse] =
                await Promise.all([
                    API.get("/fees/all"),
                    API.get("/payments/all")
                ]);

            setFees(
                feesResponse.data?.fees || []
            );

            setPayments(
                paymentsResponse.data?.payments || []
            );

        } catch (error) {
            console.error(
                "FINANCE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to load finance data"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadFinanceData();
    }, []);

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

    const totalFees = fees.reduce(
        (sum, fee) =>
            sum +
            Number(
                fee.totalFee ??
                (
                    Number(fee.tuitionFee || 0) +
                    Number(fee.otherFees || 0)
                )
            ),
        0
    );

    const totalPaid = fees.reduce(
        (sum, fee) =>
            sum +
            Number(fee.amountPaid || 0),
        0
    );

    const totalBalance = fees.reduce(
        (sum, fee) =>
            sum +
            Number(
                fee.balance ??
                Math.max(
                    Number(fee.totalFee || 0) -
                    Number(fee.amountPaid || 0),
                    0
                )
            ),
        0
    );

    const paidCount = fees.filter(
        fee => fee.status === "Paid"
    ).length;

    const partialCount = fees.filter(
        fee => fee.status === "Partial"
    ).length;

    const unpaidCount = fees.filter(
        fee =>
            !fee.status ||
            fee.status === "Unpaid"
    ).length;

    const getStudentName = (payment) => {
        const student =
            payment.student || {};

        return (
            `${student.firstName || ""} ${
                student.lastName || ""
            }`.trim() ||
            "Unknown Student"
        );
    };

    if (loading) {
        return (
            <div className="finance-page">

                <div className="finance-loading">

                    <div className="finance-spinner"></div>

                    <h2>
                        Loading Finance Dashboard...
                    </h2>

                </div>

            </div>
        );
    }

    return (
        <div className="finance-page">

            {/* HERO */}

            <div className="finance-hero">

                <div>

                    <span className="finance-badge">
                        SCHOOL FINANCE
                    </span>

                    <h1>
                        Finance Dashboard
                    </h1>

                    <p>
                        Monitor school fees,
                        payments and outstanding
                        balances from one place.
                    </p>

                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/fees")
                    }
                    className="finance-fee-button"
                >
                    Manage Fees
                </button>

            </div>


            {/* STATISTICS */}

            <div className="finance-stat-grid">

                <div className="finance-stat-card">

                    <div className="finance-stat-icon blue">
                        ₵
                    </div>

                    <div>
                        <span>
                            Total Fees
                        </span>

                        <strong>
                            {money(totalFees)}
                        </strong>
                    </div>

                </div>


                <div className="finance-stat-card">

                    <div className="finance-stat-icon green">
                        ✓
                    </div>

                    <div>
                        <span>
                            Total Collected
                        </span>

                        <strong>
                            {money(totalPaid)}
                        </strong>
                    </div>

                </div>


                <div className="finance-stat-card">

                    <div className="finance-stat-icon orange">
                        !
                    </div>

                    <div>
                        <span>
                            Outstanding
                        </span>

                        <strong>
                            {money(totalBalance)}
                        </strong>
                    </div>

                </div>


                <div className="finance-stat-card">

                    <div className="finance-stat-icon purple">
                        #
                    </div>

                    <div>
                        <span>
                            Fee Records
                        </span>

                        <strong>
                            {fees.length}
                        </strong>
                    </div>

                </div>

            </div>


            {/* PAYMENT STATUS */}

            <div className="finance-grid">


                <div className="finance-card">

                    <div className="finance-card-header">

                        <div>

                            <span>
                                PAYMENT STATUS
                            </span>

                            <h2>
                                Fee Overview
                            </h2>

                        </div>

                    </div>


                    <div className="finance-status-list">

                        <div className="finance-status-row">

                            <span>
                                Paid
                            </span>

                            <strong className="finance-paid">
                                {paidCount}
                            </strong>

                        </div>


                        <div className="finance-status-row">

                            <span>
                                Partial
                            </span>

                            <strong className="finance-partial">
                                {partialCount}
                            </strong>

                        </div>


                        <div className="finance-status-row">

                            <span>
                                Unpaid
                            </span>

                            <strong className="finance-unpaid">
                                {unpaidCount}
                            </strong>

                        </div>

                    </div>

                </div>


                {/* COLLECTION RATE */}

                <div className="finance-card">

                    <div className="finance-card-header">

                        <div>

                            <span>
                                COLLECTION
                            </span>

                            <h2>
                                Collection Rate
                            </h2>

                        </div>

                    </div>


                    <div className="finance-progress">

                        <div
                            className="finance-progress-bar"
                            style={{
                                width:
                                    totalFees > 0
                                        ? `${Math.min(
                                            (totalPaid /
                                                totalFees) *
                                            100,
                                            100
                                        )}%`
                                        : "0%"
                            }}
                        ></div>

                    </div>


                    <div className="finance-progress-info">

                        <strong>
                            {totalFees > 0
                                ? (
                                    (totalPaid /
                                        totalFees) *
                                    100
                                ).toFixed(1)
                                : "0.0"}%
                        </strong>

                        <span>
                            collected
                        </span>

                    </div>

                </div>

            </div>


            {/* RECENT PAYMENTS */}

            <div className="finance-card">

                <div className="finance-card-header">

                    <div>

                        <span>
                            TRANSACTIONS
                        </span>

                        <h2>
                            Recent Payments
                        </h2>

                    </div>

                    <span className="finance-count">
                        {payments.length}
                    </span>

                </div>


                {payments.length === 0 ? (

                    <div className="finance-empty">

                        <div>
                            ₵
                        </div>

                        <h3>
                            No payments yet
                        </h3>

                        <p>
                            Payment transactions
                            will appear here.
                        </p>

                    </div>

                ) : (

                    <div className="finance-table-wrapper">

                        <table className="finance-table">

                            <thead>

                                <tr>

                                    <th>
                                        STUDENT
                                    </th>

                                    <th>
                                        AMOUNT
                                    </th>

                                    <th>
                                        METHOD
                                    </th>

                                    <th>
                                        DATE
                                    </th>

                                    <th>
                                        RECEIPT
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {payments
                                    .slice(0, 10)
                                    .map(payment => (

                                        <tr
                                            key={
                                                payment._id
                                            }
                                        >

                                            <td>

                                                <strong>
                                                    {
                                                        getStudentName(
                                                            payment
                                                        )
                                                    }
                                                </strong>

                                            </td>


                                            <td>

                                                <strong className="finance-payment-amount">
                                                    {money(
                                                        payment.amountPaid
                                                    )}
                                                </strong>

                                            </td>


                                            <td>

                                                <span className="finance-method">
                                                    {
                                                        payment.paymentMethod ||
                                                        "N/A"
                                                    }
                                                </span>

                                            </td>


                                            <td>

                                                {
                                                    payment.createdAt
                                                        ? new Date(
                                                            payment.createdAt
                                                        ).toLocaleDateString(
                                                            "en-GH"
                                                        )
                                                        : "N/A"
                                                }

                                            </td>


                                            <td>

                                                <span className="finance-receipt">

                                                    {
                                                        payment.receiptNumber ||
                                                        "N/A"
                                                    }

                                                </span>

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

export default Finance;