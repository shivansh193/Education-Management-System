const { z } = require("zod");

const optionalText = (max) => z.string().trim().max(max).optional().nullable();
const phone = z.string().trim().max(20).optional().nullable();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Must be a valid date (YYYY-MM-DD)")
    .refine((v) => !Number.isNaN(Date.parse(v)), "Must be a valid date")
    .optional().nullable();

const idParam = z.object({
    id: z.string().regex(/^[1-9]\d*$/, "Student id must be a positive integer")
});

const studentFields = {
    name: z.string().trim().min(1, "Name is required").max(100),
    email: z.string().trim().email("Invalid email address").max(100),
    gender: optionalText(10),
    phone,
    dob: isoDate,
    class: optionalText(50),
    section: optionalText(50),
    roll: z.coerce.number().int().positive().optional().nullable(),
    admissionDate: isoDate,
    currentAddress: optionalText(50),
    permanentAddress: optionalText(50),
    fatherName: optionalText(50),
    fatherPhone: phone,
    motherName: optionalText(50),
    motherPhone: phone,
    guardianName: optionalText(50),
    guardianPhone: phone,
    relationOfGuardian: optionalText(30),
    systemAccess: z.boolean().optional()
};

const GetStudentsSchema = z.object({
    query: z.object({
        name: z.string().optional(),
        className: z.string().optional(),
        section: z.string().optional(),
        roll: z.string().regex(/^\d+$/, "Roll must be a number").optional()
    })
});

const StudentIdSchema = z.object({ params: idParam });

const AddStudentSchema = z.object({ body: z.object(studentFields) });

const UpdateStudentSchema = z.object({
    params: idParam,
    body: z.object(studentFields)
});

const StudentStatusSchema = z.object({
    params: idParam,
    body: z.object({ status: z.boolean({ required_error: "status is required (boolean)" }) })
});

module.exports = {
    GetStudentsSchema,
    StudentIdSchema,
    AddStudentSchema,
    UpdateStudentSchema,
    StudentStatusSchema
};
