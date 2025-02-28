import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import * as yup from "yup";
import { Alert, Form, Spinner } from "react-bootstrap";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";

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
		status: yup.boolean().required(),
		thumbnail: yup.mixed(),
	})
	.required();

function CourseEdit(props) {
	const navigate = useNavigate();
	const { alert, showAlert, auth } = useContext(DataContext);
	const { id } = useParams();
	const [course, setCourse] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionStep, setSubmissionStep] = useState("");
	const [descriptionValue, setDescriptionValue] = useState("");
	const [thumbnailPreview, setThumbnailPreview] = useState(null); // For previewing new thumbnail

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset, // Add reset function
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});

	const fetchCourseData = async () => {
		try {
			await axios.get(`http://localhost:8080/api/courses/detail/${id}`).then((res) => {
				if (res.status === 200) {
					setCourse(res.data);
					setDescriptionValue(res.data.description);
					setValue("status", res.data.status);
					setThumbnailPreview(
						`http://localhost:8080/uploads/courses/${res.data.thumbnail}`
					);
					reset(res.data); // Use reset to populate all fields at once
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
		formData.append("account_id", auth.id);
		formData.append("name", data.name);
		formData.append("price", data.price);
		formData.append("duration", data.duration);
		formData.append("description", descriptionValue);
		formData.append("status", data.status);
		if (Object.prototype.toString.call(data.thumbnail) !== "[object String]") {
			formData.append("thumbnail", data.thumbnail[0]);
		}
		setSubmissionStep("Updating...");
		await axios
			.put(`http://localhost:8080/api/courses/edit/${id}`, formData)
			.then((res) => {
				if (res.status == 200) {
					showAlert("success", "UPDATE COURSE SUCCESSFULLY!");
					navigate(-1);
				}
			})
			.catch((error) => {
				if (error.response.status === 404) {
					showAlert("warning", "Course not found!");
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

	const handleThumbnailChange = (e) => {
		const file = e.target.files[0];
		setThumbnailPreview(file ? URL.createObjectURL(file) : null);
	};

	useEffect(() => {
		fetchCourseData();
	}, [id]);

	return (
		<div className="container mt-3" data-aos="fade">
			{alert.type !== "" && (
				<Alert variant={alert.type} dismissible>
					{alert.message}
				</Alert>
			)}
			<h2>Course Edit Form</h2>
			{/* LOADER SPINNER */}
			{course == null && (
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
				<div className="row mb-3 mt-3">
					<div className="col-4">
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
					<div className="col-4">
						<label htmlFor="thumbnail">Thumbnail</label>
						<input
							type="file"
							className="form-control d-inline-block"
							id="thumbnail"
							{...register("thumbnail")}
							onChange={handleThumbnailChange}
						/>
						<span className="text-danger">{errors.thumbnail?.message}</span>
					</div>
					<div className="col-4">
						{thumbnailPreview && (
							<img
								src={thumbnailPreview}
								alt="Thumbnail Preview"
								className="img-thumbnail me-2"
								style={{
									maxWidth: "100px",
									maxHeight: "100px",
								}}
							/>
						)}
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

				<div className="mb-3">
					<label htmlFor="description">
						Description<span className="text-danger">*</span>
					</label>
					<ReactQuill
						theme="snow"
						value={descriptionValue}
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
								: "Updating..."}
						</>
					) : (
						"Update Course"
					)}
				</button>
			</form>
		</div>
	);
}

export default CourseEdit;
