import { Routes, Route } from "react-router-dom"
import CreateProj from "./pages/CreateProj"
import Home from "./pages/Home"
import styled, { createGlobalStyle } from "styled-components"
import { ThemeProvider } from "styled-components"
import { theme } from "./contexts/theme"
import { AuthContextProvider } from "./contexts/AuthContext"
import Nav from "./components/Nav"
import { Toaster } from "react-hot-toast"
import "./index.css"
import { Outlet } from "react-router-dom"
import { ClerkProvider } from "@clerk/clerk-react"
import ProfilePage from "./pages/ProfilePage"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import Project from "./pages/Project"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { loader as projectsLoader } from "./pages/Home"
import { loader as projectLoader } from "./pages/Project"

if (!import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY) {
  throw "Missing Publishable Key"
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
    },
  },
})

const clerkPubKey = import.meta.env.VITE_REACT_APP_CLERK_PUBLISHABLE_KEY

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey}>
        <AuthContextProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <Nav />
            <Toaster position="bottom-center" />
            <Routes>
              <Route
                element={<AppLayout />}
                path="/"
                loader={projectsLoader(queryClient)}
              >
                <Route index element={<Home />} />
                <Route
                  element={<Project />}
                  path=":projectId"
                  loader={projectLoader(queryClient)}
                />
                <Route element={<ProfilePage />} path="account">
                  <Route element={<CreateProj />} path="create" />
                </Route>
              </Route>
            </Routes>
          </ThemeProvider>
        </AuthContextProvider>
      </ClerkProvider>
      <ReactQueryDevtools initialIsOpen position="bottom-right" />
    </QueryClientProvider>
  )
}

function AppLayout() {
  return (
    <StyledAppLayout>
      <Outlet />
    </StyledAppLayout>
  )
}

const StyledAppLayout = styled.div`
  margin: auto;
  max-width: 80%;
`
const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.default};
  }
`

export default App
