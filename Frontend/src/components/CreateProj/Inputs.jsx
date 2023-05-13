import styled from "styled-components"
import PropType from "prop-types"
import SubmitBtn from "./SubmitBtn"

Inputs.propTypes = {
  formState: PropType.object.isRequired,
  setFormState: PropType.func.isRequired,
  handleSubmit: PropType.func.isRequired,
  isFormValid: PropType.func.isRequired,
}

export default function Inputs({
  formState,
  setFormState,
  handleSubmit,
  isFormValid,
}) {
  console.log(isFormValid())
  return (
    <InputsWrapper>
      {/* Title Input */}

      <Input>
        <label htmlFor="">Title</label>
        <StyledInput
          type="text"
          placeholder="Project Title"
          onChange={(e) =>
            setFormState({ ...formState, title: e.target.value })
          }
          value={formState.title}
          required
        />
      </Input>

      <Input>
        <label htmlFor="">Description</label>
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
      </Input>

      <Input>
        <label htmlFor="">Meet Location</label>
        <StyledInput
          type="text"
          placeholder="Enter Project Location Here"
          onChange={(e) =>
            setFormState({ ...formState, location: e.target.value })
          }
          value={formState.location}
          required
        />
      </Input>

      <Input>
        <label htmlFor="">maximum number of members:</label>
        <StyledInput
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
      </Input>

      <SubmitBtn
        handleSubmit={handleSubmit}
        isFormValid={isFormValid}
        desktop
      />
    </InputsWrapper>
  )
}

const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  height: min-content;
  @media (min-width: 62rem) {
    position: sticky;
    top: 0;
    width: 100%;
  }
`

const TextArea = styled.textarea`
  font-family: ${({ theme }) => theme.fonts.default};
  resize: none;
  padding: 0.5rem;
  border: solid 1px #dedbdb;
  transition: all 200ms ease-out;
  padding: 0.75rem 1rem;
  color: inherit;
  border-radius: 8px;
  box-shadow: 0px 3px 20px rgba(0, 0, 0, 0.15);
  outline: none;
  font-size: 1rem;

  &:focus {
    border: 1px solid #27a0f2;
    outline: none;
    box-shadow: 0px 0px 4px 1px #17a1fa;
  }
`

const StyledInput = styled.input`
  font-size: medium;
  border: none;
  border: solid 1px #dedbdb;
  transition: all 200ms ease-out;
  padding: 0.75rem 1rem;
  color: inherit;
  border-radius: 8px;

  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.15);

  &:focus {
    border: 1px solid #27a0f2;
    outline: none;
    box-shadow: 0px 0px 4px 1px #17a1fa;
  }
`

const Input = styled.div`
  display: flex;
  flex-direction: column;
  text-transform: capitalize;
  font-family: inherit;
  color: inherit;

  label {
    font-weight: ${({ theme }) => theme.fontWeight.medium};
  }

  input {
    font-family: inherit;
    margin-top: 1rem;
  }

  textarea {
    font-family: inherit;
    margin-top: 1rem;
  }
`
