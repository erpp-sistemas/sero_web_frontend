import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import app from "./firebase.config";
import { createUserDocument } from "./firestore";
import { isValidEmail, isValidPassword } from "./validationUtils";



const auth = getAuth(app);

export async function registerUserFirebase(email, password, nombre_usuario, id_usuario) {
    try {
      // ... (Código para registrar un usuario en Firebase Authentication)
        // Validar que el email sea una dirección de correo electrónico válida
    if (!isValidEmail(email)) {
        throw new Error("La dirección de correo electrónico no es válida");
      }
  
      // Validar que la contraseña cumpla con ciertos requisitos
      if (!isValidPassword(password)) {
        throw new Error("La contraseña no cumple con los requisitos mínimos");
      }
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const uid = user.uid;
  
      // Almacenar información adicional del usuario en Firestore
      await createUserDocument(uid, email, nombre_usuario, id_usuario, password);
  
      console.log("Usuario registrado exitosamente su uid:", uid);
  
      return { success: true, user };
    } catch (error) {
      // Manejar errores durante el registro
      const errorMessage = error.message;
      console.error("Error durante el registro:", errorMessage);
  
      return { success: false, error: errorMessage };
    }
  }

