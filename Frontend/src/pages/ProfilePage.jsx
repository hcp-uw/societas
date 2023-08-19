import { SignOutButton } from "@clerk/clerk-react"
import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { NavLink } from "react-router-dom"

export default function ProfilePage() {
  const [selected, setSelected] = useState("my-profile")
  const navigate = useNavigate()
  return (
    <ProfilePageLayout className="mt-6">
      <StyledAside>
        <Link
          to="profile"
          onClick={() => setSelected("my-profile")}
          selected={selected === "my-profile"}
        >
          <span className="material-symbols-outlined">person</span>
          My profile
        </Link>
        <Link
          to="create"
          onClick={() => setSelected("create-proj")}
          selected={selected === "create-proj"}
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create Project
        </Link>
        <Link
          to="edit-profile"
          onClick={() => setSelected("edit-profile")}
          selected={selected === "edit-profile"}
        >
          <span className="material-symbols-outlined">edit</span>
          Edit Profile
        </Link>
        <Link
          to="password"
          onClick={() => setSelected("password")}
          selected={selected === "password"}
        >
          <span className="material-symbols-outlined">lock</span>
          Password
        </Link>

        <Link
          to="requests"
          onClick={() => setSelected("requests")}
          selected={selected === "requests"}
        >
          <span className="material-symbols-outlined">favorite</span>
          Requests
        </Link>

        <SignOutButton signOutCallback={() => navigate("/")}>
          Sign out
        </SignOutButton>
      </StyledAside>

      <Outlet />
    </ProfilePageLayout>
  )
}

const ProfilePageLayout = styled.div`
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

const Link = styled(NavLink)`
  text-decoration: none;
  padding: 0.5rem;
  color: ${({ selected }) => (selected ? "#e9e9e9" : "#717171")};
  border-radius: 10px;
  background-color: ${({ selected }) => (selected ? "#485160" : "none")};
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background 100ms ease-out;

  &:hover {
    background-color: ${({ selected }) => (selected ? "#485160" : "#e6e6e78a")};
  }
`
