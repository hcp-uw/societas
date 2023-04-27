import styled from "styled-components"
import { useState, useRef } from "react"

export default function CreateProj() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    location: "",
    projEnds: "",
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
    if (formState.images.includes(file)) {
      return
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
      if (formState[prop] === "") {
        return false
      }
    }
    return true
  }

  return (
    <StyledForm action="">
      {/* Wrapper for inputs */}
      <InputsWrapper>
        {/* Title Input */}
        <ProjecTitleInput
          type="text"
          placeholder="Project Title"
          onChange={(e) =>
            setFormState({ ...formState, title: e.target.value })
          }
          value={formState.title}
          required
        />
        {/* Description input */}
        <TextArea
          name=""
          id=""
          cols="20"
          rows="5"
          placeholder="description of your project"
          onChange={(e) =>
            setFormState({ ...formState, description: e.target.value })
          }
          value={formState.description}
          required
        ></TextArea>
        {/* Location input */}
        <StyledInput
          type="text"
          placeholder="Enter Project Location Here"
          onChange={(e) =>
            setFormState({ ...formState, location: e.target.value })
          }
          value={formState.location}
          required
        />
        {/* Date input */}
        <InputLabel>
          <label htmlFor="date">Project ends at:</label>
          <input
            type="date"
            id="date"
            onChange={(e) =>
              setFormState({ ...formState, projEnds: e.target.value })
            }
            value={formState.projEnds}
            required
          />
        </InputLabel>
        {/* Max mems input */}
        <InputLabel>
          <label htmlFor="">number of members:</label>
          <input
            type="number"
            min={0}
            max={100}
            placeholder="5"
            onChange={(e) =>
              setFormState({ ...formState, maxMems: e.target.value })
            }
            value={formState.maxMems}
            required
          />
        </InputLabel>

        <SubmitWrapper desktop>
          <SubmitBtn
            type="submit"
            onClick={handleSubmit}
            disabled={!isFormValid()}
          >
            Post Project
          </SubmitBtn>
        </SubmitWrapper>
      </InputsWrapper>
      {/* Image wrapper */}
      <FilesWrapper>
        <>
          <p>
            Add pictures
            <label htmlFor="files">
              <span className="material-symbols-outlined">add</span>
            </label>
          </p>
          <FileInput
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={(e) => handleAddPicture(e.target.files[0])}
            id="files"
          />
        </>

        {/* images for project */}
        <Images>
          {formState.images.map((file, i) => (
            <Image key={file.name}>
              <button onClick={() => handleDelPictre(i)} type="button">
                <span className="material-symbols-outlined">close</span>
              </button>
              <img
                src={URL.createObjectURL(file)}
                alt=""
                key={file.name}
                width={300}
                height={300}
              />
            </Image>
          ))}
        </Images>
      </FilesWrapper>
      {/* Submit button wrapper and button */}
      <SubmitWrapper>
        <SubmitBtn
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Post Project
        </SubmitBtn>
      </SubmitWrapper>
    </StyledForm>
  )
}

const StyledForm = styled.form`
  font-family: ${({ theme }) => theme.fonts.default};
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.colors.mainText};
  max-width: 36rem;
  padding: 0.5rem;
  gap: 1rem;
  margin: auto;

  @media (min-width: 62rem) {
    flex-direction: row-reverse;
  }
`

const SubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  display: ${({ desktop }) => (desktop ? "none" : "default")};
  @media (min-width: 62rem) {
    display: inline-block;
    display: ${({ desktop }) => (desktop ? "flex" : "none")};
    justify-content: flex-end;
    align-items: flex-end;
  }
`

const Images = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  overflow-y: scroll;
  @media (min-width: 62rem) {
    flex-direction: column;
    overflow-y: visible;
  }

  /* width: 100vw; */
`

const Image = styled.div`
  position: relative;
  width: min-content;
  img {
    object-fit: cover;
  }
  button {
    position: absolute;
    right: 0;
    margin-right: 0.2rem;
    margin-top: 0.2rem;
    border-radius: 50%;
    border: none;
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 150ms ease-in;

    span {
      font-size: 1.3rem;
    }
  }
  &:hover {
    button {
      opacity: 1;
      cursor: pointer;
    }
  }
  margin-bottom: 0.5rem;
`
const SubmitBtn = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  width: min-content;
  white-space: nowrap;
  justify-self: flex-end;
  color: ${({ theme }) => theme.colors.whiteText};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  transition: all 150ms ease-in;

  &:hover {
    transform: scale(1.02) translateY(-4px);
    background-color: ${({ theme }) => theme.colors.mainText};
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }

  &:disabled {
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    background-color: ${({ theme }) => theme.colors.primaryD};
    pointer-events: none;
  }
`

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: min-content;
  @media (min-width: 62rem) {
    position: sticky;
    top: 0;
  }
`

const FilesWrapper = styled.div`
  p {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem;
    position: sticky;
    top: 0;
    height: fit-content;
    position: sticky;
    top: 0px;
    width: 100%;
    /* height: min-content; */
    z-index: 1;
    background: #ffffff9c;
  }

  label {
    width: 2rem;
    height: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: grey;
    border-radius: 100%;
    cursor: pointer;
    transition: all 150ms ease;
    margin-right: 1rem;

    &:hover {
      background-color: ${({ theme }) => theme.colors.mainText};
      color: ${({ theme }) => theme.colors.whiteText};
    }
  }

  @media (min-width: 62rem) {
    min-width: 19rem;
    margin-right: 4rem;
  }
`

const FileInput = styled.input`
  display: none;
`

const TextArea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.default};
  resize: none;
  padding: 0.5rem;
  color: inherit;
  border-bottom: solid 2px;
  border-color: ${({ theme }) => theme.colors.subText};
  border-radius: 2px;
  outline: none;

  &:focus {
    border-color: ${({ theme }) => theme.colors.mainText};
  }
`
const ProjecTitleInput = styled.input`
  font-size: xx-large;
  border: none;
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  border-bottom: solid 2px gray;
  transition: border 150ms ease-in;
  padding: 0.5rem;
  color: inherit;

  &:focus {
    border-bottom: solid 2px black;
    outline: none;
  }
`

const InputLabel = styled.div`
  display: grid;
  padding: 0.5rem;
  text-transform: capitalize;
  grid-template-columns: 1fr 1fr;

  input {
    font-family: inherit;
  }
`

const StyledInput = styled.input`
  font-size: medium;
  border: none;
  border-bottom: solid 1px gray;
  transition: border 150ms ease-in;
  padding: 0.5rem;
  color: inherit;

  &:focus {
    border-bottom: solid 1px black;
    outline: none;
  }
`
