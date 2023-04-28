import styled from "styled-components"

export default function FilesWrapper({
  formState,
  fileInputRef,
  handleAddPicture,
  handleDelPictre,
}) {
  return (
    <StyledWrapper>
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
          onChange={(e) => handleAddPicture(e.target.files[0])}
          id="files"
        />
      </div>

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
    </StyledWrapper>
  )
}

const FileInput = styled.input`
  display: none;
`

const StyledWrapper = styled.div`
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
