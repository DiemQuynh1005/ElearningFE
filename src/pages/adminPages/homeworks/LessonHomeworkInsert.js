import React, { useContext, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { DataContext } from "../../../contexts/DataContext";

const schema = yup.object().shape({
	duration: yup
		.number()
		.typeError("Duration must be a number!")
		.min(5, "Duration cannot be less than 5!")
		.max(60, "Duration must be less than 60!")
		.integer(),
	questions: yup.array().of(
		yup.object().shape({
			question: yup
				.string()
				.required("Question cannot be blank!")
				.min(5, "Question text must be greater than 5 characters!"),
			options: yup.array().of(
				yup.object().shape({
					optionText: yup.string().required("Answer cannot be blank!"),
				})
			),
		})
	),
});

function LessonHomeworkInsert(props) {
	const navigate = useNavigate();
	const { alert, showAlert } = useContext(DataContext);
	const { id } = useParams();
	const [questions, setQuestions] = useState([
		{
			question: "",
			options: [
				{ optionText: "", isCorrect: true },
				{ optionText: "", isCorrect: false },
			],
		},
	]);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
		mode: "onChange",
	});

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
		// setValue("questions.question", "");
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

	async function onSubmit(data) {
		console.log("DATA:", data.duration);
		console.log("DATA Qs:", questions);
		console.log("Lesson_id: ", id);

		const sendData = {
			duration: data.duration,
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

	return (
		<Form onSubmit={handleSubmit(onSubmit)}>
			<div className="mb-3 mt-3">
				<label htmlFor="duration" className="form-label">
					Duration:<span className="text-danger">*</span>
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
			{questions.map((question, questionIndex) => (
				<div key={questionIndex}>
					<Form.Group className="mb-3">
						<Row>
							<Col xs={11}>
								<Form.Label>Question</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter question"
									value={question.question}
									{...register(
										`questions.${questionIndex}.question`
									)}
									onChange={(event) =>
										handleQuestionChange(
											questionIndex,
											event
										)
									}
								/>
								<span className="text-danger">
									{
										errors?.questions?.[questionIndex]
											?.question?.message
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
									{...register(
										`questions.${questionIndex}.options.${optionIndex}.optionText`
									)}
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
										errors?.questions?.[questionIndex]
											?.options[optionIndex]?.optionText
											?.message
									}
								</span>
							</Col>
							<Col xs={2}>
								<Row>
									<Col xs={6}>
										<Form.Check
											type="switch"
											id={`custom-radio-${questionIndex}-${optionIndex}`}
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
