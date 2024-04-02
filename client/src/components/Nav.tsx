import LogoRoute from "../assets/logo.png";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { NavLink } from "react-router-dom";

export default function Nav() {
  //get user.
  const { user } = useUser();

  //returns header of logo and profile button or "sign in/sign up" if user is not registered.
  return (
    <header className="border-b-2 py-2">
      <nav className="flex max-w-[80%] justify-between items-center m-auto">
        <NavLink to="/">
          <img
            src={LogoRoute}
            alt="Societas Logo"
            width={70}
            className="object-cover w-[70px]"
            loading="eager"
          />
        </NavLink>

        {user ? (
          <div>
            <NavLink to="/account">
              <img
                src={user.imageUrl}
                alt={`${user.fullName} profile image`}
                width={70}
                className="rounded-full object-cover w-14 h-14"
              />
            </NavLink>
          </div>
        ) : (
          <div className="flex gap-4">
            <SignInButton mode="modal">
              <div className="bg-blue-400 hover:bg-blue-500 transition-colors cursor-pointer py-2 px-6 text-zinc-100 rounded-lg">
                Login
              </div>
            </SignInButton>
            <SignUpButton mode="modal">
              <div className="border border-zinc-900 py-2 cursor-pointer px-6 rounded-lg hover:bg-zinc-200 transition-colors">
                Sign up
              </div>
            </SignUpButton>
          </div>
        )}
      </nav>
    </header>
  );
}
