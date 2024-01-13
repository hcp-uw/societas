import { SignOutButton } from "@clerk/clerk-react"
import { Outlet, useNavigate } from "react-router-dom"
import { NavLink } from "react-router-dom"
import toast from "react-hot-toast"

//shows/handles layout for lefthand navigation in profile page
export default function ProfileLayout() {
  const navigate = useNavigate()

  function handleSignout() {
    navigate("/")
    toast.success("Successfully Signout")
  }
  return (
    <div className="flex mt-6 gap-32">
      <div className="flex flex-col py-4 gap-4 w-fit min-w-fit sticky top-8 h-full justify-start">
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
      </div>

      <Outlet />
    </div>
  )
}

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
