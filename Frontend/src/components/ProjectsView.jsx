import Masonry from "react-masonry-css"
import { Link } from "react-router-dom"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjjs.extend(relativeTime)

export default function ProjectsView({ projects, breakPoints }) {
  return (
    <Masonry
      breakpointCols={breakPoints}
      className="masonry"
      columnClassName="masonryCol"
    >
      {projects.map((proj) => (
        <Link
          key={proj.id}
          to={`/${proj.id}`}
          className="bg-zinc-200 flex flex-col p-6 rounded-2xl gap-3 mb-8 hover:scale-[1.009] hover:shadow-lg hover:shadow-zinc400/50 transition-all"
        >
          <img
            src={proj.imageUrl}
            width={350}
            height={400}
            loading="lazy"
            className="object-cover rounded-lg max-h-[400px] opacity-0 transition-opacity m-auto"
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
