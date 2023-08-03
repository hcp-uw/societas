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

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB124s_CJjxDcAgA4_1qs4-N_6oanO5Gf4",
  authDomain: "societas-9b159.firebaseapp.com",
  projectId: "societas-9b159",
  storageBucket: "societas-9b159.appspot.com",
  messagingSenderId: "20413814218",
  appId: "1:20413814218:web:7f8f830657d6a1e16a6b33",
  measurementId: "G-ZQS794QND5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const storage = getStorage(app)
export const db = getFirestore(app)

function uploadProjectImage(projId, image) {
  const storageRef = ref(storage, `projects/${projId}`)
  return uploadBytes(storageRef, image)
}

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
