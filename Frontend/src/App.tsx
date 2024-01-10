import styled, { createGlobalStyle } from "styled-components"
import { ThemeProvider } from "styled-components"
import { theme } from "./contexts/theme"
import Nav from "./components/Nav"
import { Toaster } from "react-hot-toast"
import "./index.css"
import { Outlet, redirect } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
// import { signInWithClerkToken, signOutFromFirebase } from "./firebase"
import { useNavigate } from "react-router-dom"

function App() {
  const { getToken } = useAuth()
  const navigate = useNavigate()
// If a user is logging in for the first time it will navigate to the intro page
  useEffect(() => {
    if (localStorage.getItem("firstTimeUser") === "true") {
      navigate("/intro")
    }
    // const signInWithFirebase = async () => {
    //   const token = await getToken({ template: "integration_firebase" })

    //   if (!token) {
    //     signOutFromFirebase()
    //     return
    //   }
    // }

    // signInWithFirebase()
  }, [])
// how the page layout gets organized
  return (
    <div className="h-screen overflow-hidden">
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Nav />
        <Toaster position="bottom-center" />
        <main className="h-full overflow-auto overscroll-y-contain">
          <StyledAppLayout>
            <Outlet />
          </StyledAppLayout>
        </main>
      </ThemeProvider>
    </div>
  )
}

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    font-family: ${({ theme }) => theme.fonts.default}, sans-serif, ;
  }
`

const StyledAppLayout = styled.div`
  margin: auto;
  max-width: 80%;
`

export default App
