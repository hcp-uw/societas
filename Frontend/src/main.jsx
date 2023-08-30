import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App.jsx"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { loader as projectsLoader } from "./pages/Home"
import { loader as projectLoader, action as reqAction } from "./pages/Project"
import Project from "./pages/Project"
import ProfilePage from "./pages/ProfilePage.jsx"
import CreateProj, { createProjectAction } from "./pages/CreateProj.jsx"
import Home from "./pages/Home"
import Requests from "./pages/Requests.jsx"
import IntroPage from "./pages/IntroPage.jsx"

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

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    loader: () => projectsLoader(queryClient),
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ":projectId",
        element: <Project />,
        loader: () => projectLoader(queryClient),
        action: reqAction(queryClient),
      },
      {
        path: "account",
        element: <ProfilePage />,
        children: [
          {
            path: "create",
            element: <CreateProj />,
            action: createProjectAction(queryClient),
          },
          {
            path: "requests",
            element: <Requests />,
          },
        ],
      },
      {
        path: "intro",
        element: <IntroPage/>,
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
