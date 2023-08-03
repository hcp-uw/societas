import axios from "axios"
import { useState, createContext } from "react"
import PropType from "prop-types"
// import { createContext } from "react"

export const AuthContext = createContext()

AuthContextProvider.propTypes = {
  children: PropType.node,
}

export const FORMS = {
  LOGIN: "login",
  SIGNUP: "signup",
  NONE: null,
}

export function AuthContextProvider({ children }) {
  const [user, setUSer] = useState("") // curent user state
  const [authModal, setAuthModal] = useState(FORMS.NONE) // bool to show auth model or not

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
    authModal,
    setAuthModal,
  } // what the context provides

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
