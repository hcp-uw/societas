import styled from "styled-components"

export default function CreateProj() {
  function handleSubmit(e) {
    e.preventDefault()

    fetch("http://arjunnaik.pythonanywhere.com/", { mode: "no-cors" }).then(
      (res) => {
        console.log(res)
      }
    )
  }
  return (
    <div>
      CreateProj
      <form action="">
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <input type="text" />
        <button onClick={handleSubmit}>submit</button>
      </form>
    </div>
  )
}

// const ProjecTitleInput = styled.input`
// `
