import Masonry from "react-masonry-css"
import { Link } from "react-router-dom"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import {RouterOutputs } from "../utils/trpc"
dayjjs.extend(relativeTime)

type BreakPoints = "default" | "1826" | "1347" | "900"

type Projects = RouterOutputs["projects"]["getAll"]

export default function ProjectsView(props: {
  projects: Projects,
  breakPoints: Record<BreakPoints, number>
}) {
  return (
    <Masonry
      breakpointCols={props.breakPoints}
      className="masonry"
      columnClassName="masonryCol"
    >
      {props.projects.map((proj) => (
        <Link
          key={proj.id}
          to={`/${proj.id}`}
          className="bg-zinc-200 flex flex-col p-6 rounded-2xl gap-3 mb-8 hover:scale-[1.009] hover:shadow-lg hover:shadow-zinc400/50 transition-all"
        >
          {
            <img
              src={""}
              width={350}
              height={400}
              loading="lazy"
              className="object-cover rounded-lg max-h-[400px] opacity-0 transition-opacity m-auto"
              onLoad={(e) => {
                e.currentTarget.classList.remove("opacity-0")
                e.currentTarget.classList.add("opacity-1")
              }}
            />
          }
          <h2 className="text-2xl font-bold text-zinc-950">{proj.name}</h2>
          <p className="text-zinc-800 leading-loose line-clamp-4">
            {proj.description}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Blob>
              <span className="material-symbols-outlined">schedule</span>
              {dayjjs(proj.createdAt).fromNow()}
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

const Blob = (props: { children: React.ReactNode }) => (
  <p className="bg-zinc-300 rounded-xl flex items-center w-fit text-sm text-zinc-700 gap-1 p-1">
    {props.children}
  </p>
)
