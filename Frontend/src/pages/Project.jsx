import { useQuery } from "@tanstack/react-query"
import { redirect, useFetcher, useParams } from "react-router-dom"
import {
  createProjectJoinRequest,
  createProjectPost,
  getAllProjectPosts,
  getProjectById,
} from "../firebase"
import Spinner from "../components/Spinner"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useUser } from "@clerk/clerk-react"
import { TextArea } from "../components/inputs"
import { useState } from "react"
import { useEffect } from "react"
// import axios from "axios"
import { Form, NavLink, Outlet } from "react-router-dom"

dayjjs.extend(relativeTime)

const projectInfoQuery = (id) => ({
  queryKey: ["projects", id, "info"],
  queryFn: () => getProjectById(id),
})

const projectPostsQuery = (id) => ({
  queryKey: ["projects", id, "posts"],
  queryFn: () => getAllProjectPosts(id),
})

export const infoLoader =
  (queryClient) =>
  async ({ params }) => {
    const query = projectInfoQuery(params.projectId)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export const postsLoader =
  (queryClient) =>
  async ({ params }) => {
    const query = projectPostsQuery(params.projectId)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }
// send request
export const action =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData()
    const inputs = Object.fromEntries(formData)
    console.log(inputs.imageUrl)
    await createProjectJoinRequest({
      projectId: inputs.projectId,
      imageUrl: inputs.imageUrl,
      message: inputs.message,
      ownerId: inputs.ownerId,
      projectTitle: inputs.projectTitle,
      requestantId: inputs.requestantId,
    })

    queryClient.invalidateQueries({
      queryKey: ["projects", inputs.projectId, "info"],
    })
    return null
  }

export const createPostAction =
  (queryClient) =>
  async ({ request }) => {
    const formData = await request.formData()
    const inputs = Object.fromEntries(formData)

    await createProjectPost(inputs.projectId, { title: inputs.postTitle })

    queryClient.invalidateQueries({
      queryKey: ["projects", inputs.projectId, "posts"],
    })

    return redirect(`/${inputs.projectId}`)
  }
