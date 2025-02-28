import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "aos/dist/aos.css";
import { DataContext } from "../../../contexts/DataContext";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";

const schema = yup
	.object()
	.shape({
		email: yup.string().required("Email is required.").email("Invalid Email Input."),
		password: yup.string().required("Password is required"),
	})
	.required();

function LoginPage(props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});

	const { auth, login, showAlert, alert } = useContext(DataContext);
	const navigate = useNavigate();

	async function onSubmit(data) {
		data.email = data.email.trim();
		data.password = data.password.trim();
		await axios
			.post("http://localhost:8080/api/accounts/login", data)
			.then((res) => {
				if (res.status == 200) {
					login(res.data);
				}
			})
			.catch((error) => {
				if (error.response.status == 500) {
					showAlert("danger", "Wrong Username OR Password");
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
		document.title = "LOGIN PAGE";
		AOS.init({
			duration: 1500,
		});
		if (Object.keys(auth).length > 0) {
			showAlert("warning", "Sign In Alredy!");
			navigate("/");
		}
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
										<Form onSubmit={handleSubmit(onSubmit)}>
											<div className="d-flex align-items-center mb-3 pb-1">
												<i
													className="fas fa-cubes fa-2x me-3"
													style={{
														color: "#ff6219",
													}}
												></i>
												<span className="h1 fw-bold mb-0">
													Logo
												</span>
											</div>
											<h5
												className="fw-normal mb-3 pb-3"
												style={{
													letterSpacing: "1px",
												}}
											>
												Sign into your account
											</h5>
											<div className="form-group">
												<input
													type="text"
													className="form-control form-control-lg"
													placeholder="Enter Email"
													{...register("email")}
												/>
												<span className="text-danger">
													{
														errors.email
															?.message
													}
												</span>
											</div>

											<div className="form-group">
												<input
													type="password"
													className="form-control form-control-lg"
													placeholder="Enter Password"
													{...register(
														"password"
													)}
												/>
												<span className="text-danger">
													{
														errors.password
															?.message
													}
												</span>
											</div>

											<div className="pt-1 mb-4">
												<Button
													className="btn btn-outline-dark btn-lg btn-block"
													type="submit"
												>
													Login
												</Button>
											</div>
											<Link
												className="small text-muted"
												to="#!"
											>
												Forgot password?
											</Link>
											<p
												className="mb-5 pb-lg-2"
												style={{ color: "#393f81" }}
											>
												Don't have an account?{" "}
												<Link
													to={"/register"}
													style={{
														color: "#393f81",
													}}
												>
													Register here
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

export default LoginPage;
