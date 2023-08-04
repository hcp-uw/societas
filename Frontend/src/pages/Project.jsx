import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getProjectById } from "../firebase"
import Spinner from "../components/styledComponents/Spinner"

const projectQuery = (id) => ({
  queryKey: ["projects", id],
  queryFn: () => getProjectById(id),
})

export const loader =
  async (queryClient) =>
  async ({ params }) => {
    const query = projectQuery(params.projectId)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export default function Project() {
  const { projectId } = useParams()

  const { data, isLoading, isError } = useQuery(projectQuery(projectId))

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

  if (isError) return <div>Project was not found</div>

  return (
    <div>
      <div>
        <div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>

        <p>
          <span>Meet Location:</span>
          {data.meetLocation}
        </p>
      </div>
    </div>
  )
}
