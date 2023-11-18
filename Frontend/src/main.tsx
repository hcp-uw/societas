/**
 * Main entry point for the application.
 *
 * This file imports all necessary modules and components, sets up routing,
 * initializes Clerk and React Query, and renders the main application component.
 */

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"

// Routing
import { createBrowserRouter, RouterProvider } from "react-router-dom"

// Authentication
import { ClerkProvider } from "@clerk/clerk-react"

// Data fetching
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

// Pages
import Home, { loader as projectsLoader } from "./pages/Home.tsx"
import Project, {
  createPostAction,
  postsLoader as projectPostsLoader,
  ProjectInfo,
  infoLoader as projectInfoLoader,
  ProjectPostsLayout,
  action as reqAction,
  CreatePost,
  ProjectPost,
  postLoader,
} from "./pages/Project.jsx"
import ProfileLayout from "./pages/ProfileLayout.tsx"
import CreateProj, { createProjectAction } from "./pages/CreateProj.tsx"
import Requests, { resquestAcceptAction } from "./pages/Requests.tsx"
import Intro from "./pages/Intro.jsx"
import PreferencePage from "./pages/PreferencePage.tsx"
import WhoopsPage from "./pages/WhoopsPage.tsx"
import ReportPage from "./pages/ReportPage.tsx"
import Profile, { EditProfile } from "./pages/Profile.tsx"

// initialize react query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
})

// Ensure the Clerk publishable key is availablecheck for publishable key

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw "Missing Publishable Key"
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

// Check if the user is visiting for the first time
if (
  localStorage.getItem("firstTimeUser") == null &&
  localStorage.getItem("firstTimeUser") !== "false"
) {
  localStorage.setItem("firstTimeUser", "true")
}

// Create the router
const router = createBrowserRouter([
  {
    path: "/intro",
    element: <Intro />,
  },
  {
    path: "/",
    element: <App />,
    loader: projectsLoader(queryClient),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ":projectId",
        element: <Project />,
        loader: projectInfoLoader(queryClient),
        action: reqAction(queryClient),
        children: [
          {
            index: true,
            element: <ProjectInfo />,
          },
          {
            path: "posts",
            element: <ProjectPostsLayout />,
            loader: projectPostsLoader(queryClient),
            children: [
              {
                path: ":postId",
                element: <ProjectPost />,
                loader: postLoader(queryClient),
              },
            ],
          },
          {
            path: "posts/new",
            element: <CreatePost />,
            loader: projectPostsLoader(queryClient),
            action: createPostAction(queryClient),
          },
        ],
      },
      {
        path: "account",
        element: <ProfileLayout />,
        children: [
          {
            path: "create",
            element: <CreateProj />,
            action: createProjectAction(queryClient),
          },
          {
            index: true,
            element: <Profile />,
          },
          {
            path: "edit",
            element: <EditProfile />,
          },
          {
            path: "requests",
            element: <Requests />,
          },
          {
            path: "requests/acceptReq",
            element: <Requests />,
            action: resquestAcceptAction(queryClient),
          },
        ],
      },
      {
        path: "preference",
        element: <PreferencePage />,
      },
      {
        path: "whoops",
        element: <WhoopsPage />,
      },
      {
        path: "report",
        element: <ReportPage />,
      },
    ],
  },
])

// Render the application
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen position="bottom-right" />
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
