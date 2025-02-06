import React, { useCallback, useContext, useEffect, useState } from "react";
import {
	Button,
	Col,
	Container,
	Form,
	InputGroup,
	Nav,
	Navbar,
	NavDropdown,
	Offcanvas,
	Row,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { DataContext } from "../contexts/DataContext";
// import("../css/animate.css");
import("../css/home.css");

function HomepageLayout({ children }) {
	const [showButton, setShowButton] = useState(false);
	const { auth, logout } = useContext(DataContext);

	const switchLink = useCallback(() => {
		switch (auth?.role) {
			case "ADMIN":
				return (
					<Navbar.Text style={{ padding: "0" }}>
						<span className="d-inline-block">ADMIN:</span>
						<Link className="nav-link d-inline-block" to={"/dashboard"}>
							TO DASHBOARD
						</Link>
					</Navbar.Text>
				);
			case "USER":
				return (
					<NavDropdown
						id="navbarDropdown"
						title={
							<i
								className="fa-solid fa-circle-user"
								style={{ marginTop: "0.3em" }}
							></i>
						}
						// menuVariant="dark"
						className="nav-item dropdown"
					>
						<NavDropdown.Item style={{ padding: "0" }}>
							<Link className="dropdown-item" to={`/${auth?.userName}`}>
								<i className="fas fa-user me-2"></i>
								PROFILE
							</Link>
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item style={{ padding: "0" }}>
							<Link
								className="dropdown-item"
								to={`/${auth?.userName}/transaction`}
							>
								<i className="fa-solid fa-clock-rotate-left me-2"></i>
								TRANSACTION
							</Link>
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item style={{ padding: "0" }}>
							<span
								className="ms-3"
								onClick={() => {
									if (
										window.confirm(
											"Are you sure you want to log out?"
										)
									) {
										logout();
									}
								}}
							>
								<i className="fas fa-sign-out me-2"></i>
								LOG OUT
							</span>
						</NavDropdown.Item>
					</NavDropdown>
				);
			default:
				return (
					// <Navbar.Text>
					<Link
						className="btn btn-primary py-2 px-4 d-none d-lg-block"
						to={"/login"}
						style={{ fontSize: "0.85rem" }}
					>
						{/* <i
								className="fa fa-user-circle me-2"
								style={{ fontSize: "0.85rem" }}
							></i> */}
						SIGN IN
					</Link>
					// </Navbar.Text>
				);
		}
	}, [auth]);

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 200) {
				setShowButton(true);
			} else {
				setShowButton(false);
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);
	const handleButtonClick = () => {
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<div className="homepageLayout">
			<header className="container-fluid p-0">
				<Navbar fixed="top" expand="lg" bg="white" variant="light">
					<Container className="d-flex justify-content-around align-items-center">
						<Navbar.Brand
							className="d-flex align-items-center"
							style={{ flex: "0 1 auto" }}
						>
							<Link to={"/"} className="text-decoration-none">
								<h1 className="m-0 text-uppercase text-primary">
									<i className="fa fa-book-reader mr-3"></i>
									Edukate
								</h1>
							</Link>
						</Navbar.Brand>

						<Navbar.Toggle aria-controls="basic-navbar-nav" />
						<Navbar.Offcanvas
							id="basic-navbar-nav"
							aria-labelledby="basic-navbar-nav"
							placement="end"
						>
							<Offcanvas.Header closeButton>
								<Offcanvas.Title id="basic-navbar-nav">
									<h1 className="m-0 text-uppercase text-primary">
										<i className="fa fa-book-reader mr-3"></i>
										Edukate
									</h1>
								</Offcanvas.Title>
							</Offcanvas.Header>
							<Offcanvas.Body>
								<Nav
									className="justify-content-end flex-grow-1 pe-3"
									style={{ flex: "1" }}
								>
									<Link
										to={"/"}
										className="nav-link"
										style={{ fontSize: "0.85rem" }}
									>
										Home
									</Link>
									<Link
										to={"/about"}
										className="nav-link"
										style={{ fontSize: "0.85rem" }}
									>
										About
									</Link>
									<Link
										to={"/courses"}
										className="nav-link"
										style={{ fontSize: "0.85rem" }}
									>
										Courses
									</Link>
									{/* <NavDropdown
										title={
											<span
												style={{
													fontSize: "0.85rem",
												}}
											>
												Pages
											</span>
										}
										className="d-flex align-items-center"
									>
										<Link
											to="/detail"
											className="dropdown-item"
										>
											Course Detail
										</Link>
										<Link
											to="/feature"
											className="dropdown-item"
										>
											Our Features
										</Link>
										<Link
											to="/team"
											className="dropdown-item"
										>
											Instructors
										</Link>
										<Link
											to="/testimonial"
											className="dropdown-item"
										>
											Testimonial
										</Link>
									</NavDropdown> */}
									<Link
										to={"/contact"}
										className="nav-link"
										style={{ fontSize: "0.85rem" }}
									>
										Contact
									</Link>
								</Nav>
								{/* <Link
									to="/join"
									className="btn btn-primary py-2 px-4 d-none d-lg-block"
									style={{ fontSize: "0.85rem" }}
								>
									Join Us
								</Link> */}
								{switchLink()}
							</Offcanvas.Body>
						</Navbar.Offcanvas>
					</Container>
				</Navbar>
			</header>
			{/* <!-- ***** Header Area End ***** --> */}

			<main role="main">{children}</main>

			<footer
				className="container-fluid position-relative overlay-top bg-dark text-white-50 py-5"
				style={{ marginTop: "90px" }}
			>
				<Container className="mt-5 pt-5">
					<Row>
						<Col md={6} className="mb-5">
							<Link to="/" className="navbar-brand">
								<h1 className="mt-n2 text-uppercase text-white">
									<i className="fa fa-book-reader mr-3"></i>
									Edukate
								</h1>
							</Link>
							<p className="m-0">
								Accusam nonumy clita sed rebum kasd eirmod elitr.
								Ipsum ea lorem at et diam est, tempor rebum ipsum
								sit ea tempor stet et consetetur dolores. Justo stet
								diam ipsum lorem vero clita diam
							</p>
						</Col>
						<Col md={6} className="mb-5">
							<h3 className="text-white mb-4">Newsletter</h3>
							<div className="w-100">
								<InputGroup>
									<Form.Control
										type="email" // Use type="email" for email input
										className="border-light"
										style={{ padding: "30px" }}
										placeholder="Your Email Address"
									/>
									<Button variant="primary" className="px-4">
										Sign Up
									</Button>
								</InputGroup>
							</div>
						</Col>
					</Row>
					<Row>
						<Col md={4} className="mb-5">
							<h3 className="text-white mb-4">Get In Touch</h3>
							<p>
								<i className="fa fa-map-marker-alt mr-2"></i>123
								Street, New York, USA
							</p>
							<p>
								<i className="fa fa-phone-alt mr-2"></i>+012 345
								67890
							</p>
							<p>
								<i className="fa fa-envelope mr-2"></i>
								info@example.com
							</p>
							<div className="d-flex justify-content-start mt-4">
								<a className="text-white mr-4" href="#">
									<i className="fab fa-2x fa-twitter"></i>
								</a>
								<a className="text-white mr-4" href="#">
									<i className="fab fa-2x fa-facebook-f"></i>
								</a>
								<a className="text-white mr-4" href="#">
									<i className="fab fa-2x fa-linkedin-in"></i>
								</a>
								<a className="text-white" href="#">
									<i className="fab fa-2x fa-instagram"></i>
								</a>
							</div>
						</Col>
						<Col md={4} className="mb-5">
							<h3 className="text-white mb-4">Our Courses</h3>
							<div className="d-flex flex-column justify-content-start">
								<Link to="#" className="text-white-50 mb-2">
									{" "}
									{/* Use Link component */}
									<i className="fa fa-angle-right mr-2"></i>Web
									Design
								</Link>
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>Apps
									Design
								</Link>
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>
									Marketing
								</Link>
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>
									Research
								</Link>
								<Link to="#" className="text-white-50">
									<i className="fa fa-angle-right mr-2"></i>SEO
								</Link>
							</div>
						</Col>
						<Col md={4} className="mb-5">
							<h3 className="text-white mb-4">Quick Links</h3>
							<div className="d-flex flex-column justify-content-start">
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>
									Privacy Policy
								</Link>
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>
									Terms & Condition
								</Link>
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>
									Regular FAQs
								</Link>
								<Link to="#" className="text-white-50 mb-2">
									<i className="fa fa-angle-right mr-2"></i>Help
									& Support
								</Link>
								<Link to="#" className="text-white-50">
									<i className="fa fa-angle-right mr-2"></i>
									Contact
								</Link>
							</div>
						</Col>
					</Row>
				</Container>
			</footer>
			<div
				className="container-fluid bg-dark text-white-50 border-top py-4"
				style={{ borderColor: "rgba(256, 256, 256, .1) !important" }}
			>
				<Container>
					<Row>
						<Col md={6} className="text-center text-md-left mb-3 mb-md-0">
							<p className="m-0">
								Copyright &copy;{" "}
								<Link to="#" className="text-white">
									Your Site Name
								</Link>
								. All Rights Reserved.
							</p>
						</Col>
						<Col md={6} className="text-center text-md-right">
							<p className="m-0">
								Designed by{" "}
								<a
									className="text-white"
									href="https://htmlcodex.com"
								>
									HTML Codex
								</a>
							</p>
						</Col>
					</Row>
				</Container>
			</div>
			<Link
				onClick={handleButtonClick}
				style={{ display: showButton ? "block" : "none" }}
				className="btn btn-lg btn-primary rounded-0 btn-lg-square back-to-top"
			>
				<i title="Go to top" className="fa fa-angle-double-up"></i>
			</Link>
		</div>
	);
}

export default HomepageLayout;
