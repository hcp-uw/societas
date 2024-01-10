import { SignOutButton } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"
import styled from "styled-components"
import { NavLink } from "react-router-dom"
import toast from "react-hot-toast"
// allows you to route to different features and functionalities from the navigation bar on the left side
export default function ProfileLayout() {
  const navigate = useNavigate()

  function handleSignout() {
    navigate("/")
    toast.success("Successfully Signout")
  }
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

        <SignOutButton signOutCallback={handleSignout}>
          <div className="flex p-2 rounded gap-2 items-center hover:bg-red-400 hover:text-zinc-100 transition-colors cursor-pointer">
            <span className="material-symbols-outlined">logout</span>
            Sign out
          </div>
        </SignOutButton>
      </StyledAside>

      <Outlet />
    </Layout>
  )
}
// Allows for us to set a link as active vs pending, which allows for the ui change. Appears when other pages are loaded, as long as that page is accessible from the profile layout.
function ProfileLink({
  to,
  children,
  end,
}: {
  to: string
  children: React.ReactNode
  end?: boolean
}) {
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
  position: sticky;
  top: 2rem;
  height: 100%;
  justify-items: flex-start;
`
