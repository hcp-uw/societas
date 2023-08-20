import { useQuery } from "@tanstack/react-query"
import { useFetcher, useParams } from "react-router-dom"
import { createProjectJoinRequest, getProjectById } from "../firebase"
import Spinner from "../components/Spinner"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { useUser } from "@clerk/clerk-react"
import { TextArea } from "../components/inputs"
import { useState } from "react"
import { useEffect } from "react"
dayjjs.extend(relativeTime)

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
      queryKey: ["projects", inputs.projectId],
    })
    return null
  }

export default function Project() {
  const { projectId } = useParams()

  const { user } = useUser()
  const fetcher = useFetcher()
  const { data, isLoading, isError } = useQuery(projectQuery(projectId))
  const [showModal, setShowModal] = useState(false)
  // console.log(data)

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
              Show the owner of this project why you might be a good fit! <br />
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

      <div className="max-w-3xl w-full border-2 rounded-lg h-fit">
        <div className="bg-[#D9D9D9] flex p-5 rounded-t-lg flex-col">
          <div className="flex justify-between mb-4">
            <h2 className="text-3xl font-bold text-zinc-800">{data.title}</h2>
            {user && !data.requestants.find((member) => member === user.id) ? (
              <button
                className="text-zinc-100 py-2 px-6 rounded-lg bg-[#FBBC05] font-medium hover:bg-yellow-500 transition-colors"
                onClick={() => setShowModal(true)}
              >
                Join
              </button>
            ) : !user ? (
              <div> Login to send request</div>
            ) : (
              <button className=" bg-zinc-400 text-zinc-700 p-2 rounded-xl group hover:bg-red-500 hover:outline-none hover:text-zinc-100 transition-colors min-w-[7.5rem]">
                <span className="group-hover:hidden">Request Sent</span>
                <span className="hidden group-hover:inline-block">
                  Unrequest
                </span>
              </button>
            )}
          </div>
          <p className="max-w-[80%]">{data.description}</p>
        </div>
        <div className="flex flex-col gap-4 p-5">
          {/* <p>
            <span className="underline font-semibold mr-3 underline-offset-4">
              Description
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
      </div>
      <div className=" w-full flex items-center justify-center">
        <img src={data.imageUrl} alt="" width={400} height={400} />
      </div>
    </div>
  )
}
