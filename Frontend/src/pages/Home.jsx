import { getAllProjects } from "../firebase"
import styled from "styled-components"
import Masonry from "react-masonry-css"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjjs.extend(relativeTime)
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../components/styledComponents/Spinner"
import { NavLink } from "react-router-dom"

const projectsQuery = () => ({
  queryKey: ["projects"],
  queryFn: getAllProjects,
})

export const loader = async (queryClient) => {
  if (!queryClient.getQueryData(projectsQuery().queryKey)) {
    await queryClient.fetchQuery(projectsQuery())
  }
}

export default function Home() {
  const { user } = useUser()

  return (
    <>
      {user ? (
        <h1 style={{ padding: "1.5rem 0" }}>Welcome {user.firstName ?? ""}</h1>
      ) : (
        <h1 style={{ padding: "1.5rem 0" }}>Welcome</h1>
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

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry"
      columnClassName="masonryCol"
    >
      {data.map((proj) => (
        <StyledProj key={proj.id} to={proj.id}>
          <Img src={proj.imageURL} width={300} />
          <h2>{proj.title}</h2>
          <p>{proj.description}</p>
          <TimeBlob>
            <span className="material-symbols-outlined">schedule</span>
            {dayjjs(proj.createdAt.toDate()).fromNow()}
          </TimeBlob>
        </StyledProj>
      ))}
    </Masonry>
  )
}

const StyledProj = styled(NavLink)`
  background-color: #e9e9e9;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.default};
  padding: 1.5rem;
  border-radius: 21px;
  gap: 1rem;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.mainText};
  text-decoration: none;

  h2 {
    color: black;
  }
  /* max-width: 19rem; */
`

const TimeBlob = styled.p`
  background-color: #d9d9d9;
  border-radius: 10px;
  width: fit-content;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const Img = styled.img`
  object-fit: contain;
  max-height: 15rem;
  margin: auto;
`
