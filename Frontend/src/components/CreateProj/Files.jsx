import styled from "styled-components"
import PropTypes from "prop-types"
import { FileUploader } from "react-drag-drop-files"

Files.propTypes = {
  formState: PropTypes.object.isRequired,
  fileInputRef: PropTypes.object.isRequired,
  handleAddPicture: PropTypes.func.isRequired,
  handleDelPicture: PropTypes.func.isRequired,
}

export default function Files({
  formState,
  handleAddPicture,
  handleDelPicture,
}) {
  return (
    <FilesWrapper>
      <FileUploader
        handleChange={handleAddPicture}
        label={"Upload pictures for your project!"}
      />

      {/* images for project */}
      <Images>
        {formState.images.map((file, i) => (
          <Image key={file.name}>
            <button onClick={() => handleDelPicture(i)} type="button">
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
  )
}

const FilesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  label {
    all: unset;
    font-family: inherit;
    white-space: nowrap;
    border: 2px dashed #27a0f2;
    border-radius: 0.5rem;
    padding: 1rem 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;

    span {
      font-size: 0.9rem;
      color: ${({ theme }) => theme.colors.subText};
    }
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
