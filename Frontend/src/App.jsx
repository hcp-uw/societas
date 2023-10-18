import styled, { createGlobalStyle } from "styled-components"
import { ThemeProvider } from "styled-components"
import { theme } from "./contexts/theme"
import Nav from "./components/Nav"
import { Toaster } from "react-hot-toast"
import "./index.css"
import { Outlet } from "react-router-dom"
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import { signInWithClerkToken, signOutFromFirebase } from "./firebase"

function App() {
  const { getToken } = useAuth()

  useEffect(() => {
    const signInWithFirebase = async () => {
      const token = await getToken({ template: "integration_firebase" })

      if (!token) {
        signOutFromFirebase()
        return
      }

      await fetch("https://arjunnaik.pythonanywhere.com/user/login", {
        method: "POST",
        body: {
          uid: token,
        },
      })
    }

    signInWithFirebase()
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Nav />
      <Toaster position="bottom-center" />
      <StyledAppLayout>
        <Outlet />
      </StyledAppLayout>
    </ThemeProvider>
  )
}

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
    font-family: ${({ theme }) => theme.fonts.default}, sans-serif, ;
  }
`

const StyledAppLayout = styled.div`
  margin: auto;
  max-width: 80%;
`

export default App
