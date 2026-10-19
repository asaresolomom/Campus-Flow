const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({
    extended: true
}));

// ===============================
// STATIC FILES
// ===============================

app.use(
    "/uploads",
    express.static(
        path.join(__dirname, "uploads")
    )
);

app.use(
    "/public",
    express.static(
        path.join(__dirname, "public")
    )
);

// ===============================
// ROOT
// ===============================

app.get("/", (req, res) => {

    res.json({
        message: "🎓 EduMaster Pro API is Running"
    });

});

// ===============================
// SCHOOL
// ===============================

app.use(
    "/api/schools",
    require("./routes/schoolRoutes")
);

// ===============================
// STUDENTS
// ===============================

app.use(
    "/api/students",
    require("./routes/studentRoutes")
);

// ===============================
// TEACHERS
// ===============================

app.use(
    "/api/teachers",
    require("./routes/teacherRoutes")
);

// ===============================
// CLASSES
// ===============================

app.use(
    "/api/classes",
    require("./routes/classRoutes")
);

// ===============================
// SUBJECTS
// ===============================

app.use(
    "/api/subjects",
    require("./routes/subjectRoutes")
);

// ===============================
// ATTENDANCE
// ===============================

app.use(
    "/api/attendance",
    require("./routes/attendanceRoutes")
);

// ===============================
// FEES
// ===============================

app.use(
    "/api/fees",
    require("./routes/feeRoutes")
);

// ===============================
// PAYMENTS
// ===============================

app.use(
    "/api/payments",
    require("./routes/paymentRoutes")
);

// ===============================
// EXAMS
// ===============================

app.use(
    "/api/exams",
    require("./routes/examRoutes")
);

// ===============================
// RESULTS
// ===============================

app.use(
    "/api/results",
    require("./routes/resultRoutes")
);

// ===============================
// 404
// ===============================

app.use((req, res) => {

    res.status(404).json({

        message:
            `Route not found: ${req.method} ${req.originalUrl}`

    });

});

// ===============================
// ERROR HANDLER
// ===============================

app.use((error, req, res, next) => {

    console.error(
        "SERVER ERROR:",
        error
    );

    res.status(500).json({

        message:
            error.message ||
            "Internal server error"

    });

});

// ===============================
// SERVER
// ===============================

const PORT =
    process.env.PORT || 5000;

app.listen(
    PORT,
    () => {

        console.log(
            `Server running on http://localhost:${PORT}`
        );

        console.log(
            "EduMaster Pro API is Running"
        );

    }
);