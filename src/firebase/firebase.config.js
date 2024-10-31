import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const firebaseConfig = {
	apiKey: "AIzaSyDTa7seu8fET3MLvuF6RnEPXdAJeXFbhvw",
	authDomain: "ser0-f7d42.firebaseapp.com",
	projectId: "ser0-f7d42",
	storageBucket: "ser0-f7d42.appspot.com",
	messagingSenderId: "80823137652",
	appId: "1:80823137652:web:a91ae58440dc1935eca821"
}

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFile = async (file, name) => {
	const storageRef = ref(storage, name);
	await uploadBytes(storageRef, file);
	const urlImage = await getDownloadURL(storageRef);
	return urlImage;
}

export default app