export default function Project() {
  const { projectId } = useParams()

  const { user } = useUser()
  const fetcher = useFetcher()
  const { data, isLoading, isError } = useQuery(projectInfoQuery(projectId))
  const [showModal, setShowModal] = useState(false)
  // console.log(data)

  useEffect(() => {
    return () => {
      if (fetcher.state === "submitting") {
        setShowModal(false)
      }
    }
  }, [fetcher.state])

  // useEffect(() => {
  //   fetch("http://arjunnaik.pythonanywhere.com/projects/getProjectInfo", {
  //     body: "id=EH07BmN5QEIo7uQUMGSk",
  //     method: "post",
  //     headers: {
  //       "Content-Type": "application/x-www-form-urlencoded",

  //     },
  //   }).then(async (res) => {
  //     const data = await res.json()
  //     console.log(data)
  //     console.log(res)
  //   })
  // }, [])
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
    <>
      <div className="flex justify-between mt-6">
        {showModal && (
          <div className="absolute w-screen h-screen bg-slate-200 bg-opacity-75 top-0 left-0 flex items-center justify-center">
            <fetcher.Form method="POST">
              <label
                htmlFor="textAreaProj"
                className="text-2xl font-semibold mb-2 w-full flex justify-between"
              >
                Why do you want to join this project?
                <button
                  className="w-8 h-8 bg-slate-500 flex items-center justify-center rounded-full transition-colors hover:bg-gray-700 hover:text-slate-100"
                  type="button"
                  onClick={() => setShowModal(false)}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </label>
              <p className="mb-2">
                Show the owner of this project why you might be a good fit!{" "}
                <br />
                This is entirely optional<span className="text-red-500">*</span>
              </p>
              <TextArea
                id="textAreaProj"
                className="w-full"
                cols="70"
                rows="5"
                name="message"
              />
              <input type="hidden" value={projectId} name="projectId" />
              <input type="hidden" value={user.id} name="requestantId" />
              <input type="hidden" value={data.ownerId} name="ownerId" />
              <input type="hidden" value={data.title} name="projectTitle" />
              <input type="hidden" value={data.imageUrl} name="imageUrl" />
              <button
                type="submit"
                className="bg-blue-600 text-slate-100 px-4 rounded-lg mt-4 flex items-center justify-center min-w-[10rem] disabled:bg-blue-500"
                disabled={fetcher.state === "submitting"}
              >
                {fetcher.state === "submitting" ? (
                  <Spinner color="white" />
                ) : (
                  <p className="py-2">Send join request</p>
                )}
              </button>
            </fetcher.Form>
          </div>
        )}

        <div className="w-full max-w-6xl m-auto border-2 overflow-hidden rounded-lg h-fit">
          <div className="bg-[#D9D9D9] flex flex-col">
            <div className="flex justify-between items-center p-4 w-full max-w-7xl m-auto">
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold text-zinc-800 flex items-center">
                  {data.title}
                </h2>
                <p className="text-zinc-800 leading-7 max-w-lg">
                  {data.description}
                </p>
              </div>

              {user && data.requestants.find((member) => member === user.id) ? (
                <button className=" bg-zinc-400 text-zinc-700 p-2 rounded-xl group hover:bg-red-500 hover:outline-none hover:text-zinc-100 transition-colors min-w-[7.5rem]">
                  <span className="group-hover:hidden">Request Sent</span>
                  <span className="hidden group-hover:inline-block">
                    Unrequest
                  </span>
                </button>
              ) : user && data.members.find((member) => member === user.id) ? (
                <p className="bg-slate-400 py-2 px-6 rounded-lg">Member</p>
              ) : user && data.ownerId === user.id ? (
                <p className="bg-green-600 py-2 px-6 text-zinc-100 rounded-lg">
                  Owner
                </p>
              ) : !user ? (
                <div> Login to send request</div>
              ) : (
                <button
                  className="text-zinc-100 py-2 px-6 rounded-lg bg-[#FBBC05] font-medium hover:bg-yellow-500 transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  Join
                </button>
              )}
            </div>
            <div className="w-[95%] m-auto h-[3px] max-w-7xl bg-zinc-400 rounded-full"></div>
            <div className="flex">
              <NavLink
                to={`/${projectId}`}
                end
                className="flex-1 flex items-center justify-center hover:bg-zinc-200 bg-opacity-75 px-6 py-4 transition-colors"
              >
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "text-zinc-900 font-medium relative after:absolute after:w-full after:h-1 after:bg-[#FBBC05] after:content-[''] after:-bottom-2 after:left-0"
                        : "text-zinc-900 font-medium"
                    }
                  >
                    Project Info
                  </span>
                )}
              </NavLink>
              <NavLink
                to={`/${projectId}/posts`}
                className="flex-1 flex items-center justify-center hover:bg-zinc-200 bg-opacity-75 px-6 py-4 transition-colors"
              >
                {({ isActive }) => (
                  <span
                    className={
                      isActive
                        ? "text-zinc-900 font-medium relative after:absolute after:w-full after:h-1 after:bg-[#FBBC05] after:content-[''] after:-bottom-2 after:left-0"
                        : "text-zinc-900 font-medium"
                    }
                  >
                    Blog Posts
                  </span>
                )}
              </NavLink>
            </div>
          </div>

          <div className="p-4 max-w-7xl m-auto">
            <Outlet />
          </div>
        </div>
      </div>

      <Form method="post" action="createPost">
        <input type="text" className="border" name="postTitle" />
        <input type="hidden" name="projectId" value={projectId} />
        <button>Create post</button>
      </Form>
    </>
  )
}

export function ProjectInfo() {
  const { projectId } = useParams()
  const { data, isLoading, isError } = useQuery(projectInfoQuery(projectId))
  return (
    <div className="flex justify-between w-full">
      <div className="flex flex-col gap-4">
        {/* <p>
          <span className="underline font-semibold mr-3 underline-offset-4">
            Description:
          </span>
          {data.description}
        </p> */}
        <p>
          <span className="underline font-semibold mr-3 underline-offset-4">
            Meet Location:
          </span>
          {data.meetLocation}
        </p>
        <p>
          <span className="underline font-semibold mr-3 underline-offset-4">
            Posted:
          </span>
          {dayjjs(data.createdAt.toDate()).fromNow()}
        </p>
      </div>
      <img
        src={data.imageUrl}
        alt=""
        width={400}
        height={400}
        className="rounded-lg"
      />
    </div>
  )
}

export function ProjectPosts() {
  const { projectId } = useParams()
  const { data, isLoading, isError } = useQuery(projectPostsQuery(projectId))

  if (isLoading) return <div>loading posts</div>

  if (isError) return <div>something went wrong</div>

  if (data.length === 0)
    return (
      <div className="font-medium text-zinc-800 text-lg">
        No Blog post to show
      </div>
    )

  return (
    <div>
      {data.map((post) => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
