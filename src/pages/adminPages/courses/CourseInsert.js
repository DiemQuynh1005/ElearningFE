import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as yup from "yup";
import { Alert, Form, Spinner } from "react-bootstrap";
import axios from "axios";

const schema = yup
	.object()
	.shape({
		name: yup
			.string()
			.min(2, "Greater than 2 characters")
			.max(100, "Less than 100 characters")
			.required(),
		price: yup
			.number()
			.typeError("Price must be number!")
			.required("Price cannot be blank!")
			.min(10000, "Price must be greater than 10.000 VNĐ!")
			.max(10000000, "Price must be less than 10.000.000 VNĐ!"),
		duration: yup
			.number()
			.typeError("Duration must be number!")
			.min(60, "Greater than 60 minutes")
			// .max(360, "Less than 360 minutes")
			.required(),
		// description: yup.string().nullable(),
		status: yup.boolean().required(),
		thumbnail: yup.mixed().test("thumbnail", "You need to provide a file", (value) => {
			if (value.length > 0) {
				return true;
			}
			return false;
		}),
	})
	.required();

function CourseInsert(props) {
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

	const [descriptionValue, setDescriptionValue] = useState("");

	async function onSubmit(data) {
		setIsSubmitting(true);
		setSubmissionStep("reviewing");
		const formData = new FormData();
		formData.append("account_id", auth.id);
		formData.append("name", data.name);
		formData.append("price", data.price);
		formData.append("duration", data.duration);
		formData.append("description", descriptionValue);
		formData.append("status", data.status);
		formData.append("thumbnail", data.thumbnail[0]);
		setSubmissionStep("creating");
		await axios
			.post("http://localhost:8080/api/courses/create", formData)
			.then((res) => {
				if (res.status == 201) {
					showAlert("success", "CREATE COURSE SUCCESSFULLY!");
					navigate(-1);
				}
			})
			.catch((error) => {
				if (error.response.status === 422) {
					showAlert("warning", "You need to provide a file!");
				}
				if (error.response.status === 400) {
					showAlert("warning", "Description is required!");
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

	return (
		<div className="container mt-3" data-aos="fade">
			{alert.type !== "" && (
				<Alert variant={alert.type} dismissible>
					{alert.message}
				</Alert>
			)}
			<h2>Course Insert Form</h2>
			<form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
				<div className="row mb-3 mt-3">
					<div className="col-6">
						<label htmlFor="name">
							Name<span className="text-danger">*</span>
						</label>
						<input
							type="text"
							className="form-control"
							id="name"
							placeholder="Enter Name"
							{...register("name")}
						/>
						<span className="text-danger">{errors.name?.message}</span>
					</div>
					<div className="col-6">
						<label htmlFor="thumbnail">
							Thumbnail<span className="text-danger">*</span>
						</label>
						<input
							type="file"
							className="form-control"
							id="thumbnail"
							{...register("thumbnail")}
						/>
						<span className="text-danger">{errors.thumbnail?.message}</span>
					</div>
				</div>

				<div className="row mb-3">
					<div className="col-4">
						<label htmlFor="duration">
							Duration(Minutes)<span className="text-danger">*</span>
						</label>
						<input
							type="number"
							className="form-control"
							id="duration"
							placeholder="Enter Duration"
							{...register("duration")}
						/>
						<span className="text-danger">{errors.duration?.message}</span>
					</div>
					<div className="col-4">
						<label htmlFor="price">
							Price<span className="text-danger">*</span>
						</label>
						<input
							type="number"
							className="form-control"
							id="price"
							placeholder="Enter Price"
							{...register("price")}
						/>
						<span className="text-danger">{errors.price?.message}</span>
					</div>

					<Form.Group className="col-4">
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
				</div>

				{/* {existingPoster != null && (
					<div className="mb-3">
						<label htmlFor="oldPoster">Present Poster</label>
						<img
							src={`http://localhost:8080/uploads/movies/${existingPoster}`}
							alt="oldPoster"
							className="img-thumbnail"
							width="100"
						/>
					</div>
				)} */}

				<div className="mb-3">
					<label htmlFor="description">
						Description<span className="text-danger">*</span>
					</label>
					<ReactQuill
						theme="snow"
						// value={descriptionValue}
						onChange={setDescriptionValue}
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
						"Create Course"
					)}
				</button>
			</form>
		</div>
	);
}
export default CourseInsert;
