const { ApiError, sendAccountVerificationEmail } = require("../../utils");
const {
    findAllStudents,
    findStudentDetail,
    findStudentToSetStatus,
    addOrUpdateStudent,
    findStudentById,
    findUserByEmail,
    removeStudent
} = require("./students-repository");

const checkStudentId = async (id) => {
    const student = await findStudentById(id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }
    return student;
}

const getAllStudents = async (payload) => {
    const students = await findAllStudents(payload);
    if (students.length <= 0) {
        throw new ApiError(404, "Students not found");
    }

    return students;
}

const getStudentDetail = async (id) => {
    await checkStudentId(id);

    const student = await findStudentDetail(id);
    if (!student) {
        throw new ApiError(404, "Student not found");
    }

    return student;
}

const addNewStudent = async (payload) => {
    const ADD_STUDENT_AND_EMAIL_SEND_SUCCESS = "Student added and verification email sent successfully.";
    const ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL = "Student added, but failed to send verification email.";

    if (await findUserByEmail(payload.email)) {
        throw new ApiError(409, "Email already exists");
    }

    const result = await addOrUpdateStudent(payload);
    if (!result.status) {
        throw new ApiError(500, result.message);
    }

    try {
        await sendAccountVerificationEmail({ userId: result.userId, userEmail: payload.email });
        return { userId: result.userId, message: ADD_STUDENT_AND_EMAIL_SEND_SUCCESS };
    } catch (error) {
        return { userId: result.userId, message: ADD_STUDENT_AND_BUT_EMAIL_SEND_FAIL };
    }
}

const updateStudent = async (payload) => {
    const student = await checkStudentId(payload.userId);

    const emailOwner = await findUserByEmail(payload.email);
    if (emailOwner && emailOwner.id !== payload.userId) {
        throw new ApiError(409, "Email already exists");
    }

    // The DB function overwrites is_active, so keep the current value unless one is supplied
    const systemAccess = payload.systemAccess ?? student.systemAccess;

    const result = await addOrUpdateStudent({ ...payload, systemAccess });
    if (!result.status) {
        throw new ApiError(500, result.message);
    }

    return { message: result.message };
}

const setStudentStatus = async ({ userId, reviewerId, status }) => {
    await checkStudentId(userId);

    const affectedRow = await findStudentToSetStatus({ userId, reviewerId, status });
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to change student status");
    }

    return { message: "Student status changed successfully" };
}

const deleteStudent = async (id) => {
    await checkStudentId(id);

    const affectedRow = await removeStudent(id);
    if (affectedRow <= 0) {
        throw new ApiError(500, "Unable to delete student");
    }

    return { message: "Student deleted successfully" };
}

module.exports = {
    getAllStudents,
    getStudentDetail,
    addNewStudent,
    setStudentStatus,
    updateStudent,
    deleteStudent,
};
