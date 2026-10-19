const Class = require("../models/Class");


// Create Class
const createClass = async (req, res) => {

    try {

        const {
            className,
            section,
            academicYear,
            teacher
        } = req.body;


        const existingClass = await Class.findOne({
            className,
            section,
            school: req.school.id
        });


        if (existingClass) {
            return res.status(400).json({
                message: "Class already exists"
            });
        }


        const newClass = await Class.create({

            className,
            section,
            academicYear,
            teacher,
            school: req.school.id

        });


        res.status(201).json({

            message: "Class created successfully",
            class: newClass

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// Get All Classes
const getClasses = async (req, res) => {

    try {

        const classes = await Class.find({
            school: req.school.id
        }).populate("teacher", "firstName lastName subject");


        res.status(200).json({

            count: classes.length,
            classes

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};



// Get Single Class
const getClassById = async (req, res) => {

    try {

        const classData = await Class.findOne({

            _id: req.params.id,
            school: req.school.id

        }).populate("teacher", "firstName lastName subject");


        if (!classData) {

            return res.status(404).json({

                message: "Class not found"

            });

        }


        res.status(200).json(classData);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

// Update Class
const updateClass = async (req, res) => {

    try {

        const classData = await Class.findOneAndUpdate(
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


        if (!classData) {

            return res.status(404).json({
                message: "Class not found"
            });

        }


        res.status(200).json({

            message: "Class updated successfully",
            class: classData

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};


// Delete Class
const deleteClass = async (req, res) => {

    try {

        const classData = await Class.findOneAndDelete({
            _id: req.params.id,
            school: req.school.id
        });


        if (!classData) {

            return res.status(404).json({
                message: "Class not found"
            });

        }


        res.status(200).json({

            message: "Class deleted successfully"

        });


    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {

    createClass,
    getClasses,
    getClassById,
    updateClass,
    deleteClass
};
