import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Alert, Spinner, Form } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup
	.object()
	.shape({
		title: yup
			.string()
			.min(2, "Greater than 2 characters")
			.max(100, "Less than 100 characters")
			.required(),
		status: yup.boolean().required(),
		image: yup.mixed(),
	})
	.required();

function BlogEdit(props) {
	const navigate = useNavigate();
	const { alert, showAlert, auth } = useContext(DataContext);
	const { id } = useParams();
	const [blog, setBlog] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionStep, setSubmissionStep] = useState("");
	const [contentValue, setContentValue] = useState("");
	const [imagePreview, setImagePreview] = useState(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});

	const fetchBlogData = async () => {
		try {
			await axios.get(`http://localhost:8080/api/blogs/detail/${id}`).then((res) => {
				if (res.status === 200) {
					setBlog(res.data);
					setContentValue(res.data.content);
					setValue("status", res.data.status);
					setImagePreview(
						`http://localhost:8080/uploads/blogs/${res.data.image}`
					);
					reset(res.data);
				}
			});
		} catch (error) {
			console.error("Error fetching course data:", error);
			showAlert("danger", "Failed to load course data.");
			navigate(-1);
		}
	};

	async function onSubmit(data) {
		setIsSubmitting(true);
		setSubmissionStep("Reviewing");
		const formData = new FormData();
		formData.append("title", data.title);
		formData.append("content", contentValue);
		formData.append("status", data.status);
		if (Object.prototype.toString.call(data.image) !== "[object String]") {
			formData.append("image", data.image[0]);
		}
		setSubmissionStep("Updating...");
		await axios
			.put(`http://localhost:8080/api/blogs/edit/${id}`, formData)
			.then((res) => {
				if (res.status == 200) {
					showAlert("success", "UPDATE BLOG SUCCESSFULLY!");
					navigate(-1);
				}
			})
			.catch((error) => {
				if (error.response.status === 404) {
					showAlert("warning", "Blog not found!");
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

	useEffect(() => {
		fetchBlogData();
	}, [id]);

	return (
		<div className="container mt-3" data-aos="fade">
			{alert.type !== "" && (
				<Alert variant={alert.type} dismissible>
					{alert.message}
				</Alert>
			)}
			<h2>Blog Edit Form</h2>
			{/* LOADER SPINNER */}
			{blog == null && (
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
						value={contentValue}
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
								: "Updating..."}
						</>
					) : (
						"Update Blog"
					)}
				</button>
			</form>
		</div>
	);
}

export default BlogEdit;
