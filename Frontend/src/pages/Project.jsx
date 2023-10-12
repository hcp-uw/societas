import { useQuery } from "@tanstack/react-query"
import { redirect, useFetcher, useNavigate, useParams } from "react-router-dom"
import {
  createProjectJoinRequest,
  createProjectPost,
  getAllProjectPosts,
  getProjectById,
  getProjectPostById,
} from "../firebase"
import Spinner from "../components/Spinner"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useUser } from "@clerk/clerk-react"
import { TextArea, Input, StyledInput } from "../components/inputs"
import { useState } from "react"
import { useEffect } from "react"
import toast from "react-hot-toast"
// import axios from "axios"
import { NavLink, Outlet } from "react-router-dom"
import Markdown from "marked-react"

dayjjs.extend(relativeTime)

const projectInfoQuery = (id) => ({
  queryKey: ["projects", id, "info"],
  queryFn: () => getProjectById(id),
})

const projectPostsQuery = (id) => ({
  queryKey: ["projects", id, "posts"],
  queryFn: () => getAllProjectPosts(id),
})

const projectPostQuery = (projectId, postId) => ({
  queryKey: ["projects", projectId, "posts", postId],
  queryFn: () => getProjectPostById(projectId, postId),
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

export const postLoader =
  (queryClient) =>
  async ({ params }) => {
    const query = projectPostQuery(params.projectId, params.postId)
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
    // console.log(inputs)

    // return null

    await createProjectPost(inputs.projectId, {
      title: inputs.title,
      comment: inputs.comment,
    })

    queryClient.invalidateQueries({
      queryKey: ["projects", inputs.projectId, "posts"],
    })

    return redirect(`/${inputs.projectId}/posts`)
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

        <div className="w-full max-w-6xl m-auto">
          <nav className="py-8 w-full flex gap-4">
            <NavLink
              to={`/${projectId}`}
              end
              className={({ isActive }) =>
                isActive
                  ? "bg-zinc-400 py-3 px-6 inline-block border-b-4 border-[#FBBC05] hover:bg-zinc-300 transition-colors"
                  : "bg-zinc-400 py-3 px-6 inline-block hover:bg-zinc-300 transition-colors"
              }
            >
              Project Info
            </NavLink>
            <NavLink
              to={`/${projectId}/posts`}
              className={({ isActive }) =>
                isActive
                  ? "bg-zinc-400 py-3 px-6 inline-block border-b-4 border-[#FBBC05] hover:bg-zinc-300 transition-colors"
                  : "bg-zinc-400 py-3 px-6 inline-block hover:bg-zinc-300 transition-colors"
              }
            >
              Blog Posts
            </NavLink>
          </nav>
          <div className="flex flex-col">
            <div className="flex justify-between items-center w-full m-auto">
              <div className="flex flex-col">
                <h2 className="text-3xl font-bold text-zinc-800 flex items-center">
                  {data.title}
                </h2>
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
                <div className="flex gap-4 items-center">
                  <NavLink
                    to="posts/new"
                    className="inline-block bg-zinc-500 py-2 px-6 rounded-lg border-2 border-zinc-300 text-zinc-100 font-medium"
                  >
                    New Post
                  </NavLink>
                  <p className="bg-green-600 py-2 px-6 text-zinc-100 rounded-lg">
                    Owner
                  </p>
                </div>
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
            <div className="w-full m-auto h-[2px] max-w-7xl bg-zinc-300 rounded-full my-4"></div>
          </div>

          <Outlet />
        </div>
      </div>
    </>
  )
}

function useGetProjectData() {
  const { projectId } = useParams()
  const query = useQuery(projectInfoQuery(projectId))

  return {
    projectId,
    ...query,
  }
}

function SubmitFetcherBtn({ fetcher, message, className }) {
  return (
    <button
      type="submit"
      className={`bg-blue-600 text-slate-100 px-4 rounded-lg mt-4 flex items-center justify-center min-w-[10rem] disabled:bg-blue-500 ${className}`}
      disabled={fetcher.state === "submitting"}
    >
      {fetcher.state === "submitting" ? (
        <Spinner color="white" />
      ) : (
        <p className="py-2">{message}</p>
      )}
    </button>
  )
}

export function CreatePost() {
  const { user } = useUser()
  const { data, isLoading, projectId } = useGetProjectData()
  const [isPreview, setIsPreview] = useState(false)
  const [comment, setComment] = useState("")
  const fetcher = useFetcher()

  if (isLoading || !user) return <div>loading</div>

  if (data.ownerId !== user.id) {
    toast.error("Can only create post if owner")
    return redirect("..")
  }

  return (
    <div className="flex gap-4 items-start flex-col">
      <button onClick={() => setIsPreview((prev) => !prev)}>switch view</button>
      <fetcher.Form method="post" className="flex gap-4 flex-col w-full">
        <Input>
          <StyledInput placeholder="Title" name="title" id="title" />
        </Input>
        {isPreview ? (
          <article className="prose prose-base prose-slate">
            <Markdown>{comment}</Markdown>
          </article>
        ) : (
          <TextArea
            name=""
            id="comment"
            cols="30"
            rows="10"
            className="w-full resize-none"
            placeholder="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        )}
        <input type="hidden" name="comment" value={comment} />
        <input type="hidden" name="projectId" value={projectId} />
        <SubmitFetcherBtn
          fetcher={fetcher}
          message="Create Post"
          className="w-fit"
        />
      </fetcher.Form>
    </div>
  )
}

export function ProjectInfo() {
  const { data, isLoading, isError } = useGetProjectData()

  return (
    <div className="flex justify-between w-full gap-16">
      <div className="flex flex-col gap-4">
        <p className="text-zinc-800 leading-7">{data.description} </p>
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

export function ProjectPostsLayout() {
  const { projectId, postId } = useParams()
  const { data, isLoading, isError } = useQuery(projectPostsQuery(projectId))
  const navigate = useNavigate()

  useEffect(() => {
    if (postId === undefined && !isLoading) {
      console.log("here")

      if (data.length === 0) return
      navigate(`/${projectId}/posts/${data[0].id}`)
    }
  }, [])

  if (isLoading) return <div>loading posts</div>

  if (isError) return <div>something went wrong</div>

  if (data.length === 0)
    return (
      <div className="font-medium text-zinc-800 text-lg">
        No Blog post to show
      </div>
    )

  return (
    <div className="flex justify-between gap-8">
      <div className="flex w-fit gap-4 flex-col">
        {data.map((post) => (
          <NavLink
            key={post.id}
            className={({ isActive, isPending }) =>
              isActive
                ? "flex w-full gap-16 justify-between items-center p-4 border-2 border-blue-500 max-w-xs rounded-lg"
                : isPending
                ? "flex w-full gap-16 justify-between items-center p-4 border-2 border-zinc-500 bg-zinc-400 max-w-xs rounded-lg"
                : "flex w-full gap-16 justify-between items-center p-4 border-2 border-zinc-400 max-w-xs rounded-lg hover:border-zinc-500 transition-all"
            }
            to={`${post.id}`}
          >
            <div>
              <p className="font-medium text-zinc-800">{post.title}</p>
              <p className="text-sm text-zinc-600">
                {dayjjs(post.createdAt.toDate()).toDate().toLocaleDateString()}
              </p>
            </div>
            <span className="material-symbols-outlined hover:text-zinc-500 text-zinc-700 transition-colors">
              favorite
            </span>
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}

export function ProjectPost() {
  const params = useParams()
  const { data, isLoading, isError } = useQuery(
    projectPostQuery(params.projectId, params.postId)
  )

  if (isLoading) return <div>loading..</div>

  if (isError) return <div>something went wrong</div>

  return (
    <div className="flex-1 border-2 border-zinc-400 rounded-lg p-4">
      <article className="prose prose-base prose-slate">
        <Markdown>{data.comment}</Markdown>
      </article>
    </div>
  )
}
