import { QueryClient, useQuery } from "@tanstack/react-query"
import {
  ActionFunctionArgs,
  FetcherWithComponents,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
  useNavigate,
  useParams,
} from "react-router-dom"
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
import { NavLink, Outlet } from "react-router-dom"
import Markdown from "react-markdown"
import { useMemo } from "react"
import { z } from "zod"

dayjjs.extend(relativeTime)
//
const projectInfoQuery = (id: string) => ({
  queryKey: ["projects", id, "info"],
  queryFn: () => getProjectById(id),
})

const projectPostsQuery = (id: string) => ({
  queryKey: ["projects", id, "posts"],
  queryFn: () => getAllProjectPosts(id),
})

const projectPostQuery = (projectId: string, postId: string) => ({
  queryKey: ["projects", projectId, "posts", postId],
  queryFn: () => getProjectPostById(projectId, postId),
})
// uses queryclient to load data that will be used in main when a url is accessed (applies to all the loaders). preloads data in main.
export const infoLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.projectId) throw Error("No Project Id found in url params")
    const query = projectInfoQuery(params.projectId)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export const postsLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.projectId) throw new Error("no project Id found in url params")
    const query = projectPostsQuery(params.projectId)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }

export const postLoader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    if (!params.projectId) throw new Error("no project Id found in url params")
    if (!params.postId) throw new Error("no post Id found in url params")
    const query = projectPostQuery(params.projectId, params.postId)
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    )
  }
// send request, parses data when asking to join a project
export const action =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const inputsSchema = z.object({
      projectId: z.string(),
      imageUrl: z.string(),
      message: z.string(),
      ownerId: z.string(),
      projectTitle: z.string(),
      requestantId: z.string(),
    })
    const inputs = inputsSchema.parse(Object.fromEntries(formData))
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
// sends request, parses data when creatin a post
export const createPostAction =
  (queryClient: QueryClient) =>
  async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData()
    const inputsSchema = z.object({
      title: z.string(),
      comment: z.string(),
      projectId: z.string(),
    })
    const inputs = inputsSchema.parse(Object.fromEntries(formData))

    await createProjectPost(inputs.projectId, {
      title: inputs.title,
      comment: inputs.comment,
    })

    queryClient.invalidateQueries({
      queryKey: ["projects", inputs.projectId, "posts"],
    })

    return redirect(`/${inputs.projectId}/posts`)
  }
  // all the information and styling for a specific project
