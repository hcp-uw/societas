import { useAuth } from "../hooks/useAuth"
import styled from "styled-components"
import LogoRoute from "../assets/logo.png"
import { FORMS } from "../contexts/AuthContext"

export default function Nav() {
  const { user, setAuthModal } = useAuth()
  return (
    <header>
      <StyledNav>
        <img src={LogoRoute} alt="Societas Logo" width={70} />
        <AuthPrompts>
          <button onClick={() => setAuthModal(FORMS.LOGIN)}>Login</button>
          <button onClick={() => setAuthModal(FORMS.SIGNUP)}>Signup</button>
        </AuthPrompts>
      </StyledNav>
    </header>
  )
}

const StyledNav = styled.nav`
  display: flex;
  max-width: 80%;
  justify-content: space-between;
  align-items: center;
  margin: auto;
`

const AuthPrompts = styled.div`
  button {
    border: none;
    padding: 0.75rem 1rem;
    margin-left: 0.5rem;
    border-radius: 16px;
    cursor: pointer;
    color: ${({ theme }) => theme.colors.mainText};
    background: none;
    /* background-color: ${({ theme }) => theme.colors.disabled}; */
    font-size: 1rem;
    border: solid 2px ${({ theme }) => theme.colors.mainText};
    transition: background 150ms ease-out;
  }

  & button:last-child {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.whiteText};
    border: none;
  }

  & button:hover {
    background-color: ${({ theme }) => theme.colors.whiteText};
  }

  & button:last-child:hover {
    background-color: ${({ theme }) => theme.colors.primary_600};
  }
`
