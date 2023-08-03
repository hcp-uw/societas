import { StyledWrapper, Titles, Btn, Spinner } from "./Login"
import { Input, StyledInput } from "../styledComponents/inputs"
import { FORMS } from "../../contexts/AuthContext"
import { useAuth } from "../../hooks/useAuth"
import { signup } from "../../firebase"
import { toast } from "react-hot-toast"
import { useState } from "react"

export default function Register({
  setForm,
  emailState,
  passwordState,
  isFormValid,
  loading,
}) {
  const [email, setEmail] = emailState
  const [password, setPassword] = passwordState
  const [creating, setLoading] = useState(false)

  const { setUser } = useAuth()

  function handleSubmit() {
    setLoading(true)
    const toastId = toast.loading("creating account")
    signup(email, password)
      .then((user) => {
        setLoading(false)
        toast.success("created account", {
          id: toastId,
        })
        setUser(user)
      })
      .catch((err) => {
        console.log(err)
        toast.error("something went-wrong", {
          id: toastId,
        })
      })
  }

  return (
    <StyledWrapper>
      <Titles>
        <h1>Register!</h1>
        <p>Sign up to access projects!</p>
      </Titles>
      <Input>
        <label htmlFor="email">email</label>
        <StyledInput
          placeholder="johndoe@uw.edu"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id="email"
          disabled={creating}
        />
      </Input>
      <Input>
        <label htmlFor="password">password</label>
        <StyledInput
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password"
          disabled={creating}
        />
      </Input>

      <p>
        Already have an Account?{" "}
        <span onClick={() => setForm(FORMS.LOGIN)}>Login!</span>
      </p>

      <Btn
        type="submit"
        isFormValid={isFormValid()}
        disabled={!isFormValid() || creating}
        onClick={handleSubmit}
      >
        {loading ? <Spinner /> : "Sign up"}
      </Btn>
    </StyledWrapper>
  )
}
