function Receipt({ receipt }) {
    if (!receipt) {
        return null;
    }

    const money = (amount) => {
        return `GHS ${Number(amount || 0).toLocaleString(
            "en-GH",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        )}`;
    };

    const formatDate = (date) => {
        if (!date) {
            return "";
        }

        return new Date(date).toLocaleString(
            "en-GH",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );
    };

    return (
        <div className="school-receipt">

            {/* SCHOOL HEADER */}

            <div className="receipt-header">

                <div className="receipt-school-icon">
                    ₵
                </div>

                <div className="receipt-school-info">

                    <h1>
                        {receipt.school?.name ||
                            "SCHOOL NAME"}
                    </h1>

                    <p>
                        {receipt.school?.address ||
                            ""}
                    </p>

                    <p>
                        Tel:{" "}
                        {receipt.school?.phone ||
                            ""}
                    </p>

                </div>

            </div>


            {/* RECEIPT TITLE */}

            <div className="receipt-title">

                <h2>
                    PAYMENT RECEIPT
                </h2>

                <span>
                    Official School Payment
                </span>

            </div>


            {/* RECEIPT INFORMATION */}

            <div className="receipt-meta">

                <div>

                    <span>
                        Receipt Number
                    </span>

                    <strong>
                        {receipt.receiptNumber}
                    </strong>

                </div>

                <div>

                    <span>
                        Date
                    </span>

                    <strong>
                        {formatDate(
                            receipt.date
                        )}
                    </strong>

                </div>

            </div>


            {/* STUDENT INFORMATION */}

            <div className="receipt-section">

                <h3>
                    Student Information
                </h3>

                <div className="receipt-student-grid">

                    <div>

                        <span>
                            Student Name
                        </span>

                        <strong>
                            {receipt.student?.firstName}{" "}
                            {receipt.student?.lastName}
                        </strong>

                    </div>

                    <div>

                        <span>
                            Admission Number
                        </span>

                        <strong>
                            {receipt.student
                                ?.admissionNumber ||
                                "N/A"}
                        </strong>

                    </div>

                    <div>

                        <span>
                            Class
                        </span>

                        <strong>
                            {receipt.student
                                ?.className ||
                                "N/A"}
                        </strong>

                    </div>

                    <div>

                        <span>
                            Academic Year
                        </span>

                        <strong>
                            {receipt.academicYear ||
                                "N/A"}
                        </strong>

                    </div>

                    <div>

                        <span>
                            Term
                        </span>

                        <strong>
                            {receipt.term ||
                                "N/A"}
                        </strong>

                    </div>

                </div>

            </div>


            {/* PAYMENT DETAILS */}

            <div className="receipt-section">

                <h3>
                    Payment Details
                </h3>

                <table className="receipt-table">

                    <thead>

                        <tr>

                            <th>
                                Description
                            </th>

                            <th>
                                Amount
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        <tr>

                            <td>
                                Total School Fees
                            </td>

                            <td>
                                {money(
                                    receipt.totalFee
                                )}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Previous Amount Paid
                            </td>

                            <td>
                                {money(
                                    receipt.previousPaid
                                )}
                            </td>

                        </tr>

                        <tr className="receipt-current-payment">

                            <td>
                                Current Payment
                            </td>

                            <td>
                                {money(
                                    receipt.currentPayment
                                )}
                            </td>

                        </tr>

                        <tr>

                            <td>
                                Total Amount Paid
                            </td>

                            <td>
                                {money(
                                    receipt.totalPaid
                                )}
                            </td>

                        </tr>

                        <tr className="receipt-balance">

                            <td>
                                Remaining Balance
                            </td>

                            <td>
                                {money(
                                    receipt.balance
                                )}
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            {/* PAYMENT METHOD */}

            <div className="receipt-payment-info">

                <div>

                    <span>
                        Payment Method
                    </span>

                    <strong>
                        {receipt.paymentMethod ||
                            "N/A"}
                    </strong>

                </div>

                <div>

                    <span>
                        Payment Status
                    </span>

                    <strong
                        className={
                            receipt.status === "Paid"
                                ? "receipt-paid"
                                : "receipt-partial"
                        }
                    >
                        {receipt.status ||
                            "Partial"}
                    </strong>

                </div>

            </div>


            {/* FOOTER */}

            <div className="receipt-footer">

                <p>
                    Thank you for your payment.
                </p>

                <small>
                    This receipt is computer generated
                    and does not require a signature.
                </small>

            </div>

        </div>
    );
}

export default Receipt;
