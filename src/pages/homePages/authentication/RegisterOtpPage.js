import React, { useEffect, useRef, useState } from "react";
import { Container, Row, Col, Card, Form, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import AOS from "aos";
import "aos/dist/aos.css";

const schema = yup
	.object()
	.shape({
		email: yup
			.string()
			.email("Wrong format email address")
			.required("Email cannot be blank!"),
	})
	.required();

function RegisterOtpPage(props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
		trigger,
		setError,
		getValues,
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const otpInputs = useRef([]);
	const [isChanging, setIsChanging] = useState(false);
	const [showOtpInput, setShowOtpInput] = useState(false);
	const [otpSent, setOtpSent] = useState(false); // Track if OTP has been sent
	const [verificationError, setVerificationError] = useState(null);
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
						setEmail(emailValue); // Get the email value
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

	const handleOtpChange = (index, value) => {
		if (isChanging) return; // Prevent re-focusing during state update

		setIsChanging(true); // Set the flag

		const newOtp = [...otp];
		const sanitizedValue = value.replace(/[^0-9]/g, "").slice(0, 1);
		newOtp[index] = sanitizedValue;
		setOtp(newOtp);

		if (sanitizedValue !== "" && otpInputs.current[index + 1]) {
			setTimeout(() => {
				// Ensure focus moves after input update
				otpInputs.current[index + 1].focus();
				setIsChanging(false); // Reset the flag
			}, 0);
		} else {
			setIsChanging(false); // Reset the flag if no focus change
		}
	};

	const handleVerifyOtp = async () => {
		const enteredOtp = otp.join(""); // Combine the OTP digits
		try {
			const sentData = {
				email: email,
				token: enteredOtp,
			};
			console.log("Data: ", sentData);

			const res = await axios.post(
				"http://localhost:8080/api/accounts/verif_token",
				sentData
			);
			if (res.status == 200) {
				localStorage.setItem("verifiedEmail", email);
				navigate("/register/next-step");
			}
		} catch (error) {
			if (error.response && error.response.status === 400) {
				setVerificationError("Wrong OTP Token");
			} else {
				console.error("Error verifying OTP:", error);
			}
		}
	};

	useEffect(() => {
		AOS.init();
		if (otpInputs.current[0]) {
			otpInputs.current[0].focus();
		}
	}, []);

	return (
		<div className="container-fluid bg-image">
			<Container className="py-5" data-aos="flip-left">
				<Row className="d-flex justify-content-center align-items-center h-100 my-5 py-5">
					<Col xl={10}>
						<Card style={{ borderRadius: "1rem" }}>
							<Row className="g-0">
								<Col md={6} lg={5} className="d-none d-md-block">
									<Card.Img
										src="/assets/images/courses-6.jpg"
										alt="login form"
										className="img-fluid"
										style={{
											borderRadius: "1rem 0 0 1rem",
										}}
									/>
								</Col>
								<Col
									md={6}
									lg={7}
									className="d-flex align-items-center"
								>
									<Card.Body className="p-4 p-lg-5 text-black">
										<Form>
											<div className="d-flex align-items-center mb-3 pb-1">
												<span className="h1 fw-bold mb-0">
													Logo
												</span>{" "}
												{/* Replace with your logo */}
											</div>

											<h5
												className="fw-normal mb-3 pb-3"
												style={{
													letterSpacing: "1px",
												}}
											>
												Email Verification
											</h5>

											<Form.Group className="row">
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
												<div className="otp-field mb-4 mt-3">
													{otp.map(
														(
															digit,
															index
														) => (
															<input
																key={
																	index
																}
																type="number"
																maxLength={
																	1
																}
																className="me-2"
																value={
																	digit
																}
																ref={(
																	el
																) =>
																	(otpInputs.current[
																		index
																	] =
																		el)
																} // Store ref to input
																onChange={(
																	e
																) =>
																	handleOtpChange(
																		index,
																		e
																			.target
																			.value
																	)
																}
																onKeyDown={(
																	e
																) => {
																	if (
																		e.key ===
																			"Backspace" &&
																		e
																			.target
																			.value ===
																			""
																	) {
																		const prevInput =
																			otpInputs
																				.current[
																				index -
																					1
																			];
																		if (
																			prevInput
																		) {
																			prevInput.focus();
																		}
																	}
																}}
																style={{
																	width: "40px",
																	height: "40px",
																	textAlign:
																		"center",
																}}
																disabled={
																	index >
																		0 &&
																	otp[
																		index -
																			1
																	] ===
																		""
																} // Disable if previous is empty
															/>
														)
													)}
												</div>
											)}

											{showOtpInput && (
												<Button
													variant="primary"
													onClick={
														handleVerifyOtp
													}
												>
													Verify
												</Button>
											)}

											{otpSent && showOtpInput && (
												<p className="resend text-muted mb-0 mt-3">
													Didn't receive code?{" "}
													<Link
														onClick={
															handleSendEmailVerif
														}
													>
														Request again
													</Link>
												</p>
											)}
											{verificationError && (
												<p className="text-danger mt-2">
													{verificationError}
												</p>
											)}

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

export default RegisterOtpPage;
