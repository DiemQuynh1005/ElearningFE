import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import ReactPaginate from "react-paginate";
import { Link, useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../contexts/DataContext";

function UserCourseList(props) {
	const navigate = useNavigate();
	const { userName } = useParams();
	const { auth, showAlert } = useContext(DataContext);
	const [courses, setCourses] = useState([]);
	const [isLoading, setIsLoading] = useState(true); // Loading state
	const [isEmpty, setIsEmpty] = useState(false); // Empty state

	const fetchUserCourses = async () => {
		await axios
			.get(`http://localhost:8080/api/subscriptions/by-account-name/${userName}`)
			.then((res) => {
				if (res.status === 200) {
					const dataCourses = res.data.map((item) => item.course);
					setCourses(dataCourses);
					console.log("MY COURSES: ", courses);
					setIsLoading(false); // Data is no longer loading

					if (dataCourses.length === 0) {
						setTimeout(() => {
							setIsEmpty(true);
						}, 5000); // 5 seconds delay
					}
				}
			})
			.catch((error) => {
				console.log("Something went wrong", error);
				// showAlert(
				// 	"danger",
				// 	"An unexpected error occurred. Please try again later."
				// );
				setIsLoading(false); // Even with an error, stop loading
				setIsEmpty(true);
			});
	};

	useEffect(() => {
		if (Object.keys(auth).length === 0) {
			showAlert("danger", "Sorry for this, Please try again!");
			navigate("/");
		}
		fetchUserCourses();
	}, []);

	//PAGINATE
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);
	const itemsPerPage = 6;
	useEffect(() => {
		const endOffset = itemOffset + itemsPerPage;
		setCurrentItems(courses.slice(itemOffset, endOffset));
		setPageCount(Math.ceil(courses.length / itemsPerPage));
	}, [itemOffset, itemsPerPage, courses]);
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % courses.length;
		setItemOffset(newOffset);
	};
	//END PAGINATE

	return (
		<>
			<div
				className="jumbotron jumbotron-fluid page-header position-relative overlay-bottom"
				style={{ marginBottom: "90px" }}
			>
				{/* {alert.type != "" && (
					<Alert variant={alert.type} dismissible transition>
						{alert.message}
					</Alert>
				)} */}
				<Container className="text-center py-5">
					<h1 className="text-white display-1">My Courses</h1>
				</Container>
			</div>

			<Container fluid className="py-5">
				<Container className="py-5">
					<Row className="mx-0 justify-content-center">
						<Col lg={8}>
							<div className="section-title text-center position-relative mb-5">
								<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
									My Courses
								</h6>
								<h1 className="display-4">
									Checkout New Releases Of Our Courses
									{/*//TODO: SUA LAI SAU */}
								</h1>
							</div>
						</Col>
					</Row>
					<Row>
						{/* LOADER SPINNER */}
						{isLoading && (
							<ColorRing
								visible={true}
								height="80"
								width="80"
								ariaLabel="blocks-loading"
								wrapperStyle={{ display: "block", margin: "auto" }}
								wrapperClass="blocks-wrapper"
								colors={[
									"#F5F5F5",
									"#313236",
									"#7CD6EA",
									"#172765",
									"#F5F5F5",
								]}
							/>
						)}
						{/* END LOADER SPINNER */}

						{isEmpty && <p>Your Course List is empty.</p>}

						{currentItems.map((item, index) => (
							<Col lg={4} md={6} className="pb-4" key={index}>
								<Link
									className="courses-list-item position-relative d-block overflow-hidden mb-2"
									to={`./${item.id}/lessons`}
								>
									<img
										className="img-fluid"
										src={`http://localhost:8080/uploads/courses/${item.thumbnail}`}
										alt={`Course ${item.name}`}
									/>
									<div className="courses-text">
										<h4 className="text-center text-white px-3">
											{item.name}
										</h4>
										<div className="border-top w-100 mt-3">
											<div className="d-flex justify-content-between p-4">
												<span className="text-white">
													<i className="fa-solid fa-chalkboard-user mr-2"></i>
													{item.account.name}
												</span>
												{/* <span className="text-white">
													<i className="fa fa-star mr-2"></i>
													4.5{" "}
													<small>(250)</small>
												</span> */}
											</div>
										</div>
									</div>
								</Link>
							</Col>
						))}
					</Row>
					<Row>
						<Col xs={12}>
							<ReactPaginate
								breakLabel="..."
								nextLabel="Next >"
								onPageChange={handlePageClick}
								pageRangeDisplayed={3}
								pageCount={pageCount}
								previousLabel="< Previous"
								renderOnZeroPageCount={null}
								containerClassName="pagination pagination-lg justify-content-center mb-0"
								pageClassName="page-item"
								pageLinkClassName="page-link"
								previousClassName="page-item"
								nextClassName="page-item"
								previousLinkClassName="page-link rounded-0"
								nextLinkClassName="page-link rounded-0"
								activeClassName="active"
							/>
						</Col>
					</Row>
				</Container>
			</Container>
		</>
	);
}

export default UserCourseList;
