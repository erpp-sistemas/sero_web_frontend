/* // Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTa7seu8fET3MLvuF6RnEPXdAJeXFbhvw",
  authDomain: "ser0-f7d42.firebaseapp.com",
  projectId: "ser0-f7d42",
  storageBucket: "ser0-f7d42.appspot.com",
  messagingSenderId: "80823137652",
  appId: "1:80823137652:web:a91ae58440dc1935eca821"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); */

import { initializeApp } from "firebase/app";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG8Ai-1wnSTdZ_0NgYDDGqBrsn0aDeFwc",
  authDomain: "bdprueba-845a2.firebaseapp.com",
  projectId: "bdprueba-845a2",
  storageBucket: "bdprueba-845a2.appspot.com",
  messagingSenderId: "300439811834",
  appId: "1:300439811834:web:6ba150be427badfdc4bb43",
};

const app = initializeApp(firebaseConfig);

export default app

/* const auth = getAuth(app);
const db = getFirestore(app)
// Función para registrar un usuario
const registerUser = async (email, password, nombre_usuario, id_usuario,) => {
  try {
    // Validar que el email sea una dirección de correo electrónico válida
    if (!isValidEmail(email)) {
      throw new Error("La dirección de correo electrónico no es válida");
    }

    // Validar que la contraseña cumpla con ciertos requisitos (puedes personalizar según tus necesidades)
    if (!isValidPassword(password)) {
      throw new Error("La contraseña no cumple con los requisitos mínimos");
    }

    // Crear usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Obtener el usuario registrado
    const user = userCredential.user;
    const uid = user.uid;

    // Mostrar mensaje de éxito
    console.log("Usuario registrado exitosamente su uid:", uid);

    // Almacenar información adicional del usuario en Firestore
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
    });

    
    // Puedes retornar información adicional si es necesario
    return { success: true, user };
  } catch (error) {
    // Manejar errores durante el registro
    const errorMessage = error.message;
    console.error("Error durante el registro:", errorMessage);

    // Puedes retornar información adicional si es necesario
    return { success: false, error: errorMessage };
  }
};

// Función para validar una dirección de correo electrónico
const isValidEmail = (email) => {
  // Implementa la lógica de validación según tus necesidades
  // Puedes usar expresiones regulares u otras técnicas
  return true;
};

// Función para validar una contraseña
const isValidPassword = (password) => {
  // Implementa la lógica de validación según tus necesidades
  // Puedes verificar la longitud, caracteres especiales, etc.
  return true;
};

// Uso de la función para registrar un usuario
const email = "david50.lopez50@ser0.mx";
const password = "Ratel@@2009080220";
const nombre_usuario = "david50";
const id_usuario = "200";


registerUser(email, password, nombre_usuario, id_usuario,);


 */