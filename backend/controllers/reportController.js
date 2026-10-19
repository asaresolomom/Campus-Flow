const Result = require("../models/Result");
const Student = require("../models/Student");


// Generate Student Report Card
const getStudentReport = async (req, res) => {

    try {

        const { studentId, examId } = req.params;


        // Find student
        const student = await Student.findOne({

            _id: studentId,
            school: req.school.id

        })
        .populate("class", "className section");


        if (!student) {

            return res.status(404).json({

                message: "Student not found"

            });

        }


        // Find results
        const results = await Result.find({

            student: studentId,
            exam: examId,
            school: req.school.id

        })
        .populate("subject", "subjectName");


        if (results.length === 0) {

            return res.status(404).json({

                message: "No results found"

            });

        }


        // Calculate average

        let totalPercentage = 0;


        results.forEach(result => {

            totalPercentage += result.percentage;

        });


        const average = totalPercentage / results.length;


        // Overall Grade

        let overallGrade;


        if (average >= 80) {

            overallGrade = "A";

        } else if (average >= 70) {

            overallGrade = "B";

        } else if (average >= 60) {

            overallGrade = "C";

        } else if (average >= 50) {

            overallGrade = "D";

        } else {

            overallGrade = "F";

        }



        res.status(200).json({

            student,

            results,

            average: average.toFixed(2),

            overallGrade

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



module.exports = {

    getStudentReport

};