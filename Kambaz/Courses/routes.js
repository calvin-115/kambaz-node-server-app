import CoursesDao from "./dao.js";
import EnrollmentsDao from "../Enrollments/dao.js";

export default function CourseRoutes(app, db) {
    const dao = CoursesDao(db);
    const enrollmentsDao = EnrollmentsDao(db);

    const findAllCourses = (req, res) => {
        const courses = dao.findAllCourses();
        res.json(courses);
    };

    const findCoursesForEnrolledUser = (req, res) => {
        let { userId } = req.params;
        if (userId === "current") {
            const currentUser = req.session["currentUser"];
            if (!currentUser) {
                res.sendStatus(401);
                return;
            }
            userId = currentUser._id;
        }
        const courses = dao.findCoursesForEnrolledUser(userId);
        res.json(courses);
    };

    const createCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const newCourse = dao.createCourse(req.body);
        enrollmentsDao.enrollUserInCourse(currentUser._id, newCourse._id);
        res.json(newCourse);
    };

    const deleteCourse = (req, res) => {
        const { courseId } = req.params;
        dao.deleteCourse(courseId);
        res.sendStatus(200);
    };

    const updateCourse = (req, res) => {
        const { courseId } = req.params;
        const courseUpdates = req.body;
        const status = dao.updateCourse(courseId, courseUpdates);
        res.json(status);
    };

    const enrollUserInCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const { courseId } = req.params;
        enrollmentsDao.enrollUserInCourse(currentUser._id, courseId);
        res.sendStatus(200);
    };

    const unenrollUserFromCourse = (req, res) => {
        const currentUser = req.session["currentUser"];
        const { courseId } = req.params;
        enrollmentsDao.unenrollUserFromCourse(currentUser._id, courseId);
        res.sendStatus(200);
    };

    app.get("/api/courses", findAllCourses);
    app.post("/api/users/current/courses", createCourse);
    app.get("/api/users/:userId/courses", findCoursesForEnrolledUser);
    app.delete("/api/courses/:courseId", deleteCourse);
    app.put("/api/courses/:courseId", updateCourse);
    app.post("/api/courses/:courseId/enroll", enrollUserInCourse);
    app.delete("/api/courses/:courseId/enroll", unenrollUserFromCourse);
}