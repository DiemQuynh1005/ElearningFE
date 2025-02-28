import React, { useContext, useState } from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
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
		// status: yup.boolean().required(),
		video: yup
			.mixed()
			.test("video", "You need to provide a file", (value) => {
				if (value.length > 0) {
					return true;
				}
				return false;
			})
			.test("fileType", "Unsupported File Format", (value) => {
				const file = value[0];
				return file?.type.startsWith("video/"); // Check if it's an image
			}),
	})
	.required();

function CourseLessonInsert(props) {
	const { course_id } = props;
	const { showAlert } = useContext(DataContext);
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
		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("status", true);
		formData.append("course_id", course_id);
		formData.append("video", data.video[0]);
		setSubmissionStep("Saving...");
		await axios
			.post("http://localhost:8080/api/lessons/create", formData)
			.then((res) => {
				if (res.status == 201) {
					showAlert("success", "CREATE LESSON SUCCESSFULLY!");
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
					Lesson Insert Form
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
							</div>
							<div className="col-6">
								<label htmlFor="video">
									Video
									<span className="text-danger">*</span>
								</label>
								<input
									type="file"
									className="form-control"
									id="video"
									{...register("video")}
								/>
								<span className="text-danger">
									{errors.video?.message}
								</span>
							</div>
						</div>

						{/* <div className="mb-3">
							<Form.Group>
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
							</Form.Group>
						</div> */}
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
						"Create Lesson"
					)}
				</Button>
			</Modal.Footer>
		</Modal>
	);
}

export default CourseLessonInsert;