export default function Project() {
  const { projectId } = useParams()

  const { user } = useUser()
  const fetcher = useFetcher()
  const { data, isLoading, isError } = useQuery(
    projectInfoQuery(projectId ?? "")
  )
  const [showModal, setShowModal] = useState(false)
  const role = useMemo(() => getRole(), [data, user])

  if (!data) return <div>User not found</div>

  function getRole() {
    if (!data || !user) return
    if (data.ownerId === user.id) {
      return "owner"
    } else if (data.members.find((member) => member === user.id)) {
      return "member"
    } else if (data.requestants.find((requestant) => requestant === user.id)) {
      return "requestant"
    } else {
      return "none"
    }
  }

  useEffect(() => {
    return () => {
      if (fetcher.state === "submitting") {
        setShowModal(false)
      }
    }
  }, [fetcher.state])

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
          <div className="absolute w-screen h-screen bg-zinc-200 bg-opacity-75 top-0 left-0 flex items-center justify-center">
            <fetcher.Form method="POST">
              <label
                htmlFor="textAreaProj"
                className="text-2xl font-semibold mb-2 w-full flex justify-between"
              >
                Why do you want to join this project?
                <button
                  className="w-8 h-8 bg-zing-500 flex items-center justify-center rounded-full transition-colors hover:bg-zinc-700 hover:text-zinc-100"
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
                cols={70}
                rows={70}
                name="message"
              />
              <input type="hidden" value={projectId} name="projectId" />
              <input
                type="hidden"
                value={user ? user.id : ""}
                name="requestantId"
              />
              <input type="hidden" value={data.ownerId} name="ownerId" />
              <input type="hidden" value={data.title} name="projectTitle" />
              <input type="hidden" value={data.imageUrl} name="imageUrl" />
              <SubmitFetcherBtn fetcher={fetcher} message="Send join request" />
            </fetcher.Form>
          </div>
        )}

        <div className="w-full max-w-6xl m-auto flex flex-col gap-4">
          <h2 className="text-3xl font-bold text-zinc-800 flex items-center">
            {data.title}
          </h2>
          <nav className="w-full flex gap-4 border-b-2 justify-between items-center">
            <div className="flex gap-4">
              <NavLink
                to={`/${projectId}`}
                end
                className={({ isActive }) =>
                  isActive
                    ? " font-medium text-zinc-800 p-2 inline-block border-b-2 border-[#FBBC05] hover:bg-zinc-300 transition-colors"
                    : " border-b-2 border-transparent p-2 text-zinc-600 inline-block hover:bg-zinc-300 transition-colors"
                }
              >
                Project Info
              </NavLink>
              <NavLink
                to={`/${projectId}/posts`}
                className={({ isActive }) =>
                  isActive
                    ? " font-medium text-zinc-800 p-2 inline-block border-b-2 border-[#FBBC05] hover:bg-zinc-300 transition-colors"
                    : " border-b-2 border-transparent p-2 text-zinc-600 inline-block hover:bg-zinc-300 transition-colors"
                }
              >
                Blog Posts
              </NavLink>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              {role === "owner" ? (
                <div className="flex gap-4 items-center">
                  <NavLink
                    to="posts/new"
                    className="inline-block bg-green-600 transition-colors hover:bg-green-700 py-1 px-6 rounded-lg text-zinc-100 font-medium"
                  >
                    New Post
                  </NavLink>
                </div>
              ) : role === "none" ? (
                <button
                  className="text-zinc-100 h-fit py-1 px-6 rounded-lg bg-[#FBBC05] font-medium hover:bg-yellow-500 transition-colors"
                  onClick={() => setShowModal(true)}
                >
                  Join
                </button>
              ) : role === "requestant" ? (
                <div className="py-1 px-6 bg-zinc-200 rounded-lg cursor-default">
                  Requested
                </div>
              ) : role === "member" ? (
                <div className="py-1 px-6 bg-blue-500 text-zinc-100 rounded-lg cursor-default">
                  Member
                </div>
              ) : (
                <div>Log in to join!</div>
              )}
            </div>
          </nav>
          <Outlet />
        </div>
      </div>
    </>
  )
}
// returns the data for a specific project that has been requested
function useGetProjectData() {
  const { projectId } = useParams()
  const query = useQuery(projectInfoQuery(projectId ?? ""))

  return {
    projectId,
    ...query,
  }
}

