import axios from "axios"
import { useState } from "react"
import PropType from "prop-types"
import { useContext, createContext } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext) // hook to access context

AuthContextProvider.propTypes = {
  children: PropType.node,
}

export function AuthContextProvider({ children }) {
  const [user, setUSer] = useState("") // curent user state
  const [authModel, setAuthModel] = useState(false) // bool to show auth model or not

  const instance = axios.create({
    baseURL: "http://arjunnaik.pythonanywhere.com",
  })

  // returns a promise to register a new user
  // params:
  //    email -> email of user
  //    password -> password of user

  function register(email, password) {
    return instance.post("/register", {
      email: email,
      password: password,
    })
  }

  // returns a promise that logins in the user
  // params:
  //    email -> email of user
  //    password -> password of user

  function login(email, password) {
    return instance.post("/login", {
      email: email,
      password: password,
    })
  }

  const value = {
    user,
    register,
    login,
    setUSer,
    authModel,
    setAuthModel,
  } // what the context provides

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
