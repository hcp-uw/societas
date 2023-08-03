import styled, { keyframes } from "styled-components"
import { useAuth } from "../../hooks/useAuth"
import PropTypes from "prop-types"
import Login from "./Login"
import { useState } from "react"
import Register from "./Register"
import { FORMS } from "../../contexts/AuthContext"
import { toast } from "react-hot-toast"

export default function Modal() {
  const { authModal, setAuthModal, register, login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  function isFormValid() {
    return email.length !== 0 && password.length !== 0
  }

  function handleSubmit(e) {
    // e.preventDefault()
    // setLoading(true)
    // if (authModal === FORMS.SIGNUP) {
    //   register(email, password)
    //     .then((res) => {
    //       console.log("sucess", res)
    //       toast.success("Account created")
    //       setLoading(false)
    //     })
    //     .catch((err) => {
    //       toast.error(err)
    //       setLoading(false)
    //       console.log(err)
    //     })
    // }
  }

  function setForm(form) {
    setEmail("")
    setPassword("")
    setAuthModal(form)
  }

  function closeModal() {
    setEmail("")
    setPassword("")
    setAuthModal(FORMS.NONE)
  }

  return (
    authModal && (
      <StyledModal show={authModal}>
        <Content onSubmit={handleSubmit}>
          <CloseBtn onClick={closeModal}>
            <span className="material-symbols-outlined">close</span>
          </CloseBtn>
          {authModal == FORMS.LOGIN ? (
            <Login
              setForm={setForm}
              emailState={[email, setEmail]}
              passwordState={[password, setPassword]}
              isFormValid={isFormValid}
              loading={loading}
            />
          ) : authModal == FORMS.SIGNUP ? (
            <Register
              setForm={setForm}
              emailState={[email, setEmail]}
              passwordState={[password, setPassword]}
              isFormValid={isFormValid}
              loading={loading}
            />
          ) : (
            <></>
          )}
        </Content>
      </StyledModal>
    )
  )
}

const StyledModal = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: rgba(51, 51, 51, 0.44);
  display: flex;
  font-family: ${({ theme }) => theme.fonts.default};
  position: absolute;
  z-index: 2;
  align-items: center;
  animation-name: ${({ show }) => (show ? onEnterModal : "")};
  animation-duration: 200ms;
  animation-fill-mode: forwards;
  animation-timing-function: ease-out;
`

const onEnterModal = keyframes`
  0% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
`

const Content = styled.form`
  width: 100%;
  max-width: 20rem;
  margin: auto;
  background-color: #d9d9d9;
  position: relative;
  border-radius: 8px;
  padding: 1rem;
  font-family: inherit;
  @media (min-width: 768px) {
    & {
      padding: 2rem 3rem;
    }
  }
`

const CloseBtn = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightBg};
  border: none;
  justify-content: center;
  align-items: center;
  margin-right: 1rem;
  margin-top: 1rem;
  top: 0;
  right: 0;
  position: absolute;
  cursor: pointer;
  transition: background 150ms ease-out;

  span {
    color: ${({ theme }) => theme.colors.mainText};
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.subText};
  }
`
