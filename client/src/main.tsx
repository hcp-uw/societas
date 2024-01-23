import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClient } from "@tanstack/react-query"
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
  leaveProjectAction,
} from "./pages/Project.jsx"
import ProfileLayout from "./pages/ProfileLayout.tsx"
import CreateProj from "./pages/CreateProj.tsx"
import Requests, {
  resquestAcceptAction,
  requestRejectAction,
} from "./pages/Requests.tsx"
import Intro from "./pages/Intro.jsx"
import PreferencePage from "./pages/PreferencePage.tsx"
import WhoopsPage from "./pages/WhoopsPage.tsx"
import ReportPage from "./pages/ReportPage.tsx"
import Profile, { EditProfile } from "./pages/Profile.tsx"
import { trpc } from "./utils/trpc.ts"

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
  localStorage.setItem("firstTimeUser", "true")
}

const router = createBrowserRouter([
  {
    path: "/intro",
    element: <Intro />,
  },
  {
    path: "/",
    element: <App queryClient={queryClient} />,
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
            path: "leaveProject",
            element: <ProjectInfo />,
            action: leaveProjectAction(queryClient),
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
          {
            path: "requests/rejectReq",
            element: <Requests />,
            action: requestRejectAction(queryClient),
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </React.StrictMode>
)
