import { getAllProjects } from "../firebase"
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../components/Spinner"
import ProjectsView from "../components/ProjectsView"

const projectsQuery = () => ({
  queryKey: ["projects"],
  queryFn: () => getAllProjects(),
})

export const loader = (queryClient) => async () => {
  if (!queryClient.getQueryData(projectsQuery().queryKey)) {
    return await queryClient.fetchQuery(projectsQuery())
  }

  return null
}

export default function Home() {
  const { user } = useUser()

  return (
    <>
      {user ? (
        <h1 className="py-6 text-4xl font-bold text-zinc-800">
          Welcome {user.firstName}
        </h1>
      ) : (
        <h1 className="py-6 text-4xl font-bold text-zinc-800">Welcome</h1>
      )}

      <Projects />
    </>
  )
}

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

  const breakpointColumnsObj = {
    default: 4,
    1826: 3,
    1347: 2,
    900: 1,
  }

  return <ProjectsView projects={data} breakPoints={breakpointColumnsObj} />
}
