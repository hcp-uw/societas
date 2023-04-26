import styled from "styled-components"
import { useState, useRef } from "react"

export default function CreateProj() {
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    location: "",
    projEnds: "",
    maxMems: "",
  }) // state form the inputs

  const [files, setFiles] = useState([]) // state for the images

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
    const newArr = files.filter((_, i) => i !== index)
    console.log(newArr)
    setFiles(newArr)
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
      {/* Image wrapper */}
      <FilesWrapper>
        <div>
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
            onChange={(e) => setFiles([...files, e.target.files[0]])}
            id="files"
          />
        </div>

        <Images>
          {files.map((file, i) => (
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
        {/* Loaction input */}
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
      </InputsWrapper>
    </StyledForm>
  )
}

const StyledForm = styled.form`
  font-family: ${({ theme }) => theme.fonts.default};
  display: flex;
  flex-direction: row;
  color: ${({ theme }) => theme.colors.mainText};
`

const SubmitWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
`

const Images = styled.div`
  display: flex;
  flex-direction: column;
`

const Image = styled.div`
  position: relative;
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
  max-width: 36rem;
  gap: 2rem;
  padding: 0.5rem;
`

const FilesWrapper = styled.div`
  p {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
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

    &:hover {
      background-color: ${({ theme }) => theme.colors.mainText};
      color: ${({ theme }) => theme.colors.whiteText};
    }
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
