import React, { useContext, useEffect, useState } from "react";
import { DataContext } from "../../../contexts/DataContext";
import axios from "axios";
import AOS from "aos";
import ReactPaginate from "react-paginate";
import { Alert, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import moment from "moment-timezone";
import PromotionInsert from "./PromotionInsert";

function PromotionList(props) {
	const [data, setData] = useState([]);
	const { alert } = useContext(DataContext);
	const [modalShow, setModalShow] = useState(false);

	const fetchData = async () => {
		try {
			const response = await axios.get("http://localhost:8080/api/promotions");
			setData(response.data);
		} catch (error) {
			console.log("Error FETCHING DATA: ", error);
		}
	};

	useEffect(() => {
		fetchData();
		AOS.init();
	}, []);

	//PAGINATE
	const [currentItems, setCurrentItems] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const [itemOffset, setItemOffset] = useState(0);
	const itemsPerPage = 5;
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
	console.log(data);

	return (
		<div className="container mt-3">
			<h2>Promotion Table</h2>

			{alert.type != "" && (
				<Alert variant={alert.type} dismissible transition>
					{alert.message}
				</Alert>
			)}

			<Button variant="primary" className="mb-3" onClick={() => setModalShow(true)}>
				Insert New Promotion
			</Button>
			{/* Start Lesson Form Modal */}
			<PromotionInsert
				show={modalShow}
				onHide={() => setModalShow(false)}
				// course_id={id}
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
						<th>Code</th>
						<th>Discount Rate</th>
						<th>Quantity</th>
						<th>
							<i
								class="fa-regular fa-hourglass-half"
								title="Expired At"
							></i>
						</th>
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
								const formattedExpiredAt = moment
									.parseZone(item.expired_at)
									.tz("Asia/Ho_Chi_Minh")
									.format("DD-MM-YYYY HH:mm");
								return (
									<tr key={index}>
										<td>{index + 1}</td>
										<td>{item.code}</td>
										<td>{item.discount_rate}</td>
										<td>{item.quantity}</td>
										<td>{formattedExpiredAt}</td>
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
												// to={`./${item.id}/homework`}
											>
												<b>Usage</b>
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
export default PromotionList;
