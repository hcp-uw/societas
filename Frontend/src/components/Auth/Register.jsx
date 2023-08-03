import { StyledWrapper, Titles, Btn, Spinner } from "./Login"
import { Input, StyledInput } from "../styledComponents/inputs"
import { FORMS } from "../../contexts/AuthContext"

export default function Register({
  setForm,
  emailState,
  passwordState,
  isFormValid,
  loading,
}) {
  const [email, setEmail] = emailState
  const [password, setPassword] = passwordState
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
        />
      </Input>
      <Input>
        <label htmlFor="password">password</label>
        <StyledInput
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password"
        />
      </Input>

      <p>
        Already have an Account?{" "}
        <span onClick={() => setForm(FORMS.LOGIN)}>Login!</span>
      </p>

      <Btn type="submit" isFormValid={isFormValid()} disabled={!isFormValid()}>
        {loading ? <Spinner /> : "Sign up"}
      </Btn>
    </StyledWrapper>
  )
}
