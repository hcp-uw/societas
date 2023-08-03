// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAnalytics } from "firebase/analytics"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
  updateDoc,
  getDocs,
} from "firebase/firestore"

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const storage = getStorage(app)
export const db = getFirestore(app)
export const auth = getAuth(app)

function uploadProjectImage(projId, image) {
  const storageRef = ref(storage, `projects/${projId}`)
  return uploadBytes(storageRef, image)
}

// projects
export async function createProject(
  title,
  description,
  meetLocation,
  maxMembers,
  image
) {
  const docRef = await addDoc(collection(db, "projects"), {
    title: title,
    description: description,
    meetLocation: meetLocation,
    maxMembers: maxMembers,
    createdAt: serverTimestamp(),
  })

  await uploadProjectImage(docRef.id, image)
  const imageRef = ref(storage, `projects/${docRef.id}`)
  const url = await getDownloadURL(imageRef)
  await updateDoc(docRef, {
    imageURL: url,
  })
}

export async function getAllProjects() {
  const snapshot = await getDocs(collection(db, "projects"))
  let docData = []
  snapshot.forEach((doc) => {
    docData = [...docData, doc.data()]
  })
  return docData
}

// auth

export async function signup(email, password) {
  return createUserWithEmailAndPassword(auth, email, password)
}

export async function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}
