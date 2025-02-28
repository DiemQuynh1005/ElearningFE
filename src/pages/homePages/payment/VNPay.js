import React from "react";
import queryString from "query-string";
import { sha512 } from "js-sha512";
import { publicIpv4 } from "public-ip";
import { format } from "date-fns";

const HASH_SECRET = "BEE0W9FW8QFF8OOAK3DMVW331HLY7TSD";
const TMNCODE = "WB3T8SNI";
const VNP_URL = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
const VNP_RETURN = "http://localhost:3000/vnpayResponse";

function VNPay(props) {
	const { totalAmount } = props;

	const onSubmit = async () => {
		const date = new Date();

		const createDate = format(date, "yyyyMMddHHmmss");
		const orderId = Array.from({ length: 5 }, () => Math.floor(Math.random() * 16))
			.map((n) => n.toString(16))
			.join("");

		const amount = totalAmount;
		const bankCode = "NCB";

		const orderInfo = "Testing";
		const orderType = "other";
		const locale = "vn";
		const currCode = "VND";

		const vnp_Params = {
			vnp_Version: "2.1.0",
			vnp_Command: "pay",
			vnp_TmnCode: TMNCODE,
			vnp_Locale: locale,
			vnp_CurrCode: currCode,
			vnp_TxnRef: orderId,
			vnp_OrderInfo: orderInfo,
			vnp_OrderType: orderType,
			vnp_Amount: amount * 100,
			vnp_ReturnUrl: VNP_RETURN,
			vnp_IpAddr: await publicIpv4().catch((error) => {
				console.error("Error getting public IP address:", error);
				// Handle IP address retrieval error (optional)
				return "http://localhost:3000"; // Replace with a default IP if necessary
			}),
			vnp_CreateDate: createDate,
			vnp_BankCode: bankCode,
		};

		// Sort parameters alphabetically
		const sortedParams = Object.keys(vnp_Params)
			.sort()
			.reduce((obj, key) => {
				obj[key] = vnp_Params[key];
				return obj;
			}, {});

		const hmac = sha512.hmac.create(HASH_SECRET);
		hmac.update(queryString.stringify(sortedParams));
		const secureHash = hmac.hex();

		vnp_Params.vnp_SecureHash = secureHash;

		const completeUrl = `${VNP_URL}?${queryString.stringify(sortedParams, {
			encode: true,
		})}&vnp_SecureHash=${secureHash}`;

		// Redirect to VNPAY for payment
		window.location.href = completeUrl;
	};

	return (
		<button type="button" className="btn btn-success" onClick={onSubmit}>
			Pay with VNPAY
		</button>
	);
}

export default VNPay;
