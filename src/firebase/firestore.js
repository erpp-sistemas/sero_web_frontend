import { doc, getFirestore, setDoc } from "firebase/firestore"
import app from "./firebase.config"

const db = getFirestore(app)

export async function createUserDocument(uid, email, nombre_usuario, id_usuario, password) {

    try {

      await setDoc(doc(db, "usersErpp", uid), {
        isActive: true,
        IMEI: "",
        name: nombre_usuario,
        email: email,
        idaspuser: id_usuario,
        password: password,
        lastSession: "",
        lastSync: "",
        totalAccounts: 0,
        uid: uid,
      })
    } catch (error) {	
		console.error("Error al almacenar información del usuario en Firestore:", error.message)
    }

}
