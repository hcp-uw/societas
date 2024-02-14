import { useUser } from "@clerk/clerk-react"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import toast from "react-hot-toast"
import { z } from "zod"
import { trpc } from "../utils/trpc"
import React from "react"
dayjjs.extend(relativeTime)

//request page to be shown. 
export default function Requests() {
  const { user } = useUser()
  // const { data, isLoading, isError } = useQuery(
  //   requestsQuery(user ? user.id : "")
  // )

  const {data, isLoading, isError} = trpc.memberships.getAllIncomingRequests.useQuery(user?.id ?? "");
  const utils = trpc.useUtils();

  const acceptRequestMutation = trpc.memberships.acceptRequest.useMutation({
    onSuccess(){
      console.log("Request Accepted");
      utils.memberships.getAllIncomingRequests.invalidate();
      toast.success("Request Accepted");
    }
  });

  function handleAcceptReq(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputSchema = z.object({
      requestId: z.string()
    });
    const input = inputSchema.parse(Object.fromEntries(formData))
    acceptRequestMutation.mutate(input.requestId);
  }

  const rejectRequestMutation = trpc.memberships.rejectRequest.useMutation({
    onSuccess(){
      console.log("Request Rejected");
      utils.memberships.getAllIncomingRequests.invalidate();
      toast.success("Request Rejected");
    }
  })

  function handleRejectReq(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputSchema = z.object({
      requestId: z.string()
    })
    const input = inputSchema.parse(Object.fromEntries(formData));
    rejectRequestMutation.mutate(input.requestId)
  }

  if (isLoading) return <div>loading</div>

  if (isError) return <div>something went wrong</div>

  if (data.length === 0)
    return (
      <h1 className="text-lg font-medium w-full text-center">
        You have no requests to view
      </h1>
    )
  
  return (
    <div className="w-full flex flex-col gap-4 ml-8">
      {data.map((request) => (
        <div
          key={request.id}
          className="flex justify-between w-full border-2 py-5 px-4 rounded-xl"
        >
        <div className="flex gap-6">
          <img src={""} alt="" width={200} height={200} />
          <div className="">
            <p className="text-sm text-zinc-600">
              {dayjjs(request.createdAt).toDate().toLocaleDateString()}
            </p>
            <h1 className="text-2xl font-bold text-zinc-800 mb-5">
              {request.description}
            </h1>

            <p>{""}</p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <form onSubmit = {handleAcceptReq}>
            <input type="hidden" name="requestId" value={request.id}/>
            {/* <input type="hidden" name="projectId" value={request.projectId} />
            <input
              type="hidden"
              name="requestantId"
              value={request.userId}
            /> */}
            <button className="bg-blue-600 p-2 h-fit text-zinc-100 rounded-xl">
              Accept
            </button>
          </form>

          <form onSubmit={handleRejectReq}>
            <input type="hidden" name="requestId" value={request.id} />
            {/* <input type="hidden" name="projectId" value={request.projectId} />
            <input
              type="hidden"
              name="requestantId"
              value={request.userId}
            /> */}
            <button className="bg-zinc-600 p-2 h-fit text-zinc-100 rounded-xl">
              Decline
            </button>
          </form>
        </div>
      </div>

      ))}
    </div>
  )
}
