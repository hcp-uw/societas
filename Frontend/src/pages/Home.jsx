import { getAllProjects } from "../firebase"
import styled from "styled-components"
import Masonry from "react-masonry-css"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjjs.extend(relativeTime)
import { useUser } from "@clerk/clerk-react"
import { useQuery } from "@tanstack/react-query"
import Spinner from "../components/Spinner"
import { Link } from "react-router-dom"

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

  return (
    <Masonry
      breakpointCols={breakpointColumnsObj}
      className="masonry"
      columnClassName="masonryCol"
    >
      {data.map((proj) => (
        <Link
          key={proj.id}
          to={proj.id}
          className="bg-zinc-200 flex flex-col p-6 rounded-2xl gap-3 mb-8 hover:scale-[1.009] hover:shadow-lg hover:shadow-zinc400/50 transition-all"
        >
          <img
            src={proj.imageUrl}
            width={350}
            height={400}
            loading="lazy"
            className="object-cover rounded-lg max-h-[400px] opacity-0 transition-opacity"
            onLoad={(e) => {
              e.target.classList.remove("opacity-0")
              e.target.classList.add("opacity-1")
            }}
          />
          <h2 className="text-2xl font-bold text-zinc-950">{proj.title}</h2>
          <p className="text-zinc-800 leading-loose line-clamp-4">
            {proj.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Blob>
              <span className="material-symbols-outlined">schedule</span>
              {dayjjs(proj.createdAt.toDate()).fromNow()}
            </Blob>
            <Blob>
              {proj.meetType === "in-person" ? (
                <span className="material-symbols-outlined">groups</span>
              ) : proj.meetType === "remote" ? (
                <span className="material-symbols-outlined">language</span>
              ) : (
                <span className="material-symbols-outlined">
                  on_device_training
                </span>
              )}
              {proj.meetType}
            </Blob>
          </div>
        </Link>
      ))}
    </Masonry>
  )
}

const Blob = ({ children }) => (
  <p className="bg-zinc-300 rounded-lg flex items-center w-fit text-sm text-zinc-700 gap-1 p-1">
    {children}
  </p>
)
