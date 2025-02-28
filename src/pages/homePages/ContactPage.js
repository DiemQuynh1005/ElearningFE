import React from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

function ContactPage(props) {
	return (
		<div>
			{/* Header Start */}
			<div
				className="jumbotron jumbotron-fluid page-header position-relative overlay-bottom"
				style={{ marginBottom: "90px" }}
			>
				<div className="container text-center py-5">
					<h1 className="text-white display-1">Contact</h1>
				</div>
			</div>
			{/* Header End */}

			{/* Contact Start */}
			<Container fluid className="py-5">
				<Container className="py-5">
					<Row className="align-items-center">
						<Col lg={5} className="mb-5 mb-lg-0">
							<div
								className="bg-light d-flex flex-column justify-content-center px-5"
								style={{ height: "450px" }}
							>
								<div className="d-flex align-items-center mb-5">
									<div className="btn-icon bg-primary mr-4">
										<i className="fa fa-2x fa-map-marker-alt text-white"></i>
									</div>
									<div className="mt-n1">
										<h4>Our Location</h4>
										<p className="m-0">
											123 Street, New York, USA
										</p>
									</div>
								</div>
								<div className="d-flex align-items-center mb-5">
									<div className="btn-icon bg-secondary mr-4">
										<i className="fa fa-2x fa-phone-alt text-white"></i>
									</div>
									<div className="mt-n1">
										<h4>Call Us</h4>
										<p className="m-0">+012 345 6789</p>
									</div>
								</div>
								<div className="d-flex align-items-center">
									<div className="btn-icon bg-warning mr-4">
										<i className="fa fa-2x fa-envelope text-white"></i>
									</div>
									<div className="mt-n1">
										<h4>Email Us</h4>
										<p className="m-0">info@example.com</p>
									</div>
								</div>
							</div>
						</Col>
						<Col lg={7}>
							<div className="section-title position-relative mb-4">
								<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
									Need Help?
								</h6>
								<h1 className="display-4">Send Us A Message</h1>
							</div>
							<div className="contact-form">
								<Form>
									<Row>
										<Col xs={6} className="form-group">
											<Form.Control
												type="text"
												className="border-top-0 border-right-0 border-left-0 p-0"
												placeholder="Your Name"
												name="name"
												required
											/>
										</Col>
										<Col xs={6} className="form-group">
											<Form.Control
												type="email"
												className="border-top-0 border-right-0 border-left-0 p-0"
												placeholder="Your Email"
												name="email"
												required
											/>
										</Col>
									</Row>
									<Form.Group className="form-group">
										<Form.Control
											type="text"
											className="border-top-0 border-right-0 border-left-0 p-0"
											placeholder="Subject"
											name="subject"
											required
										/>
									</Form.Group>
									<Form.Group className="form-group">
										<Form.Control
											as="textarea"
											className="border-top-0 border-right-0 border-left-0 p-0"
											rows="5"
											placeholder="Message"
											name="message"
											required
										/>
									</Form.Group>
									<div>
										<Button
											variant="primary"
											type="submit"
											className="py-3 px-5"
										>
											Send Message
										</Button>
									</div>
								</Form>
							</div>
						</Col>
					</Row>
				</Container>
			</Container>
			{/* Contact End */}
		</div>
	);
}

export default ContactPage;
