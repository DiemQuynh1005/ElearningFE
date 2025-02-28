import React, { useContext, useState } from "react";
import { Alert, Spinner, Form } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import axios from "axios";

const schema = yup
	.object()
	.shape({
		title: yup
			.string()
			.min(2, "Greater than 2 characters")
			.max(100, "Less than 100 characters")
			.required(),
		status: yup.boolean().required(),
		image: yup
			.mixed()
			.test("image", "You need to provide a file", (value) => {
				if (value.length > 0) {
					return true;
				}
				return false;
			})
			.test("fileType", "Unsupported File Format", (value) => {
				const file = value[0];
				return file?.type.startsWith("image/"); // Check if it's an image
			}),
	})
	.required();

function BlogInsert(props) {
	const navigate = useNavigate();
	const { alert, showAlert, auth } = useContext(DataContext);
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
	const [imagePreview, setImagePreview] = useState(null);
	const [contentValue, setContentValue] = useState("");

	async function onSubmit(data) {
		setIsSubmitting(true);
		setSubmissionStep("Reviewing...");
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", contentValue);
		formData.append("status", data.status);
		formData.append("image", data.image[0]);
		setSubmissionStep("Creating");
		await axios
			.post("http://localhost:8080/api/blogs/create", formData)
			.then((res) => {
				if (res.status == 201) {
					showAlert("success", "CREATE BLOG SUCCESSFULLY!");
					navigate(-1);
				}
			})
			.catch((error) => {
				if (error.response.status === 422) {
					showAlert("warning", "You need to provide a file!");
				}
				if (error.response.status === 400) {
					showAlert("warning", "Content is required!");
				} else {
					console.log("Something went wrong", error);
					showAlert(
						"danger",
						"An unexpected error occurred. Please try again later."
					);
				}
			})
			.finally(() => {
				setIsSubmitting(false);
				setSubmissionStep("");
			});
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setImagePreview(file ? URL.createObjectURL(file) : null);
	};

	return (
		<div className="container mt-3" data-aos="fade">
			{alert.type !== "" && (
				<Alert variant={alert.type} dismissible>
					{alert.message}
				</Alert>
			)}
			<h2>Blog Insert Form</h2>
			<form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
				<Form.Group className="mb-3">
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
					<span className="text-danger">{errors.status?.message}</span>
				</Form.Group>

				<div className="row mb-3 mt-3">
					<div className="col-4">
						<label htmlFor="title">
							Title<span className="text-danger">*</span>
						</label>
						<input
							type="text"
							className="form-control"
							id="title"
							placeholder="Enter Title"
							{...register("title")}
						/>
						<span className="text-danger">{errors.title?.message}</span>
					</div>
					<div className="col-4">
						<label htmlFor="image">Image</label>
						<input
							type="file"
							className="form-control d-inline-block"
							id="image"
							{...register("image")}
							onChange={handleImageChange}
						/>
						<span className="text-danger">{errors.image?.message}</span>
					</div>
					<div className="col-4">
						{imagePreview && (
							<img
								src={imagePreview}
								alt="Image Preview"
								className="img-thumbnail me-2"
								style={{
									maxWidth: "100px",
									maxHeight: "100px",
								}}
							/>
						)}
					</div>
				</div>

				<div className="mb-3">
					<label htmlFor="content">
						Content<span className="text-danger">*</span>
					</label>
					<ReactQuill
						theme="snow"
						// value={descriptionValue}
						onChange={setContentValue}
					/>
					{/* <span className="text-danger">{errors.description?.message}</span> */}
				</div>

				<button type="submit" className="btn btn-primary">
					{isSubmitting ? (
						<>
							<Spinner
								as="span"
								animation="border"
								size="sm"
								role="status"
								aria-hidden="true"
								className="me-2"
							/>
							{submissionStep === "reviewing"
								? "Reviewing..."
								: "Creating..."}
						</>
					) : (
						"Create Blog"
					)}
				</button>
			</form>
		</div>
	);
}

export default BlogInsert;
