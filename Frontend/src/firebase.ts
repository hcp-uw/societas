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
  doc,
  getDoc,
  arrayUnion,
  query,
  where,
  arrayRemove,
  type Timestamp,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore"
// interacts with firebase to get (GET) the actual data and update (POST) it
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithCustomToken,
  signOut,
} from "firebase/auth"

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

export async function uploadProjectImage(projId: string, image: Blob) {
  const imageRef = ref(storage, `projects/${projId}`)
  await uploadBytes(imageRef, image)
  const url = await getDownloadURL(imageRef)
  return url
}

// projects
type CreateProjParams = {
  title: string
  description: string
  meetLocation: string
  maxMembers: string
  image: Blob
  ownerId: string
  meetType: string
  startDate: string
}
export async function createProject({
  title,
  description,
  meetLocation,
  maxMembers,
  image,
  ownerId,
  meetType,
  startDate,
}: CreateProjParams) {
  const docRef = await addDoc(collection(db, "projects"), {
    title: title,
    description: description,
    meetLocation: meetLocation,
    maxMembers: maxMembers,
    createdAt: serverTimestamp(),
    ownerId: ownerId,
    members: [],
    requestants: [],
    meetType: meetType,
    startDate: startDate,
  })

  const url = await uploadProjectImage(docRef.id, image)
  await updateDoc(docRef, {
    imageUrl: url,
  })
}

type MeetType = "in-person" | "hybrid" | "remote"
export type Project = {
  id: string
  title: string
  description: string
  meetLocation: string
  maxMembers: string
  createdAt: Timestamp
  ownerId: string
  members: string[]
  requestants: string[]
  meetType: MeetType
  startDate: string
  imageUrl: string
}
export async function getAllProjects() {
  const snapshot = await getDocs(collection(db, "projects"))
  console.log("getting projects")

  return addIdsToSnapShot(snapshot) as Project[]
}

export async function getProjectById(id: string) {
  if (id === "") return
  const docSnapshot = await getDoc(doc(db, "projects", id))

  if (!docSnapshot.exists()) throw new Error("project does not exists")

  const data = { id: docSnapshot.id, ...docSnapshot.data() } as Project

  return data
}

export async function getProjectsByUserId(userId: string) {
  if (userId.length < 1) return
  const projsRef = collection(db, "projects")
  const q = query(projsRef, where("ownerId", "==", userId))
  const qSnapShot = await getDocs(q)

  return addIdsToSnapShot(qSnapShot) as Project[]
}

// requests

type JoinReqParams = {
  projectId: string
  requestantId: string
  ownerId: string
  message: string
  projectTitle: string
  imageUrl: string
}
export async function createProjectJoinRequest({
  projectId,
  requestantId,
  ownerId,
  message,
  projectTitle,
  imageUrl,
}: JoinReqParams) {
  const projectRef = doc(db, "projects", projectId)
  await updateDoc(projectRef, {
    requestants: arrayUnion(requestantId),
  })

  const requestRef = await addDoc(collection(db, "requests"), {
    requestantId: requestantId,
    projectId: projectId,
    status: "pending",
    ownerId: ownerId,
    message: message,
    createdAt: serverTimestamp(),
    projectTitle: projectTitle,
    imageUrl: imageUrl,
  })

  return requestRef
}

type Request = {
  id: string
  requestantId: string
  projectId: string
  status: string
  ownerId: string
  message: string
  createdAt: Timestamp
  projectTitle: string
  imageUrl: string
}
export async function getAllPendingRequests(currentUserId: string) {
  const requestsRef = collection(db, "requests")
  const q = query(
    requestsRef,
    where("ownerId", "==", currentUserId),
    where("status", "==", "pending")
  )
  const qSnapShot = await getDocs(q)

  return addIdsToSnapShot(qSnapShot) as Request[]
}

export async function acceptRequest(
  requestId: string,
  projectId: string,
  requestantId: string
) {
  await updateDoc(doc(db, "requests", requestId), {
    status: "accepted",
  })

  await updateDoc(doc(db, "projects", projectId), {
    members: arrayUnion(requestantId),
    requestants: arrayRemove(requestantId),
  })

  console.log("success")
}

// project posts

type ProjPost = {
  id: string
  title: string
  comment: string
  likes: number
  createdAt: Timestamp
}
export async function getAllProjectPosts(projectId: string) {
  const projPostsSnap = await getDocs(
    collection(db, `projects/${projectId}/posts`)
  )

  return addIdsToSnapShot(projPostsSnap) as ProjPost[]
}
export async function createProjectPost(
  projectId: string,
  post: { title: string; comment: string }
) {
  await addDoc(collection(db, `projects/${projectId}/posts`), {
    title: post.title,
    comment: post.comment,
    likes: 0,
    createdAt: serverTimestamp(),
  })
}

export async function getProjectPostById(
  projectId: string,
  projectPostId: string
) {
  if (projectId.length < 1 || projectPostId.length < 1) return
  const postSnapShot = await getDoc(
    doc(db, `projects/${projectId}/posts/${projectPostId}`)
  )

  if (!postSnapShot.exists()) return

  const data = { id: postSnapShot.id, ...postSnapShot.data() } as ProjPost
  return data
}

// auth
// export function signup(email, password) {
//   return createUserWithEmailAndPassword(auth, email, password)
// }

// export function login(email, password) {
//   return signInWithEmailAndPassword(auth, email, password)
// }

// export function signInWithClerkToken(token) {
//   return signInWithCustomToken(auth, token)
// }

// export function signOutFromFirebase() {
//   return signOut(auth)
// }

//helper function to add id of documents into array
type Doc = ProjPost | Project | Request
function addIdsToSnapShot(snapshot: QuerySnapshot<DocumentData, DocumentData>) {
  let queryData: Doc[] = []
  snapshot.forEach((doc) => {
    if (!doc.exists()) return
    const data = { id: doc.id, ...doc.data() } as Doc
    queryData = [...queryData, data]
  })

  return queryData
}
