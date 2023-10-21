import { useUser } from "@clerk/clerk-react"

export default function Profile() {
  const { user } = useUser()

  if (!user) return <div>loading</div>

  return (
    <div className="flex w-full gap-6 flex-col">
      <div className="flex gap-6 items-center">
        <img
          src={user.imageUrl}
          alt={`Your profile picture`}
          className="rounded-full object-contain h-min"
          width={75}
          height={75}
        />
        <div className="flex flex-col">
          <h1 className="text-3xl font-medium">{user.fullName}</h1>
          <p>{user.unsafeMetadata.bio ?? "No bio"}</p>
        </div>
      </div>

      <h1 className="font-medium text-2xl">My Projects</h1>

      <button className="py-2 px-6 bg-blue-400 text-zinc-100 w-fit rounded-lg transition-colors hover:bg-blue-500">
        Edit Profile
      </button>
    </div>
  )
}

// function EditProfile() {
//   const { user } = useUser()

//   if (!user) return redirect("/")
// }
