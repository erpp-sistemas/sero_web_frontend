import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { loginRequest } from "../../api/auth";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/user/userSlice";
import LoadingModal from "../../components/LoadingModal";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import LoginImage from "../../../public/login-image.svg";
import LogoImage from "../../../public/sero_claro.png";
import {
  Person,
  Public,
  Visibility,
  VisibilityOff,
  YouTube,
} from "@mui/icons-material";

const Login = ({ setLogin }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signinErrors, setSigninErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit((data) => {
    signin(data);
  });

  const signin = async (user) => {
    try {
      setIsLoading(true);

      const res = await loginRequest(user);
      console.log(res);

      if (res && res.data && res.data.token) {
        setTimeout(() => {
          setIsLoading(false);
          dispatch(setUser(res.data));
          setLogin(true);
          localStorage.setItem("token", res.data.token);
          Cookies.set("token", res.data.token, { expires: 7 });
          navigate("/home");
        }, 3000);
      } else {
        console.error("Token not found in response:", res);
        setIsLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.data) {
        if (Array.isArray(error.response.data)) {
          setSigninErrors(error.response.data);
        } else {
          setSigninErrors([error.response.data.message]);
        }
      } else {
        console.error("Error response:", error);
        setSigninErrors(["Error during login"]);
      }

      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (signinErrors.length > 0) {
      const timer = setTimeout(() => {
        setSigninErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [signinErrors]);

  return (
    <div className="font-[sans-serif] bg-gradient-to-b from-gray-800 to-gray-900 text-gray-100">
      <LoadingModal open={isLoading} />
      <div className="min-h-screen flex items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-4 max-w-6xl w-full">
          <div className="relative border border-gray-600 rounded-lg p-6 max-w-md shadow-[0_2px_22px_-4px_rgba(93,96,127,0.3)] max-md:mx-auto bg-gray-800">
            <div className="flex justify-center mb-0">
              <img
                src={LogoImage}
                alt="Nombre del Software"
                className="w-32 h-auto"
              />
            </div>
            {signinErrors.map((error, i) => (
              <div
                className="bg-red-500 p-2 text-white text-center my-2"
                key={i}
              >
                {error}
              </div>
            ))}
            <form className="space-y-4 mt-5" onSubmit={onSubmit}>
              <div className="mb-8">
                <h3 className="text-gray-100 text-center text-3xl font-extrabold">
                  Iniciar sesión
                </h3>
                <p className="text-gray-400 text-sm mt-4 leading-relaxed">
                  Inicie sesión en su cuenta y explore un mundo de
                  posibilidades. Tu viaje comienza aquí
                </p>
              </div>

              <div>
                <label className="text-gray-100 text-sm mb-2 block">
                  User name
                </label>
                <input
                  name="username"
                  type="text"
                  required
                  className="w-full text-sm text-gray-100 bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg outline-blue-600 placeholder-gray-400"
                  placeholder="Enter user name"
                  {...register("username", { required: true })}
                />
                {errors.username && (
                  <p className="text-red-500">El usuario es requerido</p>
                )}
              </div>

              <div>
                <label className="text-gray-100 text-sm mb-2 block">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"} // Cambia el tipo basado en el estado
                    required
                    className="w-full text-sm text-gray-100 bg-gray-700 border border-gray-600 px-4 py-3 rounded-lg outline-blue-600 placeholder-gray-400"
                    placeholder="Enter password"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <p className="text-red-500">La contraseña es requerida</p>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)} // Alterna el estado
                    className="absolute right-4 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full shadow-xl py-3 px-4 text-sm tracking-wide rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Acceder
              </button>
              <div className="mt-6 flex justify-center items-center space-x-4">
                <ul className="flex items-center space-x-4">
                  <li className="bg-transparent text-blue-500 hover:text-blue-500 transition flex items-center justify-center shrink-0">
                    <a
                      href="https://www.erpp.mx"
                      target="_blank"
                      className="text-2xl"
                    >
                      <Public sx={{ fontSize: "36px" }} />
                    </a>
                  </li>
                  <li className="bg-transparent text-red-500 hover:text-red-600 transition flex items-center justify-center shrink-0">
                    <a
                      href="https://www.youtube.com/watch?v=jNVWbJrOvvQ"
                      target="_blank"
                    >
                      <YouTube sx={{ fontSize: "36px" }} />
                    </a>
                  </li>
                </ul>
              </div>
            </form>
          </div>

          <div className="lg:h-[600px] md:h-[400px] sm:h-[400px] max-md:mt-8">
            <img
              src={LoginImage}
              className="w-full h-full max-md:w-4/5 mx-auto block object-contain"
              alt="Dining Experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  setLogin: PropTypes.func.isRequired,
};

export default Login;
