import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, Col, Container, Row, Badge, Modal, Spinner, Form, Button } from "react-bootstrap";
import { ColorRing } from "react-loader-spinner";
import ReactPlayer from "react-player";
import { useParams } from "react-router-dom";
import { DataContext } from "../../contexts/DataContext";

function UserLessonPage(props) {
	const { courseId } = useParams();
	const { auth } = useContext(DataContext);
	const [lessons, setLessons] = useState([]); // Your lessons data
	const [selectedLesson, setSelectedLesson] = useState(null); // Currently selected lesson
	const [isLoading, setIsLoading] = useState(true); // Loading state

	//HOMEWORK
	const formRef = useRef(null);
	const [homework, setHomework] = useState(null);
	const [showHomeworkModal, setShowHomeworkModal] = useState(false);
	const [isHanding, setIsHanding] = useState(false);
	const [questions, setQuestions] = useState([]);
	const [answers, setAnswers] = useState({});
	const [answerErrors, setAnswerErrors] = useState({});
	const [submissionResult, setSubmissionResult] = useState(null);

	const fetchLessons = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8080/api/lessons/by-course/${courseId}`
			);
			if (response.status === 200) {
				setLessons(response.data);
				// if (response.data.length > 0) {
				// 	setSelectedLesson(response.data[0]); // Select the first lesson by default
				// }
			}
		} catch (error) {
			console.error("Error fetching lessons:", error);
		} finally {
			setIsLoading(false);
		}
	};

	const handleLessonClick = async (lesson) => {
		setSelectedLesson(lesson);
		//Plus view count
		await axios.put(`http://localhost:8080/api/lessons/${lesson.id}/view`);
		await axios
			.get(`http://localhost:8080/api/homeworks/by-lesson/${lesson.id}`)
			.then((res) => {
				if (res.status === 200) {
					const questionList = res.data.questions;
					setQuestions(questionList);
					setHomework(res.data);
				}
			})
			.catch((error) => {
				if (error.status === 404) {
					setQuestions([]);
					setHomework(null);
				} else {
					console.log("Something went wrong", error);
				}
			});
	};

	const handleShowHomeworkModal = async (id) => {
		setShowHomeworkModal(true);
	};

	const handleCloseHomeworkModal = () => {
		setShowHomeworkModal(false);
	};

	const handleOptionChange = (questionId, optionAnswer) => {
		setAnswers((prevAnswers) => {
			return prevAnswers.map((answerObj) => {
				if (answerObj.question_id === questionId) {
					return { ...answerObj, answer: optionAnswer };
				} else {
					return answerObj;
				}
			});
		});
	};

	const handleSubmitHomework = async () => {
		let hasErrors = false;
		const newAnswerErrors = {};

		questions.forEach((question) => {
			const answerForQuestion = answers.find(
				(ans) => ans.question_id === question.id
			)?.answer;
			if (!answerForQuestion || answerForQuestion === "") {
				newAnswerErrors[question.id] = "Please answer the question.";
				hasErrors = true;
			}
		});

		setAnswerErrors(newAnswerErrors); // Set the error messages

		if (hasErrors) {
			return; // Stop submission if there are errors
		}
		setIsHanding(true);
		try {
			const sentData = {
				account_id: auth.id,
				homework_id: homework.id,
				userAnswers: answers,
			};
			await axios
				.post("http://localhost:8080/api/submissions/create", sentData)
				.then((res) => {
					if (res.status === 201) {
						setSubmissionResult(res.data);
					}
				});
		} catch (error) {
			console.error("Error updating blog:", error);
			// showAlert("danger", "Failed to update blog. Please try again.");
		} finally {
			setIsHanding(false);
		}
	};

	const handleRedoHomework = () => {
		setSubmissionResult(null);
		const initialAnswers = questions.map((question) => ({
			answer: "",
			question_id: question.id,
		}));
		setAnswers(initialAnswers);

		if (formRef.current) {
			// Check if the ref is attached to the form
			formRef.current.reset(); // Reset the form
		}
	};

	useEffect(() => {
		// Initialize answers state with empty strings for each question
		const initialAnswers = questions.map((question) => ({
			answer: "",
			question_id: question.id,
		}));
		setAnswers(initialAnswers);
	}, [questions]);

	useEffect(() => {
		fetchLessons();
	}, []);

	if (isLoading) {
		return (
			<ColorRing
				visible={true}
				height="80"
				width="80"
				ariaLabel="blocks-loading"
				wrapperStyle={{ display: "block", margin: "auto" }}
				wrapperClass="blocks-wrapper"
				colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
			/>
		);
	}

	return (
		<div className="bg-image">
			<div
				className="jumbotron jumbotron-fluid page-header position-relative overlay-bottom"
				style={{ marginBottom: "90px" }}
			>
				{alert.type != "" && (
					<Alert variant={alert.type} dismissible transition>
						{alert.message}
					</Alert>
				)}
				<Container className="text-center py-5">
					<h1 className="text-white display-1">Lesson Page</h1>
				</Container>
			</div>

			<Container fluid className="py-5">
				<Container>
					<Row>
						<Col
							xs={3}
							style={{
								height: "70vh",
								overflowY: "auto",
								borderRight: "1px solid #ccc",
								padding: "20px",
							}}
						>
							<h4 className="lesson-outline">
								<Badge bg="primary w-100 p-2">
									<i class="fa-regular fa-rectangle-list me-2"></i>
									Course Outline
								</Badge>
							</h4>

							{isLoading ? (
								<ColorRing
									visible={true}
									height="80"
									width="80"
									ariaLabel="blocks-loading"
									wrapperStyle={{
										display: "block",
										margin: "auto",
									}}
									wrapperClass="blocks-wrapper"
									colors={[
										"#e15b64",
										"#f47e60",
										"#f8b26a",
										"#abbd81",
										"#849b87",
									]}
								/>
							) : (
								lessons.map((lesson) => (
									<div
										key={lesson.id}
										className={`lesson-item ${
											selectedLesson === lesson
												? "active"
												: ""
										}`}
										style={{
											cursor: "pointer",
											padding: "10px",
											borderBottom: "1px solid #eee",
										}}
										onClick={() =>
											handleLessonClick(lesson)
										}
									>
										<span className="lesson-title">
											{lesson.name} - {lesson.id}
										</span>
										{selectedLesson === lesson && (
											<i class="fa-regular fa-circle-play ms-2"></i>
										)}
									</div>
								))
							)}
						</Col>
						<Col
							xs={9}
							style={{
								// height: "100vh",
								display: "flex",
								justifyContent: "center",
							}}
						>
							{selectedLesson && (
								<div>
									<ReactPlayer
										url={selectedLesson.video}
										controls
									/>
									<div className="lesson-details">
										<span className="views">
											{selectedLesson.view}{" "}
											<i class="fa-solid fa-eye"></i>
										</span>
									</div>
									<button
										disabled={homework == null}
										className="btn btn-outline-success"
										onClick={() =>
											handleShowHomeworkModal(
												selectedLesson.id
											)
										}
									>
										Do homework
									</button>
								</div>
							)}
							{!selectedLesson && !isLoading && (
								<p>Select a lesson to view the video.</p>
							)}
						</Col>
					</Row>
				</Container>
			</Container>

			{/* Homework Modal */}
			<Modal show={showHomeworkModal} onHide={handleCloseHomeworkModal} size="lg">
				<Modal.Header closeButton>
					<Modal.Title>
						<h3>Homework</h3>
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<h5>Choose the best option for each question.</h5>
					<Form ref={formRef}>
						{questions.map((question, index) => (
							<div key={question.id} className="mb-4">
								{answerErrors[question.id] && (
									<p className="text-danger mt-1">
										{answerErrors[question.id]}
									</p>
								)}
								<p className="fw-bold">
									{index + 1}. {question.question}
								</p>

								{/* OPTIONS */}
								{question.options.map((option) => (
									<div key={option.id} className="form-check">
										<input
											type="radio"
											className="form-check-input"
											id={`question-${question.id}-option-${option.id}`}
											name={`question-${question.id}`}
											value={option.id}
											// checked={
											// 	answers[question.id] ===
											// 	option.id
											// }
											onChange={() =>
												handleOptionChange(
													question.id,
													option.optionText
												)
											}
										/>
										<label
											className="form-check-label"
											htmlFor={`question-${question.id}-option-${option.id}`}
										>
											{option.optionText}
										</label>
									</div>
								))}
							</div>
						))}
					</Form>
					{submissionResult && (
						<div className="mt-4">
							<h3>Result</h3>
							{submissionResult.mark && (
								<p>Your mark: {submissionResult.mark}</p>
							)}
						</div>
					)}
				</Modal.Body>
				<Modal.Footer>
					{submissionResult && submissionResult.mark === 100 ? ( // Condition 1: Mark is 100
						<Button variant="danger" onClick={handleCloseHomeworkModal}>
							Close
						</Button>
					) : submissionResult && submissionResult.mark < 100 ? ( // Condition 2: Mark is less than 100
						<Button
							variant="outline-success"
							onClick={handleRedoHomework}
							disabled={isHanding}
						>
							Re-do
						</Button>
					) : (
						// Condition 3: No submission result yet (or other cases)
						<Button
							variant="primary"
							onClick={handleSubmitHomework}
							disabled={isHanding}
						>
							{isHanding ? (
								<>
									<Spinner
										as="span"
										animation="border"
										size="sm"
										role="status"
										aria-hidden="true"
									/>
									<span className="ms-2">Submitting...</span>
								</>
							) : (
								"Submit"
							)}
						</Button>
					)}
				</Modal.Footer>
			</Modal>
		</div>
	);
}

export default UserLessonPage;
