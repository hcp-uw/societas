import styled from "styled-components"
import PropTypes from "prop-types"

SubmitBtn.propTypes = {
  isFormValid: PropTypes.func.isRequired,
  desktop: PropTypes.bool,
}

export default function SubmitBtn({ isFormValid, desktop }) {
  return (
    <SubmitWrapper desktop={desktop}>
      <Btn type="submit" disabled={!isFormValid()}>
        Post Project
      </Btn>
    </SubmitWrapper>
  )
}

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

const Btn = styled.button`
  background-color: ${({ theme }) => theme.colors.primary};
  font-family: inherit;
  border: none;
  padding: 0.75rem 2.625rem;
  border-radius: 8px;
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
    background-color: ${({ theme }) => theme.colors.disabled};
    pointer-events: none;
  }
`
