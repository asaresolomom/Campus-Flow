const Subject = require("../models/Subject");


// Create Subject
const createSubject = async (req, res) => {

    try {

        const {
            subjectName,
            subjectCode,
            teacher,
            class: classId
        } = req.body;


        const existingSubject = await Subject.findOne({
            subjectCode,
            school: req.school.id
        });


        if (existingSubject) {

            return res.status(400).json({
                message: "Subject already exists"
            });

        }


        const subject = await Subject.create({

            subjectName,
            subjectCode,
            teacher,
            class: classId,
            school: req.school.id

        });


        res.status(201).json({

            message: "Subject created successfully",
            subject

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get All Subjects
const getSubjects = async (req, res) => {

    try {

        const subjects = await Subject.find({
            school: req.school.id
        })
            .populate("teacher", "firstName lastName subject")
            .populate("class", "className section");


        res.status(200).json({

            count: subjects.length,
            subjects

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Get Subject By ID
const getSubjectById = async (req, res) => {

    try {

        const subject = await Subject.findOne({
            _id: req.params.id,
            school: req.school.id
        })
            .populate("teacher", "firstName lastName subject")
            .populate("class", "className section");


        if (!subject) {

            return res.status(404).json({
                message: "Subject not found"
            });

        }


        res.status(200).json(subject);


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Subject
const updateSubject = async (req, res) => {

    try {

        const subject = await Subject.findOneAndUpdate(
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

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.status(200).json({
            message: "Subject updated successfully",
            subject
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Subject
const deleteSubject = async (req, res) => {

    try {

        const subject = await Subject.findOneAndDelete({
            _id: req.params.id,
            school: req.school.id
        });

        if (!subject) {
            return res.status(404).json({
                message: "Subject not found"
            });
        }

        res.status(200).json({
            message: "Subject deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


module.exports = {

    createSubject,
    getSubjects,
    getSubjectById,
    updateSubject,
    deleteSubject
};

