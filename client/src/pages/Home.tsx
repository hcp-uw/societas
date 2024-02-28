import { useUser } from "@clerk/clerk-react"
import Spinner from "../components/Spinner"
import ProjectsView from "../components/ProjectsView"
import { trpc } from "../utils/trpc"


export default function Home() {
  const { user } = useUser()
  const { data } = trpc.projects.getAll.useQuery()

  if (data) {
    console.log(data)
  }

  //home page with "welcome" and projects shown.
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

/*
 *Get project data. If loading, then show buffering image.
 *If data is null return error message
 *else return project view.
 */

 
function Projects() {
  //const { data, isLoading } = useQuery(projectsQuery())

  const {data, isLoading} = trpc.projects.getAll.useQuery();

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
