const express = require("express");
const router = express.Router();
const studentController = require("./students-controller");
const { validateRequest } = require("../../utils");
const { isUserAdmin } = require("../../middlewares");
const {
    GetStudentsSchema,
    StudentIdSchema,
    AddStudentSchema,
    UpdateStudentSchema,
    StudentStatusSchema
} = require("./students-schema");

router.get("", validateRequest(GetStudentsSchema), studentController.handleGetAllStudents);
router.post("", validateRequest(AddStudentSchema), studentController.handleAddStudent);
router.get("/:id", validateRequest(StudentIdSchema), studentController.handleGetStudentDetail);
router.post("/:id/status", validateRequest(StudentStatusSchema), studentController.handleStudentStatus);
router.put("/:id", validateRequest(UpdateStudentSchema), studentController.handleUpdateStudent);
router.delete("/:id", isUserAdmin, validateRequest(StudentIdSchema), studentController.handleDeleteStudent);

module.exports = { studentsRoutes: router };
