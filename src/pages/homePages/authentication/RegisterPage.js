import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";
import { DataContext } from "../../../contexts/DataContext";

const phoneF = /^\+?[0-9]\d{9}$/;

const schema = yup
	.object()
	.shape({
		fullName: yup.string().required("Full name cannot be blank!"),
		token: yup.string().required("Token cannot be blank!"),
		password: yup
			.string()
			.required("Password cannot be blank!")
			.min(6, "Password must be at least 6 characters"),
		confirmPassword: yup
			.string()
			.required("Confirm password cannot be blank!")
			.oneOf([yup.ref("password")], "Passwords do not match"),
		phone: yup
			.string()
			.required("Phone cannot be blank!")
			.matches(phoneF, "Phone number is not valid"),
		email: yup
			.string()
			.email("Wrong format email address")
			.required("Email cannot be blank!"),
		dob: yup
			.date()
			.typeError("Invalid Date Format")
			.required("Register Date cannot be blank!")
			.test("minAge", "You must be at least 6 years old to register", (value) => {
				if (!value) return true;
				const currentDate = new Date();
				const birthDate = new Date(value);
				return currentDate.getFullYear() - birthDate.getFullYear() >= 6;
			}),
	})
	.required();

function RegisterPage(props) {
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
		trigger,
		setError,
		getValues,
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});
	const { alert, showAlert } = useContext(DataContext);
	const navigate = useNavigate();
	const [showOtpInput, setShowOtpInput] = useState(false);
	const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
	const [submissionStep, setSubmissionStep] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSendEmailVerif = async () => {
		try {
			const isValidEmail = await trigger("email");

			if (!isValidEmail) {
				return;
			}
			setOtpSent(true);
			setIsSubmitting(true);
			setSubmissionStep("Reviewing...");
			const emailValue = getValues("email");
			console.log("Email: ", emailValue);
			await axios
				.post(
					`http://localhost:8080/api/accounts/verif_email?email=${emailValue.trim()}`
				)
				.then((res) => {
					if (res.status == 200) {
						// setEmail(emailValue);
						setShowOtpInput(true);
						setIsSubmitting(false);
						setSubmissionStep("OTP Sent");
					}
				});
		} catch (error) {
			if (error.status == 409) {
				setOtpSent(false);
				setIsSubmitting(false);
				setSubmissionStep("Send OTP");
				const errorMessage = error.response.data; // Get the error message from the server
				setError("email", { type: "manual", message: errorMessage });
				return;
			}
			console.error("Error Sending Verificate Email:", error);
		}
	};

	async function onSubmit(data) {
		const formattedDate = data.dob.toISOString().split("T")[0]; // Format to YYYY-MM-DD
		const formData = new FormData();
		formData.append("name", data.fullName);
		formData.append("password", data.password);
		formData.append("token", data.token);
		formData.append("dob", formattedDate);
		formData.append("email", data.email);
		formData.append("phone", data.phone);
		formData.append("role", "USER");
		try {
			const defaultAvatarResponse = await fetch("/assets/images/team-1.jpg"); // Fetch the default avatar
			if (!defaultAvatarResponse.ok) {
				throw new Error("Failed to fetch default avatar"); // Handle fetch errors
			}

			const blob = await defaultAvatarResponse.blob(); // Get the image as a Blob
			formData.append("avatar", blob, "team-1.jpg");
		} catch (error) {
			console.error("Error during registration:", error);
		}

		await axios
			.post("http://localhost:8080/api/accounts/create", formData)
			.then((res) => {
				if (res.status == 201) {
					showAlert("success", "REGISTER SUCCESSFULLY!");
					navigate("/login");
				}
			})
			.catch((error) => {
				if (error.status == 403) {
					showAlert("warning", "Wrong OTP Token!");
				} else {
					console.log("Something went wrong", error);
					showAlert(
						"danger",
						"An unexpected error occurred. Please try again later."
					);
				}
			});
	}

	useEffect(() => {
		AOS.init({
			duration: 1500,
		});
	}, []);

	return (
		<div className="container-fluid bg-image">
			{alert.type != "" && (
				<Alert
					variant={alert.type}
					dismissible
					transition
					className="position-fixed bottom-0 end-0"
					style={{ width: "fit-content", zIndex: 9999 }}
				>
					{alert.message}
				</Alert>
			)}
			<Container className="py-5" data-aos="flip-left">
				<Row className="d-flex justify-content-center align-items-center h-100 my-5 py-5">
					<Col xl={10}>
						<Card style={{ borderRadius: "1rem" }}>
							<Row className="g-0">
								<Col md={6} lg={5} className="d-none d-md-block">
									<Card.Img
										src="/assets/images/courses-6.jpg" // Your image path
										alt="registration form"
										className="img-fluid"
										style={{
											borderRadius: "1rem 0 0 1rem",
										}}
									/>
									<p
										className="mb-5 pb-lg-2 mt-4"
										style={{ color: "#393f81" }}
									>
										Already have an account?{" "}
										<Link
											to={"/login"}
											style={{
												color: "#393f81",
											}}
										>
											Login here
										</Link>
									</p>
								</Col>
								<Col
									md={6}
									lg={7}
									className="d-flex align-items-center"
								>
									<Card.Body className="p-4 p-lg-5 text-black">
										<Form onSubmit={handleSubmit(onSubmit)}>
											{/* Your Logo */}
											{/* <div className="d-flex align-items-center mb-3 pb-1">
												<span className="h1 fw-bold mb-0">
													Logo
												</span>
											</div> */}

											<h5
												className="fw-normal mb-3 pb-3"
												style={{
													letterSpacing: "1px",
												}}
											>
												Sign Up
											</h5>
											<Row>
												<Form.Group className="mb-3 col-6">
													<Form.Label>
														Full Name
													</Form.Label>
													<Form.Control
														type="text"
														placeholder="Enter Full Name"
														{...register(
															"fullName"
														)}
													/>
													<span className="text-danger">
														{
															errors
																.fullName
																?.message
														}
													</span>
												</Form.Group>

												<Form.Group className="mb-3 col-6">
													<Form.Label>
														Phone Number
													</Form.Label>
													<Form.Control
														type="text"
														placeholder="Enter Phone Number"
														{...register(
															"phone"
														)}
													/>
													<span className="text-danger">
														{
															errors
																.phone
																?.message
														}
													</span>
												</Form.Group>
											</Row>

											<Form.Group className="mb-3">
												<Form.Label>
													Date of Birth
												</Form.Label>
												<Form.Control
													type="date" // Use type="date" for date input
													{...register("dob")}
												/>
												<span className="text-danger">
													{errors.dob?.message}
												</span>
											</Form.Group>

											<Row>
												<Form.Group className="mb-3 col-6">
													<Form.Label>
														Password
													</Form.Label>
													<Form.Control
														type="password"
														placeholder="Enter Password"
														{...register(
															"password"
														)}
													/>
													<span className="text-danger">
														{
															errors
																.password
																?.message
														}
													</span>
												</Form.Group>
												<Form.Group className="mb-3 col-6">
													<Form.Label>
														Confirm Password
													</Form.Label>
													<Form.Control
														type="password"
														placeholder="Confirm Password"
														{...register(
															"confirmPassword"
														)}
													/>
													<span className="text-danger">
														{
															errors
																.confirmPassword
																?.message
														}
													</span>
												</Form.Group>
											</Row>

											<Form.Label>
												Email Address
											</Form.Label>
											<Form.Group className="mb-3 row">
												<Form.Control
													className="col-8"
													type="text"
													id="email"
													placeholder="Enter Email Address"
													{...register("email")}
												/>
												<Button
													className="col-4"
													variant="outline-primary"
													onClick={
														handleSendEmailVerif
													}
													disabled={otpSent}
												>
													{isSubmitting ? (
														<>
															<Spinner
																as="span"
																animation="border"
																size="sm"
																role="status"
																aria-hidden="true"
															/>{" "}
															{
																submissionStep
															}
														</>
													) : (
														"Send OTP"
													)}
												</Button>
												<span className="text-danger">
													{
														errors.email
															?.message
													}
												</span>
											</Form.Group>

											{showOtpInput && (
												<Form.Group className="mb-3 row">
													<Form.Label>
														OTP Token
													</Form.Label>
													<Form.Control
														type="text"
														className="col-8"
														{...register(
															"token"
														)}
													/>
													<Button
														className="col-4"
														variant="outline-primary"
														onClick={
															handleSendEmailVerif
														}
														disabled={
															otpSent
														}
													>
														{isSubmitting ? (
															<>
																<Spinner
																	as="span"
																	animation="border"
																	size="sm"
																	role="status"
																	aria-hidden="true"
																/>{" "}
																{
																	submissionStep
																}
															</>
														) : (
															"Resend"
														)}
													</Button>
													<span className="text-danger">
														{
															errors
																.token
																?.message
														}
													</span>
												</Form.Group>
											)}

											<Button
												variant="primary"
												type="submit"
												// disabled={!isValid}
											>
												Sign Up
											</Button>
										</Form>
									</Card.Body>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default RegisterPage;
