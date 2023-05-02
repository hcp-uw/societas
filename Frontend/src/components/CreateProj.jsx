import styled from "styled-components"
import { useState, useRef } from "react"
import Inputs from "./CreateProj/Inputs"
import Files from "./CreateProj/Files"
import SubmitBtn from "./CreateProj/SubmitBtn"

export default function CreateProj() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    location: "",
    maxMems: "",
    images: [],
  }) // state form the inputs

  const fileInputRef = useRef()

  // handles when the form is submitted
  // params:
  //  e -> event object

  function handleSubmit(e) {
    e.preventDefault()

    fetch("http://arjunnaik.pythonanywhere.com/").then((res) => {
      console.log(res)
    })
  }

  // handles deltetion of picture
  // params:
  //  index -> index of picture to be deleted

  function handleDelPictre(index) {
    const newArr = formState.images.filter((_, i) => i !== index)
    setFormState({ ...formState, images: newArr })
  }

  function handleAddPicture(file) {
    console.log(file)
    if (formState.images.includes(file)) {
      throw Error("this already exists")
    }
    setFormState({
      ...formState,
      images: [...formState.images, file],
    })
  }

  // return true if form fields are not empty
  // false otherwiise

  function isFormValid() {
    for (let prop in formState) {
      if (formState[prop] === "" && prop !== "images") {
        return false
      }
    }
    return true
  }

  return (
    <StyledForm onSubmit={handleSubmit}>
      <Inputs
        formState={formState}
        setFormState={setFormState}
        handleSubmit={handleSubmit}
        isFormValid={isFormValid}
      />
      <Files
        fileInputRef={fileInputRef}
        formState={formState}
        handleAddPicture={handleAddPicture}
        handleDelPicture={handleDelPictre}
      />
      {/* Submit button for mobile view */}

      <SubmitBtn isFormValid={isFormValid} />
    </StyledForm>
  )
}

const StyledForm = styled.form`
  font-family: ${({ theme }) => theme.fonts.default};
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.mainText};
  max-width: 57rem;
  padding: 0.5rem;
  gap: 4rem;
  margin: auto;

  @media (min-width: 62rem) {
    flex-direction: row-reverse;
  }
`
