import styled from "styled-components"
import { useAuth } from "../../contexts/AuthContext"
import PropTypes from "prop-types"

Model.propTypes = {
  Form: PropTypes.node.isRequired,
}

export default function Model({ Form }) {
  const { authModel, setAuthModel } = useAuth()
  return (
    authModel && (
      <Modal onClick={() => setAuthModel(false)}>
        <Content>
          <CloseBtn onClick={() => setAuthModel(false)}>
            <span className="material-symbols-outlined">close</span>
            <Form />
          </CloseBtn>
        </Content>
      </Modal>
    )
  )
}

const Modal = styled.div`
  width: 100vw;
  height: 100vw;
  background-color: rgba(51, 51, 51, 0.44);
  display: flex;
`

const Content = styled.div`
  width: 32rem;
  height: 37rem;
  margin: auto;
  background-color: #d9d9d9;
  position: relative;
`

const CloseBtn = styled.button`
  width: 2rem;
  height: 2rem;
  display: flex;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.lightBg};
  border: none;

  span {
    font: 1rem;
    color: ${({ theme }) => theme.colors.mainText};
    margin: auto;
  }
`
