import styled from "styled-components"
import PropTypes from "prop-types"

Spinner.propTypes = {
  color: PropTypes.string,
  size: PropTypes.string,
}
export default function Spinner({ color = "#383838", size = "3rem" }) {
  return (
    <StyledSpinner color={color} size={size}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </StyledSpinner>
  )
}

const StyledSpinner = styled.div`
  width: 1rem;
  height: 1rem;
  display: inline-block;
  position: relative;
  transform: scale(0.5);
  transform-origin: center;
  pointer-events: ${({ loading }) => (loading ? "none" : "all")};

  & div {
    box-sizing: border-box;
    display: block;
    position: absolute;
    width: ${({ size }) => size};
    height: ${({ size }) => size};
    border: 8px solid ${({ color }) => color};
    border-radius: 50%;
    animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
    border-color: ${({ color }) => color} transparent transparent transparent;
    top: -15px;
    right: -1px;
  }
  & div:nth-child(1) {
    animation-delay: -0.45s;
  }
  & div:nth-child(2) {
    animation-delay: -0.3s;
  }
  & div:nth-child(3) {
    animation-delay: -0.15s;
  }
  @keyframes lds-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`
