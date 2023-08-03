import { Routes, Route } from "react-router-dom"
import CreateProj from "./pages/CreateProj"
import Home from "./pages/Home"
import { createGlobalStyle } from "styled-components"
import { ThemeProvider } from "styled-components"
import { theme } from "./contexts/theme"
import Modal from "./components/Auth/Modal"
import { AuthContextProvider } from "./contexts/AuthContext"
import Nav from "./components/Nav"
import { Toaster } from "react-hot-toast"
import "./index.css"
function App() {
  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Modal />
        <Nav />
        <Toaster position="bottom-center" />
        <Routes>
          <Route element={<CreateProj />} path="create-proj" />
          <Route element={<Home />} path="home" />
        </Routes>
      </ThemeProvider>
    </AuthContextProvider>
  )
}

const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    margin: 0;
  }
`

export default App
