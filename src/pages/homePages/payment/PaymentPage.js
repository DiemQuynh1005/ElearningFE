import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../contexts/DataContext";
import { useNavigate } from "react-router-dom";
import { Alert, Button, Card, Col, Container, Form, Row, Spinner } from "react-bootstrap";
import axios from "axios";
import AOS from "aos";
import "aos/dist/aos.css";
import { ColorRing } from "react-loader-spinner";
import VNPay from "./VNPay";

function PaymentPage(props) {
	const navigate = useNavigate();
	const { cartItems, removeCartItem, auth, showAlert, discountSave } = useContext(DataContext);
	const [discountCode, setDiscountCode] = useState("");
	const [totalAmount, setTotalAmount] = useState(0);
	const [discountAmount, setDiscountAmount] = useState(0);
	const [isConfirm, setIsConfirm] = useState(false);
	const [submissionStep, setSubmissionStep] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleVerifyDiscountCode = async () => {
		setIsSubmitting(true);
		setSubmissionStep("Verifying...");
		try {
			const data = {
				account_id: auth?.id,
				promotion_code: discountCode,
				amount: totalAmount,
			};
			console.log("SEND DATA: ", data);

			await axios
				.post("http://localhost:8080/api/promotions/validUsage", data)
				.then((res) => {
					if (res.status === 200) {
						setIsSubmitting(false);
						// setSubmissionStep("Verified");
						discountSave(discountCode);
						showAlert("success", "Apply Discount Code Successfully");
						const disAmount = (totalAmount * res.data.discount_rate) / 100;
						setDiscountAmount(disAmount);
						setTotalAmount(totalAmount - disAmount);
						setIsConfirm(true);
					}
				});
		} catch (error) {
			setIsSubmitting(false);
			setSubmissionStep("Verify");
			console.log("ERROR: ", error);
			switch (error.status) {
				case 404:
					showAlert("warning", "Discount Code Not Found!");
					break;
				case 405:
					showAlert("warning", "Unusable Discount Code!");
					break;
				case 406:
					showAlert("warning", "Discount Code Has Been Used!");
					break;
				default:
					console.log("Something went wrong", error);
					showAlert(
						"danger",
						"An unexpected error occurred. Please try again later."
					);
					break;
			}
		}
	};

	useEffect(() => {
		document.title = "Payment Page";
		AOS.init({ duration: 1500 });

		const newTotal = cartItems.reduce((sum, item) => sum + item.price, 0);
		setTotalAmount(newTotal);

		if (cartItems.length === 0 || Object.keys(auth).length === 0) {
			showAlert("danger", "Sorry for this, Please try again!");
			navigate("/");
		}
	}, [cartItems, navigate]);

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
			<Container className="py-5">
				<Row className="justify-content-center h-100 my-5 py-5">
					<Col md={8}>
						<Card>
							<Card.Body className="p-4">
								<h2 className="mb-4">Payment</h2>

								{/* Cart Items */}
								<h4 className="mb-3">Chosen Courses</h4>
								{cartItems.length === 0 ? (
									<p>Your cart is empty.</p>
								) : (
									<ol style={{ listStyleType: "decimal" }}>
										{cartItems.map((item) => (
											<li
												key={item.id}
												className="mb-2 d-flex align-items-center"
											>
												<span>
													{item.name}:{" "}
													{item.price}
												</span>
												<Button
													disabled={isConfirm}
													variant="danger"
													size="sm"
													className="ms-5 fs-5"
													onClick={() =>
														removeCartItem(
															item
														)
													}
												>
													-
												</Button>
											</li>
										))}
									</ol>
								)}

								{/* Discount Code */}
								<div className="mb-3 d-flex align-items-center">
									<Form.Label
										htmlFor="discountCode"
										className="me-2"
									>
										Discount Code
									</Form.Label>
									<Form.Control
										type="text"
										id="discountCode"
										value={discountCode}
										onChange={(e) =>
											setDiscountCode(e.target.value)
										}
										className="flex-grow-1"
									/>
									<Button
										variant="primary"
										disabled={
											!discountCode.length > 0 ||
											isConfirm
										}
										className="mt-2 ms-2"
										onClick={handleVerifyDiscountCode}
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
												{submissionStep}
											</>
										) : (
											"Verify"
										)}
									</Button>
								</div>
								{discountAmount > 0 && (
									<div className="mb-4">
										<h4>
											Discount Amount: {discountAmount}
										</h4>
									</div>
								)}

								{/* Total Amount */}
								<div className="mb-4">
									<h4>Total Amount: {totalAmount}</h4>
								</div>

								{/* Pay with VNPay Button */}
								<VNPay totalAmount={totalAmount} />
							</Card.Body>
						</Card>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default PaymentPage;
