import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const DataContext = createContext();

function DataProvider({ children }) {
	const navigate = useNavigate();
	//COURSES
	//ALERT
	const [alert, setAlert] = useState({ type: "", message: "", show: false });
	//USER
	let user = JSON.parse(sessionStorage.getItem("user")) || {};
	const [auth, setAuth] = useState(user);

	//ALERTING
	const showAlert = (type, message, duration = 1000) => {
		setAlert({ type, message, show: true });
		setTimeout(() => setAlert({ ...alert, show: false }), duration);
	};

	const hideAlert = () => setAlert({ ...alert, show: false });

	//FETCH COURSES
	const [courses, setCourses] = useState([]);
	const fetchCourses = async () => {
		try {
			const response = await axios.get("http://localhost:8080/api/courses");
			setCourses(response.data);
		} catch (error) {
			console.log("Error FETCHING COURSES: ", error);
		}
	};

	//LOGIN
	const login = async (u) => {
		const parseUser = jwtDecode(u);
		// console.log("parseUser:", parseUser);
		sessionStorage.setItem("user", JSON.stringify(parseUser.userInfo));
		setAuth(parseUser.userInfo);
		switch (parseUser.userInfo.role) {
			case "ADMIN":
				navigate("/dashboard");
				break;
			case "TEACHER":
				navigate("/teacher");
				break;
			default:
				showAlert("success", "Login Successfully!");
				navigate("/");
				break;
		}
	};

	//LOG OUT
	const logout = () => {
		sessionStorage.removeItem("user");
		setAuth({});
		showAlert("success", "Logged out successfully!");
		navigate("/");
	};

	useEffect(() => {
		fetchCourses();
	}, []);

	let valueProvide = {
		courses,
		fetchCourses,
		alert,
		showAlert,
		hideAlert,
		auth,
		setAuth,
		login,
		logout,
	};
	return <DataContext.Provider value={valueProvide}>{children}</DataContext.Provider>;
}

export { DataContext, DataProvider };
