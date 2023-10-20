import { Link, redirect } from "react-router-dom"
import LogoRoute from "../assets/logo.svg"
import SurferRoute from "../assets/surfer.png"
import TelescopeRoute from "../assets/Telescope.png"
import TeamWork from "../assets/Teamwork.svg"
export default function Intro() {
  // if (localStorage.getItem("firstTimeUser") === "false") {
  //   console.log("here")
  //   return redirect("/")
  // }
  return (
    <div className=" w-full m-auto pt-8 flex flex-col gap-4 overflow-hidden">
      <h1 className="flex flex-col items-center text-4xl relative">
        <img src={LogoRoute} alt="Societas Logo" width={100} className="" />
        <p className="text-center text-zinc-800 font-bold -bottom-2 md:-bottom-3">
          Welcome to <span className="font-extrabold">Societas</span>
        </p>
      </h1>

      <div className="flex flex-col gap-6 justify-center items-center relative">
        <div className="after:bg-intro-gradient-orange after:w-full after:-left-24 after:top-6 after:-z-10 after:max-w-3xl after:h-36 after:rotate-12 content-[''] after:absolute">
          <img src={TeamWork} alt="Teamwork" width={350} className="w-60" />
        </div>
        <div className="flex flex-col gap-4 px-4">
          <p className="text-2xl font-bold leading-5 whitespace-nowrap">
            Together, we improve!
          </p>
          <p>
            Societas creates a judgment-free zone for you to find other
            like-minded peers to make your passion project come true.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 justify-center items-center relative">
        <div className="after:bg-intro-gradient-blue after:w-full after:-right-12 after:-translate-y-[170px] mb-4 after:-z-10 after:max-w-3xl after:h-36 after:-rotate-12 content-[''] after:absolute">
          <img src={SurferRoute} alt="Surfer" width={350} className="w-64" />
        </div>
        <div className="flex flex-col gap-4 px-4">
          <p className="text-2xl font-bold leading-5 whitespace-nowrap">
            Let your passion shine!
          </p>
          <p>
            The entire process of joining a project is completely anonymous, so
            be sure to show your passion for the project you are either creating
            or joining! That is the only thing that others will see.
          </p>
        </div>
      </div>

      {/* <div className="wrapper">
        <div className="image2-container">
          <img
            src={TelescopeRoute}
            alt="Telescope"
            className="absolute bottom-0 left-0"
            style={{ maxWidth: "80%" }}
          />
        </div>

        <div className="text-wrap fw-bold " style={{ width: "50%" }}>
          <p className="introText3">
            We value your time, so we will just let the experience speak for
            itself...
          </p>
        </div>
      </div> */}

      <div className="introButton-container">
        <Link
          className="bg-[#ffd559] py-3 px-8 text-2xl rounded-lg hover:bg-[#FBBC05] hover:-translate-y-1 hover:shadow-lg transition-all"
          onClick={() => localStorage.setItem("firstTimeUser", false)}
          to="/"
        >
          {"Let's Go!"}
        </Link>
      </div>
    </div>
  )
}
