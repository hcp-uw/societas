export const baseURL = "https://arjunnaik.pythonanywhere.com"
const baseConfig = {
  method: "POST",
  redirect: "follow",
}

export async function createJoinRequest(uid, pid) {
  const formData = new FormData()
  formData.append("uid", uid)
  formData.append("pid", pid)
  console.log(Object.fromEntries(formData))

  try {
    const res = await fetch(`${baseURL}/projects/joinProject`, {
      method: "POST",
      redirect: "follow",
      data: formData,
    })

    const data = await res.json()

    console.log(data)
  } catch (err) {
    console.log(err)
  }
}
