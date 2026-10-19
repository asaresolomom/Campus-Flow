const Exam = require("../models/Exam");


// Create Exam
const createExam = async (req, res) => {

    try {

        const {
            examName,
            term,
            academicYear,
            startDate,
            endDate
        } = req.body;


        const exam = await Exam.create({

            examName,
            term,
            academicYear,
            startDate,
            endDate,
            school: req.school.id

        });


        res.status(201).json({

            message: "Exam created successfully",
            exam

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// Get All Exams
const getExams = async (req, res) => {

    try {

        const exams = await Exam.find({

            school: req.school.id

        });


        res.status(200).json({

            count: exams.length,
            exams

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



// Get Single Exam
const getExamById = async (req, res) => {

    try {

        const exam = await Exam.findOne({

            _id: req.params.id,
            school: req.school.id

        });


        if (!exam) {

            return res.status(404).json({

                message: "Exam not found"

            });

        }


        res.status(200).json(exam);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// Update Exam
const updateExam = async (req, res) => {

    try {

        const exam = await Exam.findOneAndUpdate(
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


        if (!exam) {

            return res.status(404).json({
                message: "Exam not found"
            });

        }


        res.status(200).json({

            message: "Exam updated successfully",
            exam

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete Exam
const deleteExam = async (req, res) => {

    try {

        const exam = await Exam.findOneAndDelete({
            _id: req.params.id,
            school: req.school.id
        });


        if (!exam) {

            return res.status(404).json({
                message: "Exam not found"
            });

        }


        res.status(200).json({

            message: "Exam deleted successfully"

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {

    createExam,
    getExams,
    getExamById,
    updateExam,
    deleteExam
};
    getExams,
    getExamById,
    updateExam

