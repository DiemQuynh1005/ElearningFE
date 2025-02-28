import React, { useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DataContext } from "../../../contexts/DataContext";

function LessonHomeworkInsert(props) {
	const navigate = useNavigate();
	const { alert, showAlert } = useContext(DataContext);
	const { id } = useParams();
	const [duration, setDuration] = useState(5);
	const [questions, setQuestions] = useState([
		{
			question: "",
			options: [
				{ optionText: "", isCorrect: true },
				{ optionText: "", isCorrect: false },
			],
		},
	]);
	const [errors, setErrors] = useState({});

	const handleQuestionChange = (questionIndex, event) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question, index) =>
				index === questionIndex
					? { ...question, question: event.target.value }
					: question
			)
		);
	};

	const handleOptionChange = (questionIndex, optionIndex, event) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question, index) =>
				index === questionIndex
					? {
							...question,
							options: question.options.map((option, i) =>
								i === optionIndex
									? {
											...option,
											optionText: event.target.value,
									  }
									: option
							),
					  }
					: question
			)
		);
	};

	const handleOptionCorrectChange = (questionIndex, optionIndex) => {
		setQuestions((prevQuestions) => {
			const updatedQuestions = [...prevQuestions];
			updatedQuestions[questionIndex].options = updatedQuestions[
				questionIndex
			].options.map((option, i) => ({
				...option,
				isCorrect: i === optionIndex,
			}));
			return updatedQuestions;
		});
	};

	const addOption = (questionIndex) => {
		setQuestions((prevQuestions) =>
			prevQuestions.map((question, index) =>
				index === questionIndex
					? {
							...question,
							options: [
								...question.options,
								{ optionText: "", isCorrect: false },
							],
					  }
					: question
			)
		);
	};

	const addQuestion = () => {
		setQuestions([
			...questions,
			{
				question: "",
				options: [
					{ optionText: "", isCorrect: true },
					{ optionText: "", isCorrect: false },
				],
			},
		]);
	};

	const removeOption = (questionIndex, optionIndex) => {
		if (questions[questionIndex].options.length > 1) {
			setQuestions((prevQuestions) =>
				prevQuestions.map((question, index) =>
					index === questionIndex
						? {
								...question,
								options: question.options.filter(
									(option, i) => i !== optionIndex
								),
						  }
						: question
				)
			);
		}
	};

	const removeQuestion = (questionIndex) => {
		if (questions.length > 1) {
			setQuestions((prevQuestions) =>
				prevQuestions.filter((_, index) => index !== questionIndex)
			);
		}
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

	const onSubmit = async (event) => {
		event.preventDefault();
		const isValid = validateForm();

		if (isValid) {
			const sendData = {
				duration: parseInt(duration, 10), // Parse duration to integer
				status: true,
				lesson_id: id,
				questions: questions.map((question) => ({
					type: "OPTION",
					question: question.question,
					options: question.options.map((option) => ({
						optionText: option.optionText,
						result: option.isCorrect,
					})),
				})),
			};

			try {
				const response = await axios.post(
					"http://localhost:8080/api/homeworks/create",
					sendData
				);
				if (response.status === 201) {
					showAlert("success", "CREATE HOMEWORK SUCCESSFULLY!");
					navigate(-1);
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}
	};

	return (
		<Form onSubmit={onSubmit}>
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
				/>
				<span className="text-danger">{errors.duration}</span>
			</div>

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
									onClick={() => removeQuestion(questionIndex)}
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
											id={`custom-radio-<span class="math-inline">\{questionIndex\}\-</span>{optionIndex}`}
											name={`radio-${questionIndex}`}
											label=""
											checked={option.isCorrect}
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

					<Button variant="secondary" onClick={() => addOption(questionIndex)}>
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
	);
}

export default LessonHomeworkInsert;
