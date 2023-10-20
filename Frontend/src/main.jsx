import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { loader as projectsLoader } from "./pages/Home"
import {
  createPostAction,
  postsLoader as projectPostsLoader,
  ProjectInfo,
  infoLoader as projectInfoLoader,
  ProjectPostsLayout,
  action as reqAction,
  CreatePost,
  ProjectPost,
  postLoader,
} from "./pages/Project"
import Project from "./pages/Project"
import ProfileLayout from "./pages/ProfileLayout.jsx"
import CreateProj, { createProjectAction } from "./pages/CreateProj.jsx"
import Home from "./pages/Home"
import Requests, { resquestAcceptAction } from "./pages/Requests.jsx"
import Intro from "./pages/Intro.jsx"
import PreferencePage from "./pages/PreferencePage.jsx"
import WhoopsPage from "./pages/WhoopsPage.jsx"
import ReportPage from "./pages/ReportPage.jsx"
import Profile from "./pages/Profile.jsx"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
    },
  },
})

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw "Missing Publishable Key"
}

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

if (
  localStorage.getItem("firstTimeUser") == null &&
  localStorage.getItem("firstTimeUser") !== "false"
) {
  localStorage.setItem("firstTimeUser", true)
}

const router = createBrowserRouter([
  {
    path: "/intro",
    element: <Intro />,
  },
  {
    path: "/",
    element: <App />,
    // loader: projectsLoader(queryClient),
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen position="bottom-right" />
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
