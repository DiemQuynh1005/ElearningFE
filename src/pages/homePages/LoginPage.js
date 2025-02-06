import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "aos/dist/aos.css";
import { DataContext } from "../../contexts/DataContext";

const schema = yup
	.object()
	.shape({
		email: yup.string().required().email(),
		password: yup.string().required(),
	})
	.required();

function LoginPage(props) {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(schema),
	});

	const { auth, login, showAlert, alert, hideAlert } = useContext(DataContext);
	const navigate = useNavigate();

	async function onSubmit(data) {
		data.email = data.email.trim();
		data.password = data.password.trim();
		await axios
			.post("http://localhost:8080/api/accounts/login", data)
			.then((res) => {
				if (res.status == 200) {
					login(res.data);
				}
			})
			.catch((error) => {
				if (error.response.status == 500) {
					showAlert("danger", "Wrong Username OR Password");
				} else {
					console.log("Something went wrong", error);
					showAlert(
						"danger",
						"An unexpected error occurred. Please try again later."
					);
				}
			});
	}

	useEffect(() => {
		document.title = "LOGIN PAGE";
		AOS.init({
			duration: 1200,
		});
		if (Object.keys(auth).length > 0) {
			showAlert("warning", "Sign In Alredy!");
			navigate("/");
		}
	}, []);
	return (
		<div className="login-container">
			<div className="login-left" data-aos="fade-left">
				<img
					src="/assets/images/banner-item-01.jpg"
					alt="Popcorn"
					className="full-image"
				/>
				<div className="signup-message"></div>
			</div>
			<div className="login-right">
				{alert.type !== "" && (
					<Alert variant={alert.type} dismissible transition>
						{alert.message}
					</Alert>
				)}
				<div className="login-form" data-aos="zoom-out">
					<h1 className="text-center">SIGN IN</h1>
					<p className="text-center">
						Access your MovieClub benefits and rewards
					</p>
					<form onSubmit={handleSubmit(onSubmit)}>
						<div className="form-group">
							<input
								type="text"
								className="form-control form-control-user"
								placeholder="Enter Email"
								{...register("email")}
							/>
							<span className="text-danger">
								{errors.email?.message}
							</span>
						</div>
						<div className="form-group">
							<label></label>
							<input
								type="password"
								className="form-control form-control-user"
								placeholder="Enter Password"
								{...register("password")}
							/>
							<span className="text-danger">
								{errors.password?.message}
							</span>
						</div>
						<input
							type="submit"
							value="Sign in"
							className="btn btn-x btn-block"
						/>
					</form>
					<div className="text-center">
						<Link to="/forgotpassword">Forgot Password?</Link>
					</div>
					<div className="text-center">
						<Link to="/register">Create New Account</Link>
					</div>
				</div>
			</div>
			<style>{`
    /* Container chính chứa form đăng nhập và phần bên trái */
    .login-container {
        display: flex;
        height: 100vh;
        width: 100vw;
        margin: 0;
        padding: 0;
        background: linear-gradient(180deg, #1b0d0d, #3d0f0f); /* Đặt màu nền gradient đỏ tối */
    }

.form-control-user {
     background-color: transparent; /* Làm trong suốt nền */
    border: none; /* Bỏ border */
    border-bottom: 2px solid #f8f8ff ; /* Đường gạch dưới màu đỏ */
    color: white;
    padding: 15px;
    margin-bottom: 20px;
    border-radius: 0; /* Bỏ bo góc */
    width: 100%;
    font-size: 18px;
}

.form-control-user:focus {
     outline: none; /* Bỏ đường viền khi focus */
    border-bottom: 2px solid #ff512f; /* Đường gạch dưới đậm hơn khi focus */
}
				/* Thay đổi màu chữ placeholder */
.form-control-user::placeholder {
    color: #999999;
    font-size: 16px;
}

.form-group label {
    display: block;
    color: white;
    margin-bottom: 5px;
}



    /* Phần bên trái với thông điệp đăng ký */

    .login-left {
        width: 58%;/* Giảm kích thước phần hình ảnh */
								 height: 100vh; /* Đảm bảo chiều cao bằng với chiều cao của phần login */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;
        background-color: transparent;
        margin: 0;
        padding: 0;
        background-size: contain; /* Đảm bảo hình ảnh được thu nhỏ lại */
        background-position: center; /* Căn chỉnh hình ảnh vào giữa */
        background-repeat: no-repeat; /* Không lặp lại hình ảnh */
    }

    /* Thông điệp đăng ký */
    .signup-message {
        text-align: center;
        color: white;
        font-size: 36px;
        margin: 0;
        padding: 0;
    }

    .signup-message h1 {
        font-size: 48px;
        font-weight: bold;
        margin: 0;
        padding: 0;
    }

    .signup-message p {
        font-size: 24px;
        margin: 0;
        padding: 0;
    }

    /* Phần bên phải chứa form đăng nhập */
    .login-right {
        width: 50%;
        padding: 50px;
        background-color: #111;
        display: flex;
        flex-direction: column;
        justify-content: center;
        position: relative;
        border-radius: 10px;
        background: linear-gradient(to right, #111111, #480607);
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2); /* Thêm bóng đổ */
								height: 108vh;
    }

    /* Nút đóng form đăng nhập */
    .close-btn {
        position: absolute;
        top: 20px;
        right: 30px;
        font-size: 24px;
        cursor: pointer;
        color: white;
    }

    /* Form đăng nhập */
    .login-form {
        max-width: 400px;
        margin: 0 auto;
    }

    /* Tiêu đề form đăng nhập */
    .login-form h1 {
        color: white;
        margin-bottom: 20px;
        font-size: 28px;
        font-weight: bold;
    }

    /* Mô tả dưới tiêu đề */
    .login-form p {
        color: #cccccc;
        font-size: 16px;
        margin-bottom: 30px;
    }

    

    /* Nút Sign In */
    .btn-x {
        background: linear-gradient(90deg, #ff512f 0%, #dd2476 100%);
        border: none;
        padding: 15px;
        font-size: 16px;
        border-radius: 5px;
        width: 100%;
        cursor: pointer;
        color: white;
        text-transform: uppercase;
        font-weight: bold;
    }

    /* Hiệu ứng hover cho nút Sign In */
    .btn-x:hover {
        background: linear-gradient(90deg, #ff6f47 0%, #f23a85 100%);
    }

    /* Căn giữa và đổi màu chữ liên kết Forgot Password và Create New Account */
    .text-center {
        color: white;
        margin-top: 20px;
    }

    /* Đổi màu cho các thông báo lỗi */
    .text-danger {
        color: #ff4c4c;
    }

    /* Liên kết Forgot Password và Create New Account màu đỏ */
    .text-center a {
        color: #ff512f;
        font-weight: bold;
        text-decoration: none;
    }

    /* Hiệu ứng hover cho liên kết */
    .text-center a:hover {
        color: #dd2476;
    }
`}</style>
		</div>
	);
}

export default LoginPage;
