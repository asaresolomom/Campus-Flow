const Result = require("../models/Result");


// Add Result
const addResult = async (req, res) => {

    try {

        const {
            student,
            exam,
            subject,
            marksObtained,
            totalMarks,
            teacherComment
        } = req.body;


        const result = await Result.create({

            student,
            exam,
            subject,
            marksObtained,
            totalMarks,
            teacherComment,
            school: req.school.id

        });


        res.status(201).json({

            message: "Result added successfully",
            result

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// Get All Results
const getResults = async (req, res) => {

    try {

        const results = await Result.find({

            school: req.school.id

        })
        .populate("student", "firstName lastName admissionNumber")
        .populate("exam", "examName term")
        .populate("subject", "subjectName");


        res.status(200).json({

            count: results.length,
            results

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// Get Student Results
const getStudentResults = async (req, res) => {

    try {

        const results = await Result.find({

            student: req.params.studentId,
            school: req.school.id

        })
        .populate("exam", "examName term")
        .populate("subject", "subjectName");


        res.status(200).json({

            count: results.length,
            results

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// Update Result
const updateResult = async (req, res) => {

    try {

        const result = await Result.findOneAndUpdate(
            {
                _id: req.params.id,
                school: req.school.id
            },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );


        if (!result) {

            return res.status(404).json({
                message: "Result not found"
            });

        }


        res.status(200).json({

            message: "Result updated successfully",
            result

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Result
const deleteResult = async (req, res) => {

    try {

        const result = await Result.findOneAndDelete({

            _id: req.params.id,
            school: req.school.id

        });


        if (!result) {

            return res.status(404).json({

                message: "Result not found"

            });

        }


        res.status(200).json({

            message: "Result deleted successfully"

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {

    addResult,
    getResults,
    getStudentResults,
    updateResult,
    deleteResult

};