// when a redundant post has been made this is swhat will show up
export default function WhoopsPage() {
  return (
    <div>
      <h1 className="text-center WP-title">Whoops!</h1>

      {/* text */}
      <div className="row justify-content-center WP-wrapper">
        <div
          className="text-wrap"
          style={{ width: "50%", textAlign: "center" }}
        >
          <p className="WP-text1">
            This post is already posted, you can't post redundant project.
          </p>
          <p className="WP-text1">
            You can contact us through xxxxx@gmail.com{" "}
          </p>
          <p className="WP-text1">Thank you for your understanding. </p>
        </div>
      </div>

      {/* button */}
      <div className="WP-button-container row justify-content-center">
        <button type="button" className="WP-button">
          Ok
        </button>
      </div>
    </div>
  )
}
