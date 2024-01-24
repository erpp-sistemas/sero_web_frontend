import { createUserWithEmailAndPassword } from 'firebase/auth'
import {doc,setDoc} from 'firebase/firestore'

export const CreaUsuarioFirebase = async (nombre_usuario, email_usuario, id_usuario, password_usuario) => {
    try {
      // Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email_usuario, password_usuario);
      const user = userCredential.user;
      
      // Obtener el UID del usuario creado
      const uid = user.uid;
  
      // Almacenar información adicional del usuario en Firestore
      await setDoc(doc(db, "usersErpp", uid), {
        isActive: true,
        IMEI: '',
        name: nombre_usuario,
        email: email_usuario,
        idaspuser: id_usuario,
        password: password_usuario,
        lastSession: '',
        lastSync: '',
        totalAccounts: 0,
        uid: uid
      });
  
      console.log('Usuario creado exitosamente:', user);
      // Puedes retornar algún indicador de éxito si es necesario
      return { success: true, user };
    } catch (error) {
      console.error('Error al crear el usuario:', error.message);
      // Puedes retornar algún indicador de error si es necesario
      return { success: false, error: error.message };
    }
  };


