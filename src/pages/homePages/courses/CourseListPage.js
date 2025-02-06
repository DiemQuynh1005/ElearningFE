import React, { useContext, useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";

function CourseListPage(props) {
	const { alert, courses } = useContext(DataContext);

	//PAGINATE
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);
	const itemsPerPage = 6;
	useEffect(() => {
		const endOffset = itemOffset + itemsPerPage;
		setCurrentItems(courses.slice(itemOffset, endOffset));
		setPageCount(Math.ceil(courses.length / itemsPerPage));
	}, [itemOffset, itemsPerPage, courses]);
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % courses.length;
		setItemOffset(newOffset);
	};
	//END PAGINATE

	return (
		<>
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
					<h1 className="text-white display-1">Courses</h1>
					{/* <div
						className="mx-auto mb-5"
						style={{ width: "100%", maxWidth: "600px" }}
					>
						<InputGroup>
							<Dropdown>
								<Dropdown.Toggle
									variant="outline-light bg-white text-body px-4"
									id="dropdown-basic"
								>
									{selectedCourse}
								</Dropdown.Toggle>
								<Dropdown.Menu>
									<Dropdown.Item
										onClick={() =>
											handleCourseSelect("Courses 1")
										}
									>
										Courses 1
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() =>
											handleCourseSelect("Courses 2")
										}
									>
										Courses 2
									</Dropdown.Item>
									<Dropdown.Item
										onClick={() =>
											handleCourseSelect("Courses 3")
										}
									>
										Courses 3
									</Dropdown.Item>
								</Dropdown.Menu>
							</Dropdown>
							<Form.Control
								type="text"
								className="form-control border-light" // Added form-control class
								style={{ padding: "30px 25px" }}
								placeholder="Keyword"
							/>
							<Button variant="secondary" className="px-4 px-lg-5">
								Search
							</Button>
						</InputGroup>
					</div> */}
				</Container>
			</div>

			<Container fluid className="py-5">
				<Container className="py-5">
					<Row className="mx-0 justify-content-center">
						<Col lg={8}>
							<div className="section-title text-center position-relative mb-5">
								<h6 className="d-inline-block position-relative text-secondary text-uppercase pb-2">
									Our Courses
								</h6>
								<h1 className="display-4">
									Checkout New Releases Of Our Courses
								</h1>
							</div>
						</Col>
					</Row>
					<Row>
						{currentItems.map((item, index) => (
							<Col lg={4} md={6} className="pb-4" key={index}>
								<Link
									className="courses-list-item position-relative d-block overflow-hidden mb-2"
									to={`/courses/${item.id}`}
								>
									<img
										className="img-fluid"
										src={`http://localhost:8080/uploads/courses/${item.thumbnail}`}
										alt={`Course ${item.name}`}
									/>
									<div className="courses-text">
										<h4 className="text-center text-white px-3">
											{item.name}
										</h4>
										<div className="border-top w-100 mt-3">
											<div className="d-flex justify-content-between p-4">
												<span className="text-white">
													<i className="fa-solid fa-chalkboard-user mr-2"></i>
													{item.account.name}
												</span>
												{/* <span className="text-white">
													<i className="fa fa-star mr-2"></i>
													4.5{" "}
													<small>(250)</small>
												</span> */}
											</div>
										</div>
									</div>
								</Link>
							</Col>
						))}
					</Row>
					<Row>
						<Col xs={12}>
							<ReactPaginate
								breakLabel="..."
								nextLabel="Next >"
								onPageChange={handlePageClick}
								pageRangeDisplayed={3}
								pageCount={pageCount}
								previousLabel="< Previous"
								renderOnZeroPageCount={null}
								containerClassName="pagination pagination-lg justify-content-center mb-0"
								pageClassName="page-item"
								pageLinkClassName="page-link"
								previousClassName="page-item"
								nextClassName="page-item"
								previousLinkClassName="page-link rounded-0"
								nextLinkClassName="page-link rounded-0"
								activeClassName="active"
							/>
						</Col>
					</Row>
				</Container>
			</Container>
		</>
	);
}

export default CourseListPage;
