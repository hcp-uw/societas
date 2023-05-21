import styled from "styled-components"
import PropType from "prop-types"
import SubmitBtn from "./SubmitBtn"
import { StyledInput, Input, TextArea } from "../styledComponents/inputs"

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
