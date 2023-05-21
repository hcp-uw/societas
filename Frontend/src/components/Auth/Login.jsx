import styled from "styled-components"
import { StyledInput, Input } from "../styledComponents/inputs"

export default function Login() {
  return (
    <StyledWrapper>
      <Input>
        <label htmlFor="">email</label>
        <StyledInput placeholder="johnDoe@uw.edu" />
      </Input>

      <Input>
        <label htmlFor="">password</label>
        <StyledInput />
      </Input>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div``
