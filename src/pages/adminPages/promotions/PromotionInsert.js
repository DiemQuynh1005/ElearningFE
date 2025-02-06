import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Button, Modal, Spinner } from "react-bootstrap";
import axios from "axios";
const schema = yup
	.object()
	.shape({
		code: yup
			.string()
			.min(2, "Greater than 2 characters")
			.max(10, "Less than 10 characters")
			.required(),
		expired_at: yup
			.date()
			.required("Expiration date is required")
			.min(new Date(), "Expiration date must be after now"),
		discount_rate: yup
			.number()
			.typeError("Discount Rate must be number!")
			.min(10, "Discount Rate must be greater than 10%")
			.max(80, "Discount Rate must be less than 80%")
			.required(),
		// status: yup.boolean().required(),
		quantity: yup
			.number()
			.typeError("Quantity must be number!")
			.min(1, "Quantity must be greater than 1")
			// .max(80, "Quantity must be less than 80")
			.required(),
		min_amount: yup
			.number()
			.typeError("Min Amount must be number!")
			.min(100000, "Min Amount must be greater than 100.000VND")
			.max(5000000, "Min Amount must be less than 5.000.000VND")
			.required(),
	})
	.required();

function PromotionInsert(props) {
	const navigate = useNavigate();
	const { alert, showAlert } = useContext(DataContext);
	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionStep, setSubmissionStep] = useState("");

	async function onSubmit(data) {
		setIsSubmitting(true);
		setSubmissionStep("Reviewing...");
		console.log("DATA:::", data);

		const sentData = {
			code: data.code,
			status: true,
			expired_at: data.expired_at,
			discount_rate: data.discount_rate,
			quantity: data.quantity,
			min_amount: data.min_amount,
		};

		setSubmissionStep("Saving...");
		await axios
			.post("http://localhost:8080/api/promotions/create", sentData)
			.then((res) => {
				if (res.status == 201) {
					showAlert("success", "CREATE PROMOTION SUCCESSFULLY!");
					props.onHide();
				}
			})
			.catch((error) => {
				console.log("Something went wrong", error);
				showAlert(
					"danger",
					"An unexpected error occurred. Please try again later."
				);
			})
			.finally(() => {
				setIsSubmitting(false);
				setSubmissionStep("");
			});
	}

	return (
		<Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter">
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Promotion Insert Form
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container mt-3" data-aos="fade">
					{/* {alert.type !== "" && (
						<Alert variant={alert.type} dismissible>
							{alert.message}
						</Alert>
					)} */}
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="row mb-3 mt-3">
							<div className="col-6">
								<label htmlFor="code">
									Discount Code
									<span className="text-danger">*</span>
								</label>
								<input
									type="text"
									className="form-control"
									id="code"
									placeholder="Enter Code"
									{...register("code")}
								/>
								<span className="text-danger">
									{errors.code?.message}
								</span>
							</div>
							<div className="col-6">
								<label htmlFor="minAmount">
									Minimum purchase amount
									<span className="text-danger">*</span>
								</label>
								<input
									type="number"
									className="form-control"
									id="minAmount"
									{...register("min_amount")}
								/>
								<span className="text-danger">
									{errors.min_amount?.message}
								</span>
							</div>
						</div>

						<div className="row mb-3">
							<div className="col-4">
								<label htmlFor="rate">
									Discount Rate (%)
									<span className="text-danger">*</span>
								</label>
								<input
									type="number"
									className="form-control"
									id="rate"
									placeholder="Enter Discount Rate"
									{...register("discount_rate")}
								/>
								<span className="text-danger">
									{errors.discount_rate?.message}
								</span>
							</div>
							<div className="col-4">
								<label htmlFor="quantity">
									Quantity<span className="text-danger">*</span>
								</label>
								<input
									type="number"
									className="form-control"
									id="quantity"
									placeholder="Enter Quantity"
									{...register("quantity")}
								/>
								<span className="text-danger">
									{errors.quantity?.message}
								</span>
							</div>

							{/* <Form.Group className="col-4">
								<Form.Label>
									Status<span className="text-danger">*</span>
								</Form.Label>
								<div>
									<Form.Check
										type="radio"
										id="statusOn"
										label="ON"
										{...register("status")}
										value={true}
										inline
									/>
									<Form.Check
										type="radio"
										id="statusOff"
										label="OFF"
										{...register("status")}
										value={false}
										inline
									/>
								</div>
								<span className="text-danger">
									{errors.status?.message}
								</span>
							</Form.Group> */}
							<div className="col-4">
								<label htmlFor="expiredAt">
									Expired At
									<span className="text-danger">*</span>
								</label>
								<input
									type="datetime-local"
									className="form-control"
									id="expiredAt"
									{...register("expired_at")}
								/>
								<span className="text-danger">
									{errors.expired_at?.message}
								</span>
							</div>
						</div>
					</form>
				</div>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={props.onHide} disabled={isSubmitting}>
					Close
				</Button>
				<Button
					variant="primary"
					onClick={handleSubmit(onSubmit)}
					disabled={isSubmitting}
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
						"Create Promotion"
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default PromotionInsert;
