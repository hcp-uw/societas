import LogoRoute from '../assets/logo.png';
import { SignInButton, SignUpButton } from '@clerk/clerk-react';
import { useUser } from '@clerk/clerk-react';
import { NavLink } from 'react-router-dom';

export default function Nav() {
  //get user.
  const { user } = useUser();

  //returns header of logo and profile button or "sign in/sign up" if user is not registered.
  return (
    <header className="border-b-2 py-1">
      <nav className="flex max-w-[80%] justify-between items-center m-auto">
        <div className="flex items-center gap-4 text-zinc-400">
          <NavLink to="/">
            <img
              src={LogoRoute}
              alt="Societas Logo"
              width={60}
              className="object-cover"
              loading="eager"
            />
          </NavLink>
          {user && (
            <>
              <svg
                width="10"
                height="32"
                viewBox="0 0 10 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.59998 0.700012L9.59998 0.800012L1.09998 31.7L0.0999756 31.6L8.59998 0.700012Z"
                  fill="#8C8C8C"
                />
              </svg>

              <div className="gap-3 flex">
                <NavLink
                  to="/create"
                  className={({ isActive }) =>
                    `capitalize flex items-center gap-1 transition-all hover:text-zinc-900 ${
                      isActive && 'text-zinc-900 font-medium'
                    }`
                  }
                >
                  create project
                </NavLink>
                <NavLink
                  to="/requests"
                  className={({ isActive }) =>
                    `capitalize flex items-center gap-1 transition-all hover:text-zinc-900 ${
                      isActive && 'text-zinc-900 font-medium'
                    }`
                  }
                >
                  requests
                </NavLink>
              </div>
            </>
          )}
        </div>

        {user ? (
          <div className="flex justify-center items-center gap-4">
            <NavLink to="/account">
              <img
                src={user.imageUrl}
                alt={`${user.fullName} profile image`}
                width={60}
                height={60}
                className="rounded-full h-12 w-12 object-cover"
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
