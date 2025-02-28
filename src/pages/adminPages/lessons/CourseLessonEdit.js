import React, { useContext, useEffect, useState } from "react";
import { Button, Modal, Spinner, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import axios from "axios";
import { DataContext } from "../../../contexts/DataContext";

const schema = yup
	.object()
	.shape({
		name: yup
			.string()
			.min(2, "Greater than 2 characters")
			.max(100, "Less than 100 characters")
			.required(),
		status: yup.boolean().required(),
		video: yup.mixed(),
	})
	.required();

function CourseLessonEdit(props) {
	const { lesson, show, onHide } = props;
	const { showAlert } = useContext(DataContext);
	const [videoPreview, setVideoPreview] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submissionStep, setSubmissionStep] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
		defaultValues: lesson ? { ...lesson, status: lesson.status ? true : false } : {},
	});

	useEffect(() => {
		if (lesson) {
			setValue("name", lesson.name);
			setValue("video", lesson.video);
			setValue("status", lesson.status);
			setVideoPreview(`${lesson.video}`);
		}
	}, [lesson, setValue]);

	const handleVideoChange = (e) => {
		const file = e.target.files[0];
		setVideoPreview(file ? URL.createObjectURL(file) : null);
	};

	async function onSubmit(data) {
		setIsSubmitting(true);
		setSubmissionStep("Updating...");
		console.log("Video", data.video);

		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("status", data.status);
		formData.append("course_id", lesson.course.id);
		if (Object.prototype.toString.call(data.video) !== "[object String]") {
			formData.append("video", data.video[0]);
		}
		try {
			const res = await axios.put(
				`http://localhost:8080/api/lessons/edit/${lesson.id}`,
				formData
			);
			if (res.status === 200) {
				showAlert("success", "UPDATE LESSON SUCCESSFULLY!");
				onHide();
			}
		} catch (error) {
			console.error("Error updating lesson:", error);
			showAlert("danger", "An error occurred while updating the lesson.");
		} finally {
			setIsSubmitting(false);
			setSubmissionStep("");
		}
	}
	return (
		<Modal
			show={show}
			onHide={onHide}
			size="lg"
			aria-labelledby="contained-modal-title-vcenter"
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Lesson Edit Form
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<div className="container mt-3" data-aos="fade">
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
								<span className="text-danger">
									{errors.name?.message}
								</span>

								<Form.Group className="my-3">
									<Form.Label>
										Status
										<span className="text-danger">*</span>
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
								</Form.Group>
							</div>
							<div className="col-6">
								<p>Current Video</p>
								<div className="my-3">
									{videoPreview && (
										<video
											src={videoPreview}
											controls
											className="img-thumbnail"
											style={{
												maxWidth: "300px",
												maxHeight: "200px",
											}}
										/>
									)}
								</div>
								<label htmlFor="video">
									Video
									<span className="text-danger">*</span>
								</label>
								<input
									type="file"
									className="form-control"
									id="video"
									{...register("video")}
									onChange={handleVideoChange}
								/>
								<span className="text-danger">
									{errors.video?.message}
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
						"Edit Lesson"
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default CourseLessonEdit;
