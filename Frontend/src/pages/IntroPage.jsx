export default function IntroPage() {
  return (
    <div>
      <h1 className="text-center introTitle">Welcome to Societas!</h1>

      <div className="wrapper" style={{ marginTop: "3em" }}>
        <div className="text-wrap fw-bold" style={{ width: "55%" }}>
          <p className="introText1">Together, we improve!</p>
          <p className="introText2">
            Societas is a website that creates a judgment-free zone for you to
            find other like-minded peers to make your passion project come true.
          </p>
        </div>

        <img
          src="../public/images/Surfer.png"
          alt="Surfer"
          style={{ maxWidth: "30%", marginRight: "4em" }}
        />
      </div>

      <div className="wrapper">
        <div className="image2-container">
          <img
            src="../public/images/Telescope.png"
            alt="Telescope"
            style={{ maxWidth: "80%" }}
          />
        </div>

        <div className="text-wrap fw-bold " style={{ width: "50%" }}>
          <p className="introText3">
            We value your time, so we will just let the experience speak for
            itself...
          </p>
        </div>
      </div>

      <div className="introButton-container">
        <button type="button" className="introButton">
          Let's Go!
        </button>
      </div>
    </div>
  )
}