type SubmitFetcherBtnProps = {
  fetcher: FetcherWithComponents<any>
  message: string
  className?: string
}
// the submit button and what to do if its in a loading state
function SubmitFetcherBtn({
  fetcher,
  message,
  className,
}: SubmitFetcherBtnProps) {
  return (
    <button
      type="submit"
      className={`bg-blue-500 hover:bg-blue-600 transition-colors text-slate-100 px-4 rounded-lg mt-4 flex items-center justify-center min-w-[10rem] disabled:bg-blue-400 ${className}`}
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
// provides the layout, styling, and data to create a post
export function CreatePost() {
  const { user } = useUser()
  const { data, isLoading, projectId } = useGetProjectData()
  const [isPreview, setIsPreview] = useState(false)
  const [comment, setComment] = useState("")
  const [title, setTitle] = useState("")
  const fetcher = useFetcher()
  const navigate = useNavigate()

  if (isLoading) return <div>loading</div>

  if (!user) return <div>loading</div>

  if (!data) return <div>something went wrong! Try reloading</div>

  if (data.ownerId !== user.id) {
    toast.error("Can only create post if owner")
    navigate("..")
  }

  return (
    <div className="flex gap-4 items-start flex-col">
      <div>
        <button
          onClick={() => setIsPreview((prev) => !prev)}
          className="bg-zinc-100 hover:bg-zinc-200 transition-colors py-2 px-6 rounded-lg"
        >
          {isPreview ? "Edit Text" : "Preview"}
        </button>
      </div>
      <fetcher.Form method="post" className="flex gap-4 flex-col w-full">
        {isPreview ? (
          <>
            <h1 className="text-xl font-bold">
              {title.length > 0 ? (
                title
              ) : (
                <span className="italic text-zinc-400">No title</span>
              )}
            </h1>
            <article className="prose prose-base prose-slate border min-h-[16px] rounded-lg p-2">
              {comment.length > 0 ? (
                <Markdown>{comment}</Markdown>
              ) : (
                <p className="text-zinc-200">No content</p>
              )}
            </article>
          </>
        ) : (
          <>
            <Input>
              <StyledInput
                placeholder="Title"
                name="title"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Input>
            <div>
              <TextArea
                id="comment"
                cols={30}
                rows={10}
                className="w-full resize-none"
                placeholder="Comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <a
                href="https://www.markdownguide.org/basic-syntax/"
                target="_blank"
                className="text-zinc-400 flex items-center transition-colors hover:text-blue-400"
                rel="noreferrer"
              >
                Styling with Markdown is supported
                <span className="material-symbols-outlined">markdown</span>
              </a>
            </div>
          </>
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
// Project info tab data and layout
export function ProjectInfo() {
  const { data, isLoading } = useGetProjectData()

  if (isLoading) return <div>loading</div>

  if (!data) return <div>something went wrong, Try again!</div>

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
        <p className="capitalize">
          <span className="underline font-semibold mr-3 underline-offset-4">
            Start Date:
          </span>
          {data.startDate}
        </p>
        <p className="capitalize">
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
// Blog post tab layout and data
export function ProjectPostsLayout() {
  const { projectId, postId } = useParams()
  const { data, isLoading, isError } = useQuery(
    projectPostsQuery(projectId ?? "")
  )
  const navigate = useNavigate()

  useEffect(() => {
    if (postId === undefined && data) {
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
    <div className="flex justify-between gap-8 w-full overflow-hidden max-h-[800px]">
      <div className="flex w-full max-w-sm gap flex-col overflow-y-auto">
        {data.map((post) => (
          <NavLink
            key={post.id}
            className={({ isActive, isPending }) =>
              isActive
                ? "flex w-full first:border-t first:rounded-t-lg last:rounded-b-lg border-2 gap-16 justify-between items-center p-4 border-blue-500 bg-zinc-300 max-w-xs transition-all"
                : isPending
                ? "flex w-full first:border-t first:rounded-t-lg last:rounded-b-lg border-x gap-16 justify-between items-center p-4 border-b border-zinc-500 animate-pulse max-w-xs transition-colors"
                : "flex w-full first:border-t first:rounded-t-lg last:rounded-b-lg border-x gap-16 justify-between items-center p-4 border-b border-zinc-400 max-w-xs hover:bg-zinc-200 transition-colors "
            }
            to={`${post.id}`}
          >
            <div>
              <p className="font-medium text-zinc-800">{post.title}</p>
              <p className="text-sm text-zinc-600">
                {dayjjs(post.createdAt.toDate()).toDate().toLocaleDateString()}
              </p>
            </div>
          </NavLink>
        ))}
      </div>
      <Outlet />
    </div>
  )
}
// layout and data for a specific project post
export function ProjectPost() {
  const params = useParams()
  const { data, isLoading } = useQuery(
    projectPostQuery(params.projectId ?? "", params.postId ?? "")
  )

  if (isLoading) return <div>loading..</div>

  if (!data) return <div>something went wrong</div>

  return (
    <div className="flex-1 border-1 border-zinc-400 rounded-lg p-4 w-full overflow-auto">
      <article className="prose prose-base prose-slate">
        <Markdown>{data.comment}</Markdown>
      </article>
    </div>
  )
}
