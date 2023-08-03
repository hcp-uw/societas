// import React from 'react'

import { useState } from "react"
import { useEffect } from "react"
import { getAllProjects } from "../firebase"
import styled from "styled-components"
import Masonry from "react-masonry-css"
import dayjjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
dayjjs.extend(relativeTime)
import { auth } from "../firebase"

export default function Home() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAllProjects().then((projects) => {
      console.log(projects)
      setData(projects)
      setLoading(false)
    })
  }, [])

  if (loading) return <div>loading...</div>

  if (!data) return <div>There is no projects</div>

  const breakpointColumnsObj = {
    default: 4,
    1826: 3,
    1347: 2,
    900: 1,
  }

  return (
    <>
      {auth.currentUser ? <h1>{auth.currentUser.email}</h1> : <h1>welcome</h1>}
      <Masonry
        breakpointCols={breakpointColumnsObj}
        className="masonry"
        columnClassName="masonryCol"
        style={{ margin: "auto", maxWidth: "80%" }}
      >
        {[...data, ...data].map((proj) => (
          <StyledProj key={proj.id}>
            <Img src={proj.imageURL} width={300} />
            <h2>{proj.title}</h2>
            <p>{proj.description}</p>
            <TimeBlob>
              <span className="material-symbols-outlined">schedule</span>
              {dayjjs(proj.createdAt.toDate()).fromNow()}
            </TimeBlob>
          </StyledProj>
        ))}
      </Masonry>
    </>
  )
}

// const Projects = styled.div`
//   display: flex;
//   /* flex-flow: column; */
//   /* max-width: 80%; */
//   margin: auto;
//   height: min-content;
//   gap: 4rem;
//   align-items: flex-start;
// `

const StyledProj = styled.div`
  background-color: #e9e9e9;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.default};
  padding: 1.5rem;
  border-radius: 21px;
  gap: 1rem;
  margin-bottom: 2rem;
  /* max-width: 19rem; */
`

const TimeBlob = styled.p`
  background-color: #d9d9d9;
  border-radius: 10px;
  width: fit-content;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const Img = styled.img`
  object-fit: contain;
  max-height: 15rem;
  margin: auto;
`
