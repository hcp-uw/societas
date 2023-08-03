import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"

export const useAuth = () => useContext(AuthContext) // hook to access context
