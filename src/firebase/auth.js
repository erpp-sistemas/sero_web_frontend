import { createUserWithEmailAndPassword, getAuth } from "firebase/auth"
import app from "./firebase.config"
import { createUserDocument } from "./firestore"
import { isValidEmail, isValidPassword } from "./validationUtils"

const auth = getAuth(app)

export async function registerUserFirebase(email, password, nombre_usuario, id_usuario) {

	try {

		if (!isValidEmail(email)) {
			throw new Error("La dirección de correo electrónico no es válida")
		}

		if (!isValidPassword(password)) {
			throw new Error("La contraseña no cumple con los requisitos mínimos")
		}

		const userCredential = await createUserWithEmailAndPassword(auth, email, password)
		const user = userCredential.user
		const uid = user.uid
		await createUserDocument(uid, email, nombre_usuario, id_usuario, password)
		return { success: true, user }

	} catch (error) {
			const errorMessage = error.message
			console.error("Error durante el registro:", errorMessage)
			return { success: false, error: errorMessage }

	}

}

