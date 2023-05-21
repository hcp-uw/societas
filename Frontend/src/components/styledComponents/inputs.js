import styled from "styled-components"

export const StyledInput = styled.input`
  // the actual input
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

export const Input = styled.div`
  // the pair of input and lable
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
export const TextArea = styled.textarea`
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
