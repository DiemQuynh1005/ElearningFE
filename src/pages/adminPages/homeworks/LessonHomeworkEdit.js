import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import { ColorRing } from "react-loader-spinner";

function LessonHomeworkEdit(props) {
	const navigate = useNavigate();
	const { id } = useParams();
	const [homework, setHomework] = useState(null);
	const { showAlert } = useContext(DataContext);
	const [questions, setQuestions] = useState([
		{ question: "", options: [{ optionText: "", isCorrect: false }] },
	]);
	const [duration, setDuration] = useState(5);
	const [status, setStatus] = useState(false);
	const [errors, setErrors] = useState({});
	const formRef = useRef();
	const [loading, setLoading] = useState(true);

	const fetchHomework = async () => {
		setLoading(true);
		try {
			await axios
				.get(`http://localhost:8080/api/homeworks/by-lesson/${id}`)
				.then((res) => {
					if (res.status === 200) {
						setHomework(res.data);
						setDuration(res.data.duration);
						setStatus(res.data.status);
						setQuestions(
							res.data.questions || [
								{
									question: "",
									options: [
										{ optionText: "", isCorrect: false },
									],
								},
							]
						);
					}
				});
		} catch (error) {
			console.error("Error fetching course data:", error);
			showAlert("danger", "Failed to load course data.");
			navigate(-1);
		} finally {
			setLoading(false);
		}
	};

	console.log("HW: ", homework);
	useEffect(() => {
		fetchHomework();
	}, [id]);

	const handleChange = (e) => {
		if (e.target.name === "status") {
			setStatus(e.target.checked);
		} else if (e.target.name === "duration") {
			setDuration(e.target.value);
		}
	};

	const handleQuestionChange = (questionIndex, event) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].question = event.target.value;
		setQuestions(updatedQuestions);
	};

	const handleOptionChange = (questionIndex, optionIndex, event) => {
		const updatedQuestions = [...questions];
		updatedQuestions[questionIndex].options[optionIndex].optionText = event.target.value;
		setQuestions(updatedQuestions);
	};

	const handleOptionCorrectChange = (questionIndex, optionIndex) => {
		setQuestions((prevQuestions) => {
			return prevQuestions.map((question, qIndex) => {
				if (qIndex === questionIndex) {
					const updatedOptions = question.options.map((option, oIndex) => ({
						...option,
						isCorrect: oIndex === optionIndex,
					}));
					return { ...question, options: updatedOptions };
				}
				return question;
			});
		});
	};

	const addQuestion = () => {
		setQuestions((prevQuestions) => [
			...prevQuestions,
			{
				question: "",
				options: [
					{ optionText: "", isCorrect: true },
					{ optionText: "", isCorrect: false },
				],
			},
		]);
	};

	const removeQuestion = (questionIndex) => {
		setQuestions((prevQuestions) =>
			prevQuestions.filter((_, index) => index !== questionIndex)
		);
	};

	const addOption = (questionIndex) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question, qIndex) => {
				if (qIndex === questionIndex) {
					return {
						...question,
						options: [
							...question.options,
							{ optionText: "", isCorrect: false },
						],
					};
				}
				return question;
			})
		);
	};

	const removeOption = (questionIndex, optionIndex) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question, qIndex) => {
				if (qIndex === questionIndex) {
					const updatedOptions = question.options.filter(
						(_, oIndex) => oIndex !== optionIndex
					);
					return { ...question, options: updatedOptions };
				}
				return question;
			})
		);
	};

	const validateForm = () => {
		let isValid = true;
		const newErrors = {};

		if (!duration) {
			newErrors.duration = "Duration is required";
			isValid = false;
		} else if (isNaN(duration) || duration < 5 || duration > 60) {
			newErrors.duration = "Duration must be a number between 5 and 60";
			isValid = false;
		}

		questions.forEach((question, questionIndex) => {
			if (!question.question) {
				newErrors[`questions[${questionIndex}].question`] = "Question is required";
				isValid = false;
			} else if (question.question.length < 5) {
				newErrors[`questions[${questionIndex}].question`] =
					"Question must be at least 5 characters";
				isValid = false;
			}

			question.options.forEach((option, optionIndex) => {
				if (!option.optionText) {
					newErrors[
						`questions[${questionIndex}].options[${optionIndex}].optionText`
					] = "Option text is required";
					isValid = false;
				}
			});
		});

		setErrors(newErrors);
		return isValid;
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const isValid = validateForm();

		if (isValid) {
			try {
				const data = {
					duration: parseInt(duration, 10),
					status: status,
					lesson_id: id,
					questions: questions.map((question) => ({
						id: question.id || null,
						type: "OPTION",
						question: question.question,
						options: question.options.map((option) => ({
							id: option.id || null,
							optionText: option.optionText,
							result: option.isCorrect,
						})),
					})),
				};

				console.log("DATA: ", data);

				const response = await axios.put(
					`http://localhost:8080/api/homeworks/edit/${homework.id}`,
					data
				);
				if (response.status === 200) {
					showAlert("success", "UPDATE HOMEWORK SUCCESSFULLY!");
					navigate(-1);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	return (
		<div>
			{loading ? (
				// LOADER SPINNER
				<ColorRing
					visible={true}
					height="80"
					width="80"
					ariaLabel="blocks-loading"
					wrapperStyle={{ display: "block", margin: "auto" }}
					wrapperClass="blocks-wrapper"
					colors={["#F5F5F5", "#313236", "#7CD6EA", "#172765", "#F5F5F5"]}
				/>
			) : (
				// END LOADER SPINNER
				<Form onSubmit={handleSubmit} ref={formRef}>
					<div className="mb-3 mt-3">
						<label htmlFor="duration" className="form-label">
							Duration:<span className="text-danger">*</span>
						</label>
						<input
							type="number"
							className="form-control"
							id="duration"
							placeholder="Enter Duration"
							value={duration}
							onChange={(e) => setDuration(e.target.value)}
							name="duration"
						/>
						<span className="text-danger">{errors.duration}</span>
					</div>

					<Form.Group className="mb-3">
						<Form.Check
							type="checkbox"
							id="status"
							label="Status"
							checked={status}
							onChange={(e) => setStatus(e.target.checked)}
							name="status"
						/>
						<span className="text-danger">{errors.status}</span>
					</Form.Group>

					{questions.map((question, questionIndex) => (
						<div key={questionIndex} className="border p-3 my-3">
							<Form.Group className="mb-3">
								<Row>
									<Col xs={11}>
										<Form.Label>Question</Form.Label>
										<Form.Control
											type="text"
											placeholder="Enter question"
											value={question.question}
											onChange={(event) =>
												handleQuestionChange(
													questionIndex,
													event
												)
											}
											name="question"
										/>
										<span className="text-danger">
											{
												errors[
													`questions[${questionIndex}].question`
												]
											}
										</span>
									</Col>
									<Col xs={1}>
										<Button
											variant="danger"
											size="sm"
											onClick={() =>
												removeQuestion(
													questionIndex
												)
											}
										>
											-
										</Button>
									</Col>
								</Row>
							</Form.Group>

							{question.options.map((option, optionIndex) => (
								<Row key={optionIndex}>
									<Col xs={9}>
										<Form.Control
											type="text"
											placeholder="Enter option"
											value={option.optionText}
											onChange={(event) =>
												handleOptionChange(
													questionIndex,
													optionIndex,
													event
												)
											}
											name="optionText"
										/>
										<span className="text-danger">
											{
												errors[
													`questions[${questionIndex}].options[${optionIndex}].optionText`
												]
											}
										</span>
									</Col>
									<Col xs={2}>
										<Row>
											<Col xs={6}>
												<Form.Check
													type="switch"
													id={`custom-radio-${questionIndex}-${optionIndex}`}
													label=""
													checked={
														question
															.options[
															optionIndex
														].isCorrect
													}
													onChange={() =>
														handleOptionCorrectChange(
															questionIndex,
															optionIndex
														)
													}
												/>
											</Col>
											<Col xs={6}>
												<Button
													variant="danger"
													size="sm"
													onClick={() =>
														removeOption(
															questionIndex,
															optionIndex
														)
													}
												>
													-
												</Button>
											</Col>
										</Row>
									</Col>
								</Row>
							))}

							<Button
								variant="secondary"
								onClick={() => addOption(questionIndex)}
							>
								Add Option
							</Button>
						</div>
					))}

					<Button variant="primary" onClick={addQuestion}>
						New Question
					</Button>

					<Button variant="primary" type="submit">
						Submit
					</Button>
				</Form>
			)}
		</div>
	);
}

export default LessonHomeworkEdit;
