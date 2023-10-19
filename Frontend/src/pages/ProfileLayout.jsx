import { SignOutButton } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { NavLink } from "react-router-dom"

export default function ProfileLayout() {
  const navigate = useNavigate()
  return (
    <Layout className="mt-6 gap-32">
      <StyledAside>
        <ProfileLink to="/account" end={true}>
          <span className="material-symbols-outlined">person</span>
          My profile
        </ProfileLink>

        <ProfileLink to="create">
          <span className="material-symbols-outlined">add_circle</span>
          Create Project
        </ProfileLink>

        <ProfileLink to="requests">
          <span className="material-symbols-outlined">favorite</span>
          Requests
        </ProfileLink>

        <SignOutButton signOutCallback={() => navigate("/")}>
          <div className="flex p-2 rounded gap-2 items-center hover:bg-zinc-300 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            Sign out
          </div>
        </SignOutButton>
      </StyledAside>

      <Outlet />
    </Layout>
  )
}

function ProfileLink({ to, children, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive, isPending }) =>
        isActive
          ? "flex p-2 rounded-lg gap-2 transition-colors items-center border-2 border-blue-400 bg-zinc-300"
          : isPending
          ? "flex p-2 rounded-lg gap-2 transition-colors items-center border-2 border-transparent bg-zinc-400"
          : "flex p-2 rounded-lg gap-2 transition-colors items-center border-2 border-transparent hover:bg-zinc-300"
      }
    >
      {children}
    </NavLink>
  )
}
const Layout = styled.div`
  display: flex;
`
const StyledAside = styled.aside`
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  gap: 1rem;
  width: fit-content;
  min-width: fit-content;
`
