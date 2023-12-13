import styled, { createGlobalStyle } from "styled-components"
import { ThemeProvider } from "styled-components"
import { theme } from "./contexts/theme"
import Nav from "./components/Nav"
import { Toaster } from "react-hot-toast"
import "./index.css"
import { Outlet, redirect } from "react-router-dom"
import { useAuth, useUser, useSession } from "@clerk/clerk-react"
import { useEffect, useState } from "react"
// import { signInWithClerkToken, signOutFromFirebase } from "./firebase"
import { useNavigate } from "react-router-dom"
import { trpc } from "./utils/trpc"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { httpBatchLink } from "@trpc/client"
import { queryClient } from "./main"
function App() {
  const { getToken } = useAuth()
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:3001",
          // You can pass any HTTP headers you wish here
          async headers() {
            // if (!isLoaded) {
            //   return {
            //     authorization: undefined,
            //     userLoading: 'true',
            //   }
            // }
            const token = await getToken()
            return {
              authorization: token ?? undefined,
              // token: token,
              // isLoaded: isLoaded.toString(),
            }
          },
        }),
      ],
    })
  )

  // async function headers() {

  // }
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
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
      </QueryClientProvider>
    </trpc.Provider>
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
