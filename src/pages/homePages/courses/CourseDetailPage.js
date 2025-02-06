import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { DataContext } from "../../../contexts/DataContext";
import { ColorRing } from "react-loader-spinner";

function CourseDetailPage(props) {
	const carouselResp = {
		0: {
			items: 1,
		},
		450: {
			items: 2,
		},
		600: {
			items: 3,
		},
		1000: {
			items: 4,
		},
	};
	const navigate = useNavigate();
	const { showAlert, courses } = useContext(DataContext);
	const [course, setCourse] = useState(null);
	const { id } = useParams();
	const [moreCourses, setMoreCourses] = useState([]);

	const fetchCourse = async (courseId) => {
		try {
			await axios
				.get(`http://localhost:8080/api/courses/detail/${courseId}`)
				.then((res) => {
					if (res.status === 200) {
						setCourse(res.data);
					}
				});
		} catch (error) {
			if (error.response.status === 404) {
				showAlert("warning", "Course Not Found!");
				navigate("/courses");
			}
		}
	};

	console.log("ID", id);
	console.log("COURSEs:", courses);

	useEffect(() => {
		AOS.init();
		fetchCourse(id);
		setMoreCourses(
			courses.length > 0 && course != null
				? courses.filter((item) => item.id !== course.id)
				: []
		);
	}, [id]);

	return (
		<>
			<div
				className="jumbotron jumbotron-fluid page-header position-relative overlay-bottom"
				style={{ marginBottom: "90px" }}
			>
				<Container className="text-center py-5">
					<h1 className="text-white display-1">Course Detail</h1>
					{/* <div
						className="mx-auto mb-5"
						style={{ width: "100%", maxWidth: "600px" }}
					>
						<InputGroup>
							<Dropdown>
								<Dropdown.Toggle
									variant="outline-light bg-white text-body px-4"
									id="dropdown-basic"
								>
									{selectedCourse}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item
										onClick={() =>
											handleCourseSelect("Courses 1")
										}
									>
										Courses 1
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() =>
											handleCourseSelect("Courses 2")
										}
									>
										Courses 2
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() =>
											handleCourseSelect("Courses 3")
										}
									>
										Courses 3
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<Form.Control
								type="text"
								className="form-control border-light" // Added form-control class
								style={{ padding: "30px 25px" }}
								placeholder="Keyword"
							/>
							<Button variant="secondary" className="px-4 px-lg-5">
								Search
							</Button>
						</InputGroup>
					</div> */}
				</Container>
			</div>

			{/* LOADER SPINNER */}
			{/* {Object.keys(course).length === 0 && (
				<ColorRing
					visible={true}
					height="80"
					width="80"
					ariaLabel="blocks-loading"
					wrapperStyle={{ display: "block", margin: "auto" }}
					wrapperClass="blocks-wrapper"
					colors={["#F5F5F5", "#313236", "#7CD6EA", "#172765", "#F5F5F5"]}
				/>
			)} */}
			{/* END LOADER SPINNER */}
			{course != null && (
				<Container fluid className="py-5">
					<Container className="py-5">
						<Row>
							<Col lg={8}>
								<div className="mb-5">
									<div className="section-title position-relative mb-5">
										<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
											Course Detail
										</h6>
										<h1 className="display-4">
											{course.name}
										</h1>
									</div>
									<Image
										src={`http://localhost:8080/uploads/courses/${course.thumbnail}`}
										rounded
										className="w-75 mb-4"
										alt={course.name}
									/>
									<p
										dangerouslySetInnerHTML={{
											__html: course.description,
										}}
									/>
								</div>
							</Col>

							<Col lg={4} className="mt-5 mt-lg-0">
								<div className="bg-primary mb-5 py-3">
									<h3 className="text-white py-3 px-4 m-0">
										Course Features
									</h3>
									<div className="d-flex justify-content-between border-bottom px-4">
										<h6 className="text-white my-3">
											Instructor
										</h6>
										<h6 className="text-white my-3">
											{course.account.name}
										</h6>
									</div>
									<div className="d-flex justify-content-between border-bottom px-4">
										<h6 className="text-white my-3">
											Rating
										</h6>
										<h6 className="text-white my-3">
											{/* {course.rating}{" "}
											<small>({course.reviews})</small> */}
											===Rating==={" "}
										</h6>
									</div>
									<div className="d-flex justify-content-between border-bottom px-4">
										<h6 className="text-white my-3">
											Lectures
										</h6>
										<h6 className="text-white my-3">
											==Lectures==
										</h6>
									</div>
									<div className="d-flex justify-content-between border-bottom px-4">
										<h6 className="text-white my-3">
											Duration
										</h6>
										<h6 className="text-white my-3">
											{course.duration}
										</h6>
									</div>
									<h5 className="text-white py-3 px-4 m-0">
										Course Price: {course.price} VND
									</h5>
									<div className="py-3 px-4">
										<Link
											className="btn btn-block btn-secondary py-3 px-5"
											to={"#"}
										>
											Enroll Now
										</Link>
									</div>
								</div>
							</Col>
						</Row>
						<h2 className="mb-3">Related Courses</h2>

						<OwlCarousel
							className="related-carousel position-relative"
							style={{ padding: "0 30px" }}
							responsive={carouselResp}
							margin={1}
							autoplay
						>
							{/* LOADER SPINNER */}
							{moreCourses.length === 0 && (
								<ColorRing
									visible={true}
									height="80"
									width="80"
									ariaLabel="blocks-loading"
									wrapperStyle={{
										display: "block",
										margin: "auto",
									}}
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

							{moreCourses.length > 0 &&
								moreCourses.map((item, index) => {
									return (
										<Link
											key={index}
											className="courses-list-item position-relative d-block overflow-hidden mb-2"
											onClick={(event) => {
												// event.preventDefault();
												fetchCourse(item.id);
											}}
											to={`/courses/${item.id}`}
										>
											<Image
												fluid
												src={`http://localhost:8080/uploads/courses/${item.thumbnail}`}
												alt={item.name}
											/>
											<div className="courses-text">
												<h4 className="text-center text-white px-3">
													{item.name}
												</h4>
												<div className="border-top w-100 mt-3">
													<div className="d-flex justify-content-between p-4">
														<span className="text-white">
															<i className="fa-solid fa-chalkboard-user mr-2"></i>
															{
																item
																	.account
																	.name
															}
														</span>
														{/* <span className="text-white">
															<i className="fa fa-star mr-2"></i>
															{course.rating}{" "}
															<small>
																(
																{course.reviews}
																)
															</small>{" "}
														</span> */}
													</div>
												</div>
											</div>
										</Link>
									);
								})}
						</OwlCarousel>
					</Container>
				</Container>
			)}
		</>
	);
}

export default CourseDetailPage;
