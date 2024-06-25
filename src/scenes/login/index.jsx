import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { loginRequest } from "../../api/auth"
import Cookies from "js-cookie"
import { useDispatch } from "react-redux"
import { setUser } from "../../features/user/userSlice"
import LoadingModal from "../../components/LoadingModal"
import PropTypes from "prop-types"

const Login = ({ setLogin }) => {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const [signinErrors, setSigninErrors] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const onSubmit = handleSubmit((data) => {
		signin(data)
	})

	const signin = async (user) => {

		try {

			setIsLoading(true)

			const res = await loginRequest(user)
			console.log(res)

			if (res && res.data && res.data.token) {

			setTimeout(() => {
				setIsLoading(false)
				dispatch(setUser(res.data))
				setLogin(true)
				localStorage.setItem("token", res.data.token)
				Cookies.set("token", res.data.token, { expires: 7 })
				navigate("/home")
			}, 3000)

			} else {
			
				console.error("Token not found in response:", res)
				setIsLoading(false)

			}

		} catch (error) {

			if (error.response && error.response.data) {
				if (Array.isArray(error.response.data)) {
					setSigninErrors(error.response.data)
				} else {
					setSigninErrors([error.response.data.message])
				}
			} else {
				console.error("Error response:", error)
				setSigninErrors(["Error during login"])
			}
			
			setIsLoading(false)

		}

	}
  

	useEffect(() => {
		if (signinErrors.length > 0) {
		const timer = setTimeout(() => {
			setSigninErrors([])
		}, 5000)
		return () => clearTimeout(timer)
		}
	}, [signinErrors])

  return (
    <div className="bg-no-repeat bg-cover bg-center relative" style={{ backgroundImage: "url(fondo-login.jpeg)" }}>
      <LoadingModal open={isLoading} />
      <div className="absolute bg-gradient-to-b from-blue-900 to-blue-800 opacity-25 inset-0 z-0"></div>
      <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
        <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <div className="self-start hidden lg:flex flex-col text-gray-200 text-center">
            <img src="erpp-logo.png" width={200} className="mb-3 mx-auto" />
            <h1 className="mb-3 font-bold text-5xl">Bienvenido a SER0 </h1>
            <p className="pr-3 text-xl font-semibold">
              Aplicación de uso gerencial y administrativo para uso exclusivo del personal de
              <span className="text-green-400 ml-1 font-black font-serif">ERPP&copy; Corporativo</span>
            </p>
          </div>
        </div>
        <div className="flex justify-center self-center z-10 ml-10">
          <div className="p-12 bg-gray-50 mx-auto rounded-2xl w-100 border-2 border-green-500">
            <div className="mb-4">
              <img src="sero-logo.png" width={200} className="mb-3 mx-auto" />
              <h3 className="font-semibold text-2xl text-gray-800">LOGIN </h3>
              <p className="text-gray-500">Favor de ingresar tus credenciales</p>
            </div>
            {signinErrors.map((error, i) => (
              <div className="bg-red-500 p-2 text-white text-center my-2" key={i}>
                {error}
              </div>
            ))}
            <form className="space-y-5" onSubmit={onSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 tracking-wide">Usuario</label>
                <input
                  className="w-full text-base px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  type="email"
                  placeholder="mail@ser0.mx"
                  {...register("username", { required: true })}
                />
                {errors.username && <p className="text-red-500">El usuario es requerido</p>}
              </div>
              <div className="space-y-2">
                <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">Password</label>
                <input
                  className="w-full content-center text-base px-4 py-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:border-blue-400"
                  type="password"
                  placeholder="Password"
                  {...register("password", { required: true })}
                />
                {errors.password && <p className="text-red-500">La contraseña es requerida</p>}
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-blue-400 hover:bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                >
                  Sign in
                </button>
              </div>
            </form>
            <div className="pt-5 text-center text-gray-400 text-xs">
              <span>
                Copyright © 2022-2023{" "}
                <a href="https://erpp.mx" rel="noreferrer" target="_blank" title="Ser0" className="text-blue hover:text-blue-500">
                  SER0
                </a>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Login.propTypes = {
  setLogin: PropTypes.func.isRequired,
}

export default Login