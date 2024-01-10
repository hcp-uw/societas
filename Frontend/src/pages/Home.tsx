import { getAllProjects } from "../firebase"
import { useUser } from "@clerk/clerk-react"
import { useQuery, type QueryClient } from "@tanstack/react-query"
import Spinner from "../components/Spinner"
import ProjectsView from "../components/ProjectsView"
import { LoaderFunction } from "react-router-dom"
// how data is fetched
const projectsQuery = () => ({
  queryKey: ["projects"],
  queryFn: () => getAllProjects(),
})
// It checks if the local storage has data and if it's not null then it fetches the data.
// Allows for consistent updates when you load pages. 
export const loader = (queryClient: QueryClient):LoaderFunction => async () => {
  if (!queryClient.getQueryData(projectsQuery().queryKey)) {
    return await queryClient.fetchQuery(projectsQuery())
  }

  return null
}
// styling and layout for the home page
export default function Home() {
  const { user } = useUser()

  return (
    <div className="pb-24">
      {user ? (
        <h1 className="py-6 text-4xl font-bold text-zinc-800">
          Welcome {user.firstName}
        </h1>
      ) : (
        <h1 className="py-6 text-4xl font-bold text-zinc-800">Welcome</h1>
      )}

      <Projects />
    </div>
  )
}
// The UI for the projects
function Projects() {
  const { data, isLoading } = useQuery(projectsQuery())

  if (isLoading)
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          margin: "auto",
        }}
      >
        <Spinner size="4rem" />
      </div>
    )

  if (!data) return <div>Something went wrong!</div>

  const breakpointColumnsObj = {
    default: 4,
    1826: 3,
    1347: 2,
    900: 1,
  }

  return <ProjectsView projects={data} breakPoints={breakpointColumnsObj} />
}
