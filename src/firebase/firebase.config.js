import { initializeApp } from "firebase/app"

const firebaseConfig = {
	apiKey: "AIzaSyDTa7seu8fET3MLvuF6RnEPXdAJeXFbhvw",
	authDomain: "ser0-f7d42.firebaseapp.com",
	projectId: "ser0-f7d42",
	storageBucket: "ser0-f7d42.appspot.com",
	messagingSenderId: "80823137652",
	appId: "1:80823137652:web:a91ae58440dc1935eca821"
}

const app = initializeApp(firebaseConfig)

export default app