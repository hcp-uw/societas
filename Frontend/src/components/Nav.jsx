import { useAuth } from "../hooks/useAuth"
import styled from "styled-components"
import LogoRoute from "../assets/logo.png"
import { FORMS } from "../contexts/AuthContext"
import { SignInButton, SignUpButton } from "@clerk/clerk-react"
import { useUser } from "@clerk/clerk-react"
import { NavLink } from "react-router-dom"

export default function Nav() {
  const { user } = useUser()

  return (
    <header>
      <StyledNav>
        <NavLink to="/">
          <img src={LogoRoute} alt="Societas Logo" width={70} />
        </NavLink>

        {user ? (
          <div>
            <AccountBtn to="/account">
              <span className="material-symbols-outlined">person</span>
            </AccountBtn>
          </div>
        ) : (
          <AuthPrompts>
            <SignInButton mode="modal">Login</SignInButton>
            <SignUpButton mode="modal">Signup</SignUpButton>
          </AuthPrompts>
        )}
      </StyledNav>
    </header>
  )
}

const AccountBtn = styled(NavLink)`
  width: 3rem;
  height: 3rem;
  background-color: #e9e9e9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  text-decoration: none;
  color: #717171;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
`

const StyledNav = styled.nav`
  display: flex;
  max-width: 80%;
  justify-content: space-between;
  align-items: center;
  margin: auto;
  font-family: ;
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
