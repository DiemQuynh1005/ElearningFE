import BlogEdit from "../pages/adminPages/blogs/BlogEdit";
import BlogInsert from "../pages/adminPages/blogs/BlogInsert";
import BlogList from "../pages/adminPages/blogs/BlogList";
import CourseEdit from "../pages/adminPages/courses/CourseEdit";
import CourseInsert from "../pages/adminPages/courses/CourseInsert";
import CourseList from "../pages/adminPages/courses/CourseList";
import Dashboard from "../pages/adminPages/Dashboard";
import LessonHomeworkEdit from "../pages/adminPages/homeworks/LessonHomeworkEdit";
import LessonHomeworkInsert from "../pages/adminPages/homeworks/LessonHomeworkInsert";
import LessonHomeworkList from "../pages/adminPages/homeworks/LessonHomeworkList";
import CourseLessonInsert from "../pages/adminPages/lessons/CourseLessonInsert";
import CourseLessonsList from "../pages/adminPages/lessons/CourseLessonsList";
import PromotionInsert from "../pages/adminPages/promotions/PromotionInsert";
import PromotionList from "../pages/adminPages/promotions/PromotionList";
import LoginPage from "../pages/homePages/authentication/LoginPage";
import RegisterOtpPage from "../pages/homePages/authentication/RegisterOtpPage";
import RegisterPage from "../pages/homePages/authentication/RegisterPage";
import ContactPage from "../pages/homePages/ContactPage";
import CourseDetailPage from "../pages/homePages/courses/CourseDetailPage";
import CourseListPage from "../pages/homePages/courses/CourseListPage";
import Homepage from "../pages/homePages/Homepage";
import PaymentPage from "../pages/homePages/payment/PaymentPage";
import VNPayResponseHandler from "../pages/homePages/payment/VNPayResponseHandler";
import UserCourseList from "../pages/userPages/UserCourseList";
import UserLessonPage from "../pages/userPages/UserLessonPage";

const publicRouter = [
	{
		path: "/",
		element: <Homepage />,
	},
	{
		path: "/contact",
		element: <ContactPage />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},
	{
		path: "/register/next-step",
		element: <RegisterOtpPage />,
	},
	{
		path: "/courses",
		element: <CourseListPage />,
	},
	{
		path: "/courses/:id",
		element: <CourseDetailPage />,
	},
	{
		path: "/payment",
		element: <PaymentPage />,
	},
	{
		path: "/vnpayResponse",
		element: <VNPayResponseHandler />,
		// roles: ["USER", "ADMIN"],
	},
	{
		path: "/:userName/courses",
		element: <UserCourseList />,
		// roles: ["USER", "ADMIN"],
	},
	{
		path: "/:userName/courses/:courseId/lessons",
		element: <UserLessonPage />,
		// roles: ["USER", "ADMIN"],
	},
];

const privateRouter = [
	{
		path: "/dashboard",
		element: <Dashboard />,
		roles: ["ADMIN"],
	},
	//* -------------------BLOGS-------------------
	{
		path: "/admin/blog",
		element: <BlogList />,
		roles: ["ADMIN"],
	},
	{
		path: "/admin/blog/new",
		element: <BlogInsert />,
		roles: ["ADMIN"],
	},
	{
		path: "/admin/blog/edit/:id",
		element: <BlogEdit />,
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
	//* -------------------COURSES-------------------
	{
		path: "/admin/course",
		element: <CourseList />,
		roles: ["ADMIN", "TEACHER"],
	},
	{
		path: "/admin/course/new",
		element: <CourseInsert />,
		roles: ["ADMIN", "TEACHER"],
	},
	{
		path: "/admin/course/edit/:id",
		element: <CourseEdit />,
		roles: ["ADMIN", "TEACHER"],
	},
	//* -------------------COURSES TO LESSONs-------------------
	{
		path: "/admin/course/:id/lessons",
		element: <CourseLessonsList />,
		roles: ["ADMIN", "TEACHER"],
	},
	{
		path: "/admin/course/:id/lessons/new",
		element: <CourseLessonInsert />,
		roles: ["ADMIN", "TEACHER"],
	},
	//* -------------------LESSONS TO HOMEWORKs-------------------
	// {
	// 	path: "/admin/lesson/:id/homeworks",
	// 	element: <LessonHomeworkList />,
	// 	roles: ["ADMIN", "TEACHER"],
	// },
	{
		path: "/admin/lesson/:id/homeworks/new",
		element: <LessonHomeworkInsert />,
		roles: ["ADMIN", "TEACHER"],
	},
	{
		path: "/admin/lesson/:id/homeworks/edit",
		element: <LessonHomeworkEdit />,
		roles: ["ADMIN", "TEACHER"],
	},
];

export { publicRouter, privateRouter };
