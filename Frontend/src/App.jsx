import { Routes, Route } from "react-router-dom"
import CreateProj from "./components/CreateProj"
import Home from "./components/Home"
import { createGlobalStyle } from "styled-components"
import { ThemeProvider } from "styled-components"
import { theme } from "./contexts/theme"

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <Routes>
        <Route element={<CreateProj />} path="create-proj" />
        <Route element={<Home />} path="home" />
      </Routes>
    </ThemeProvider>
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
