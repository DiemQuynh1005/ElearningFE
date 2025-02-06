import CourseInsert from "../pages/adminPages/courses/CourseInsert";
import CourseList from "../pages/adminPages/courses/CourseList";
import Dashboard from "../pages/adminPages/Dashboard";
import LessonHomeworkInsert from "../pages/adminPages/homeworks/LessonHomeworkInsert";
import LessonHomeworkList from "../pages/adminPages/homeworks/LessonHomeworkList";
import CourseLessonInsert from "../pages/adminPages/lessons/CourseLessonInsert";
import CourseLessonsList from "../pages/adminPages/lessons/CourseLessonsList";
import PromotionInsert from "../pages/adminPages/promotions/PromotionInsert";
import PromotionList from "../pages/adminPages/promotions/PromotionList";
import CourseDetailPage from "../pages/homePages/courses/CourseDetailPage";
import CourseListPage from "../pages/homePages/courses/CourseListPage";
import Homepage from "../pages/homePages/Homepage";
import LoginPage from "../pages/homePages/LoginPage";

const publicRouter = [
	{
		path: "/",
		element: <Homepage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/courses",
		element: <CourseListPage />,
	},
	{
		path: "/courses/:id",
		element: <CourseDetailPage />,
	},
];

const privateRouter = [
	{
		path: "/dashboard",
		element: <Dashboard />,
		roles: ["ADMIN"],
	},
	//* -------------------COURSES-------------------
	{
		path: "/admin/course",
		element: <CourseList />,
		roles: ["ADMIN"],
	},
	{
		path: "/admin/course/new",
		element: <CourseInsert />,
		roles: ["ADMIN"],
	},
	//* -------------------PROMOTIONS-------------------
	{
		path: "/admin/promotion",
		element: <PromotionList />,
		roles: ["ADMIN"],
	},
	{
		path: "/admin/promotion/new",
		element: <PromotionInsert />,
		roles: ["ADMIN"],
	},
	//* -------------------COURSES TO LESSONs-------------------
	{
		path: "/admin/course/:id/lessons",
		element: <CourseLessonsList />,
		roles: ["ADMIN"],
	},
	{
		path: "/admin/course/:id/lessons/new",
		element: <CourseLessonInsert />,
		roles: ["ADMIN"],
	},
	//* -------------------LESSONS TO HOMEWORKs-------------------
	{
		path: "/admin/lesson/:id/homeworks",
		element: <LessonHomeworkList />,
		roles: ["ADMIN"],
	},
	{
		path: "/admin/lesson/:id/homeworks/new",
		element: <LessonHomeworkInsert />,
		roles: ["ADMIN"],
	},
];

export { publicRouter, privateRouter };
