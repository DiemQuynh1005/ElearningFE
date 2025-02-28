import React, { useContext, useEffect, useState } from "react";
import { Accordion, Button, Carousel, Col, Container, Form, Row } from "react-bootstrap";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { ColorRing } from "react-loader-spinner";
import { Link } from "react-router-dom";
import { DataContext } from "../../contexts/DataContext";

function Homepage(props) {
	const carouselRespCourse = {
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

	const { courses } = useContext(DataContext);

	useEffect(() => {
		AOS.init();
	}, []);

	return (
		<div>
			<div
				className="jumbotron jumbotron-fluid position-relative overlay-bottom"
				style={{ marginBottom: "90px" }}
			>
				<Container className="text-center my-5 py-5">
					<h1 className="text-white mt-4 mb-4">Learn From Home</h1>
					<h1 className="text-white display-1 mb-5">Education Courses</h1>
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
							<Form.Control // Import Form
								type="text"
								className="border-light"
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
			{/* <!-- About Start --> */}
			<Container className="container-fluid py-5">
				<Row>
					<Col lg={5} className="mb-5 mb-lg-0" style={{ minHeight: "500px" }}>
						<div className="position-relative h-100">
							<img
								className="position-absolute w-100 h-100"
								src="../assets/images/about.jpg"
								style={{ objectFit: "cover" }}
								alt="About" // Add alt text for accessibility
							/>
						</div>
					</Col>
					<Col lg={7}>
						<div className="section-title position-relative mb-4">
							<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
								About Us
							</h6>
							<h1 className="display-4">
								First Choice For Online Education Anywhere
							</h1>
						</div>
						<Accordion defaultActiveKey="0">
							<Accordion.Item eventKey="0">
								<Accordion.Header>
									Where shall we begin?
								</Accordion.Header>
								<Accordion.Body>
									Dolor <strong>almesit amet</strong>,
									consectetur adipiscing elit, sed doesn't
									eiusmod tempor incididunt ut labore
									consectetur <code>adipiscing</code> elit, sed
									do eiusmod tempor incididunt ut labore et
									dolore magna aliqua. Quis ipsum suspendisse
									ultrices gravida.
								</Accordion.Body>
							</Accordion.Item>

							<Accordion.Item eventKey="1">
								<Accordion.Header>
									How do we work together?
								</Accordion.Header>
								<Accordion.Body>
									Dolor <strong>almesit amet</strong>,
									consectetur adipiscing elit, sed doesn't
									eiusmod tempor incididunt ut labore
									consectetur <code>adipiscing</code> elit, sed
									do eiusmod tempor incididunt ut labore et
									dolore magna aliqua. Quis ipsum suspendisse
									ultrices gravida.
								</Accordion.Body>
							</Accordion.Item>
						</Accordion>
					</Col>
				</Row>
			</Container>
			{/* <!-- About End --> */}

			{/* <!-- Feature Start --> */}
			<div className="container-fluid bg-image" style={{ margin: "90px auto" }}>
				<Container>
					<Row>
						<Col lg={7} className="my-5 pt-5 pb-lg-5">
							<div className="section-title position-relative mb-4">
								<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
									Why Choose Us?
								</h6>
								<h1 className="display-4">
									Why You Should Start Learning with Us?
								</h1>
							</div>
							<p className="mb-4 pb-2">
								Aliquyam accusam clita nonumy ipsum sit sea clita
								ipsum clita, ipsum dolores amet voluptua duo dolores
								et sit ipsum rebum, sadipscing et erat eirmod diam
								kasd labore clita est. Diam sanctus gubergren sit
								rebum clita amet.
							</p>
							<div className="d-flex mb-3">
								<div className="btn-icon bg-primary mr-4">
									<i className="fa fa-2x fa-graduation-cap text-white"></i>
								</div>
								<div className="mt-n1">
									<h4>Skilled Instructors</h4>
									<p>
										Labore rebum duo est Sit dolore eos sit
										tempor eos stet, vero vero clita magna
										kasd no nonumy et eos dolor magna ipsum.
									</p>
								</div>
							</div>
							<div className="d-flex mb-3">
								<div className="btn-icon bg-secondary mr-4">
									<i className="fa fa-2x fa-certificate text-white"></i>
								</div>
								<div className="mt-n1">
									<h4>International Certificate</h4>
									<p>
										Labore rebum duo est Sit dolore eos sit
										tempor eos stet, vero vero clita magna
										kasd no nonumy et eos dolor magna ipsum.
									</p>
								</div>
							</div>
							<div className="d-flex">
								<div className="btn-icon bg-warning mr-4">
									<i className="fa fa-2x fa-book-reader text-white"></i>
								</div>
								<div className="mt-n1">
									<h4>Online Classes</h4>
									<p className="m-0">
										Labore rebum duo est Sit dolore eos sit
										tempor eos stet, vero vero clita magna
										kasd no nonumy et eos dolor magna ipsum.
									</p>
								</div>
							</div>
						</Col>
						<Col lg={5} style={{ minHeight: "500px" }}>
							<div className="position-relative h-100">
								<img
									className="position-absolute w-100 h-100"
									src="../assets/images/feature.jpg"
									style={{ objectFit: "cover" }}
									alt="Feature"
								/>
							</div>
						</Col>
					</Row>
				</Container>
			</div>
			{/*Feature End */}

			{/* Courses Start */}
			<div className="container-fluid px-0 py-5">
				<Row className="mx-0 justify-content-center pt-5">
					<Col lg={6}>
						<div className="section-title text-center position-relative mb-4">
							<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
								Our Courses
							</h6>
							<h1 className="display-4">
								Checkout New Releases Of Our Courses
							</h1>
						</div>
					</Col>
				</Row>

				{/* LOADER SPINNER */}
				{courses.length == 0 && (
					<ColorRing
						visible={true}
						height="80"
						width="80"
						ariaLabel="blocks-loading"
						wrapperStyle={{ display: "block", margin: "auto" }}
						wrapperClass="blocks-wrapper"
						colors={["#F5F5F5", "#313236", "#7CD6EA", "#172765", "#F5F5F5"]}
					/>
				)}
				{/* END LOADER SPINNER */}
				{courses.length > 0 && (
					<OwlCarousel
						className="courses-carousel"
						responsive={carouselRespCourse}
						// loop
						margin={1}
						autoplay
						// autoplayTimeout={3000}
						// dots={true}
					>
						{courses.length > 0 &&
							courses.map((course, index) => {
								return (
									<div
										className="courses-item position-relative"
										key={index}
									>
										<img
											className="img-fluid"
											src={`http://localhost:8080/uploads/courses/${course.thumbnail}`}
											alt={`${course.thumbnail}-img`}
										/>
										<div className="courses-text">
											<h4 className="text-center text-white px-3">
												{course.name}
											</h4>
											<div className="border-top w-100 mt-3">
												<div className="d-flex justify-content-between p-4">
													<span className="text-white">
														<i className="fa-solid fa-chalkboard-user mr-2"></i>
														{
															course
																.account
																.name
														}
													</span>
													{/* <span className="text-white">
														<i className="fa fa-star mr-2"></i>
														4.5{" "}
														<small>
															(250)
														</small>
													</span> */}
												</div>
											</div>
											<div className="w-100 bg-white text-center p-4">
												<Link
													className="btn btn-primary"
													to={`/courses/${course.id}`}
												>
													Course Detail
												</Link>
											</div>
										</div>
									</div>
								);
							})}
					</OwlCarousel>
				)}
			</div>
			{/* Courses End */}

			{/* Enroll Form Start */}
			<Row className="justify-content-center bg-image mx-0 mb-5">
				<Col lg={6} className="py-5">
					<div className="bg-white p-5 my-5">
						<h1 className="text-center mb-4">30% Off For New Students</h1>
						<Form>
							<Row className="form-row">
								<Col sm={6}>
									<Form.Group>
										<Form.Control
											type="text"
											className="bg-light border-0 fo"
											placeholder="Your Name"
											style={{ padding: "30px 20px" }}
										/>
									</Form.Group>
								</Col>
								<Col sm={6}>
									<Form.Group>
										<Form.Control
											type="email"
											className="bg-light border-0"
											placeholder="Your Email"
											style={{ padding: "30px 20px" }}
										/>
									</Form.Group>
								</Col>
							</Row>
							<Row className="form-row">
								<Col sm={6}>
									<Form.Group>
										<Form.Control
											as="select"
											className="bg-light border-0 px-3"
											style={{ height: "60px" }}
										>
											<option>Select A courses</option>
											<option value="1">
												courses 1
											</option>
											<option value="2">
												courses 2
											</option>
											<option value="3">
												courses 3
											</option>
										</Form.Control>
									</Form.Group>
								</Col>
								<Col sm={6}>
									<Button
										variant="primary"
										style={{ height: "60px" }}
										type="submit"
									>
										Sign Up Now
									</Button>
								</Col>
							</Row>
						</Form>
					</div>
				</Col>
			</Row>
			{/* Enroll Form End */}

			<div className="container-fluid bg-image py-5" style={{ margin: "90px 0" }}>
				<Container className="py-5">
					<Row className="align-items-center">
						<Col lg={5} className="mb-5 mb-lg-0">
							<div className="section-title position-relative mb-4">
								<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
									Testimonial
								</h6>
								<h1 className="display-4">What Say Our Students</h1>
							</div>
							<p className="m-0">
								Dolor est dolores et nonumy sit labore dolores est
								sed rebum amet, justo duo ipsum sanctus dolore magna
								rebum sit et. Diam lorem ea sea at. Nonumy et at at
								sed justo est nonumy tempor. Vero sea ea eirmod,
								elitr ea amet diam ipsum at amet. Erat sed stet eos
								ipsum diam
							</p>
						</Col>
						<Col lg={7}>
							<OwlCarousel
								className="testimonial-carousel"
								items={1}
								loop
								autoplay
							>
								{[1, 2].map(
									(
										i // Map for testimonials
									) => (
										<div className="bg-white p-5" key={i}>
											{" "}
											{/* Added key prop */}
											<i className="fa fa-3x fa-quote-left text-primary mb-4"></i>
											<p>
												Sed et elitr ipsum labore
												dolor diam, ipsum duo vero
												sed sit est est ipsum eos
												clita est ipsum. Est nonumy
												tempor at kasd. Sed at dolor
												duo ut dolor, et justo erat
												dolor magna sed stet amet
												elitr duo lorem
											</p>
											<div className="d-flex flex-shrink-0 align-items-center mt-4">
												<img
													className="img-fluid mr-4"
													src={`img/testimonial-${i}.jpg`}
													alt={`Testimonial ${i}`}
												/>{" "}
												{/* Dynamic image src and alt */}
												<div>
													<h5>
														Student Name {i}
													</h5>{" "}
													{/* Added dynamic name */}
													<span>
														Web Design
													</span>
												</div>
											</div>
										</div>
									)
								)}
							</OwlCarousel>
						</Col>
					</Row>
				</Container>
			</div>
		</div>
	);
}

export default Homepage;
