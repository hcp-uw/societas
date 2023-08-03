import styled from "styled-components"
import { StyledInput, Input } from "../styledComponents/inputs"
import { FORMS } from "../../contexts/AuthContext"
export default function Login({
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
        <h1>Welcome back</h1>
        <p>Sign in to access projects!</p>
      </Titles>
      <Input>
        <label htmlFor="email">email</label>
        <StyledInput
          placeholder="johndoe@uw.edu"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          id="email"
          required
        />
      </Input>

      <Input>
        <label htmlFor="password">password</label>
        <StyledInput
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          id="password"
          required
        />
      </Input>
      <p>
        Don't have an account?{" "}
        <span onClick={() => setForm(FORMS.SIGNUP)}>Sign up!</span>
      </p>
      <Btn
        type="submit"
        isFormValid={isFormValid()}
        disabled={!isFormValid()}
        loading={loading}
      >
        {loading ? <Spinner /> : "Log in"}
      </Btn>
    </StyledWrapper>
  )
}

export function Spinner() {
  return (
    <StyledSpinner>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </StyledSpinner>
  )
}

const StyledSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  display: inline-block;
  position: relative;
  transform: scale(0.5);
  transform-origin: center;
  pointer-events: ${({ loading }) => (loading ? "none" : "all")};

  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: 3rem;
    height: 3rem;
    border: 8px solid #fff;
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: #fff transparent transparent transparent;
    top: -15px;
    right: -1px;
  }
  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`

export const StyledWrapper = styled.div`
  font-family: inherit;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  span {
    color: #1270b0;
    text-decoration: underline;
    cursor: pointer;
  }
`

export const Titles = styled.div`
  font-family: inherit;
`

export const Btn = styled.button`
  font-family: inherit;
  background-color: ${({ theme, isFormValid }) =>
    isFormValid ? theme.colors.primary : theme.colors.disabled};
  border: none;
  color: ${({ theme }) => theme.colors.whiteText};
  font-size: 1rem;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  margin-top: 1rem;
  transition: background 200ms ease-out;
  cursor: ${({ isFormValid }) => (isFormValid ? "pointer" : "default")};
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ isFormValid, theme }) =>
      isFormValid && theme.colors.primary_600};
  }
`
