import React, { useContext, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link, useParams } from "react-router-dom";
import { DataContext } from "../../../contexts/DataContext";
import { ColorRing } from "react-loader-spinner";
import { Alert, Button } from "react-bootstrap";
import AOS from "aos";
import axios from "axios";
import CourseLessonInsert from "./CourseLessonInsert";

function CourseLessonsList(props) {
	const [data, setData] = useState([]);
	const [course, setCourse] = useState({});
	const { alert } = useContext(DataContext);
	const { id } = useParams();
	const [modalShow, setModalShow] = useState(false);

	const fetchData = async () => {
		try {
			const response = await axios.get(
				`http://localhost:8080/api/lessons/by-course/${id}`
			);
			setData(response.data);
			data.forEach((lesson) => {
				setCourse(lesson.course);
			});
		} catch (error) {
			console.log("Error FETCHING DATA: ", error);
		}
	};

	useEffect(() => {
		fetchData();
		AOS.init();
	}, [data]);

	//PAGINATE
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);
	const itemsPerPage = 3;
	useEffect(() => {
		const endOffset = itemOffset + itemsPerPage;
		setCurrentItems(data.slice(itemOffset, endOffset));
		setPageCount(Math.ceil(data.length / itemsPerPage));
	}, [itemOffset, itemsPerPage, data]);
	const handlePageClick = (event) => {
		const newOffset = (event.selected * itemsPerPage) % data.length;
		setItemOffset(newOffset);
	};
	//END PAGINATE

	return (
		<div className="container mt-3">
			<h2>{Object.keys(course).length === 0 ? "" : `${course.name} - `}Lesson Table</h2>

			{alert.type != "" && (
				<Alert variant={alert.type} dismissible transition>
					{alert.message}
				</Alert>
			)}

			<Button variant="primary" className="mb-3" onClick={() => setModalShow(true)}>
				Insert New Lesson
			</Button>
			{/* Start Lesson Form Modal */}
			<CourseLessonInsert
				show={modalShow}
				onHide={() => setModalShow(false)}
				course_id={id}
			/>
			{/* End Lesson Form Modal */}

			{/* LOADER SPINNER */}
			{data.length == 0 && (
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
			<table className="table table-striped table-dark" data-aos="fade">
				<thead>
					<tr>
						<th>#</th>
						<th>Name</th>
						<th>Video</th>
						<th>View</th>
						{/* <th>Price</th> */}
						<th>Status</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					{data.length > 0 &&
						currentItems
							.slice()
							.sort((a, b) => b.id - a.id)
							.map((item, index) => {
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{item.name}</td>
										<td>
											<video
												className="img-thumbnail"
												width="213"
												height="160"
												controls
												src={item.video}
											/>
										</td>
										<td>{item.view}</td>
										<td>
											<span
												className={`badge ${
													item.status
														? "bg-success"
														: "bg-danger"
												}`}
											>
												{item.status ? "ON" : "OFF"}
											</span>
										</td>
										<td>
											<Link className="btn btn-success me-2">
												<b>Edit</b>
											</Link>

											<Link
												className="btn btn-danger"
												to={`/admin/lesson/${item.id}/homeworks`}
											>
												<b>To Homework</b>
											</Link>
										</td>
									</tr>
								);
							})}
				</tbody>
			</table>
			<ReactPaginate
				nextLabel="next >"
				onPageChange={handlePageClick}
				pageRangeDisplayed={3}
				marginPagesDisplayed={2}
				pageCount={pageCount}
				previousLabel="< previous"
				pageClassName="page-item"
				pageLinkClassName="page-link"
				previousClassName="page-item"
				previousLinkClassName="page-link"
				nextClassName="page-item"
				nextLinkClassName="page-link"
				breakLabel="..."
				breakClassName="page-item"
				breakLinkClassName="page-link"
				containerClassName="pagination"
				activeClassName="active"
				renderOnZeroPageCount={null}
			/>
		</div>
	);
}

export default CourseLessonsList;
