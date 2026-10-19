const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const Class = require("../models/Class");
const Subject = require("../models/Subject");
const Finance = require("../models/Finance");

exports.getDashboardStats = async (req, res) => {
    try {

        const totalStudents = await Student.countDocuments();

        const totalTeachers = await Teacher.countDocuments();

        const totalClasses = await Class.countDocuments();

        const totalSubjects = await Subject.countDocuments();

        const payments = await Finance.find();

        const totalIncome = payments.reduce(
            (sum, payment) => sum + Number(payment.amount || 0),
            0
        );

        res.json({
            totalStudents,
            totalTeachers,
            totalClasses,
            totalSubjects,
            totalIncome
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};