import { Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "./layouts/AdminLayout";
import HomepageLayout from "./layouts/HomepageLayout";
import { privateRouter, publicRouter } from "./configs/RouterConfig";
import { useContext } from "react";
import { DataContext } from "./contexts/DataContext";
import ScrollToTop from "./contexts/ScrollToTop";

function App() {
	const { auth } = useContext(DataContext);
	return (
		<div>
			<ScrollToTop />
			<Routes>
				{publicRouter.map((item, index) => {
					return (
						<Route
							key={index}
							path={item.path}
							element={<HomepageLayout>{item.element}</HomepageLayout>}
						/>
					);
				})}
				{auth?.role ? ( // Check if the user is authenticated *first*
					privateRouter.map((item, index) => {
						if (item.roles.includes(auth.role)) {
							return (
								<Route
									key={index}
									path={item.path}
									element={
										<AdminLayout>
											{item.element}
										</AdminLayout>
									}
								/>
							);
						}
						return null; // Or a "Forbidden" component if you want a 403 page
					})
				) : (
					<Route path="*" element={<Navigate to="/login" />} /> // Redirect if not logged in
				)}

				{/* Catch-all route for any unmatched path */}
				<Route
					path="*"
					element={<Navigate to={auth?.role ? "/dashboard" : "/"} />}
				/>
			</Routes>
		</div>
	);
}

export default App;
