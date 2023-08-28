import { useQuery } from "@tanstack/react-query"
import { getAllRequests } from "../firebase"
import { useUser } from "@clerk/clerk-react"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import { Form } from "react-router-dom"
dayjjs.extend(relativeTime)

const requestsQuery = (currentUserId) => ({
  queryKey: ["requests"],
  queryFn: () => getAllRequests(currentUserId),
})

export default function Requests() {
  const { user } = useUser()
  const { data, isLoading } = useQuery(requestsQuery(user.id ?? ""))

  if (isLoading) return <div>loading</div>

  if (!data) return <div>something went wrong</div>

  return (
    <div className="w-full flex flex-col gap-4 ml-8">
      {data.map((request) => (
        <div
          key={request.id}
          className="flex justify-between w-full border-2 py-5 px-4 rounded-xl"
        >
          <div className="flex gap-6">
            <img src={request.imageUrl} alt="" width={200} height={200} />
            <div className="">
              <p className="text-sm text-zinc-600">
                {dayjjs(request.createdAt.toDate()).fromNow()}
              </p>
              <h1 className="text-2xl font-bold text-zinc-800 mb-5">
                {request.projectTitle}
              </h1>

              <p>{request.message}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <Form method="post" action="acceptReq">
              <button className="bg-blue-600 p-2 h-fit text-zinc-100 rounded-xl">
                Accept
              </button>
            </Form>

            <Form method="post" action="declineReq">
              <button className="bg-zinc-600 p-2 h-fit text-zinc-100 rounded-xl">
                Decline
              </button>
            </Form>
          </div>
        </div>
      ))}
    </div>
  )
}
