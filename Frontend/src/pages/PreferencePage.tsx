// UI for preferences page
export default function PreferencePage() {
  return (
    <div>
      <h1 className="text-center PP-title">Welcome to Societas</h1>

      {/* text1  & tags */}
      <div className="PPwrapper">
        <p className="PP-text1">Please check the boxes you are interested. </p>
        {/* buttons */}
        <div
          style={{ marginTop: "2em", marginLeft: "1em" }}
          className="col align-self-center"
        >
          <div className="PPbutton-container col ">
            <div className="align-contents-center">
              <button type="button" className="PP-button PP-button-purple">
                Coding +
              </button>
              <button type="button" className="PP-button PP-button-purple">
                Front End +
              </button>
              <button type="button" className="PP-button PP-button-purple">
                Back End +
              </button>
              <button type="button" className="PP-button PP-button-purple">
                Robotic +
              </button>
              <button type="button" className="PP-button PP-button-purple">
                Music Composition +
              </button>
            </div>

            <div>
              <button type="button" className="PP-button PP-button-red">
                Chess +
              </button>
              <button type="button" className="PP-button PP-button-red">
                Go +
              </button>
              <button type="button" className="PP-button PP-button-red">
                Texas Hold 'em +
              </button>
              <button type="button" className="PP-button PP-button-red">
                Engineering +
              </button>
              <button type="button" className="PP-button PP-button-red">
                Mechanical Keyboard +
              </button>
            </div>

            <div>
              <button type="button" className="PP-button PP-button-orange">
                Guitar +
              </button>
              <button type="button" className="PP-button PP-button-orange">
                Piano +
              </button>
              <button type="button" className="PP-button PP-button-orange">
                Mathmatics +
              </button>
              <button type="button" className="PP-button PP-button-orange">
                Trumpt +
              </button>
              <button type="button" className="PP-button PP-button-orange">
                Jazz +
              </button>
            </div>

            <div>
              <button type="button" className="PP-button PP-button-yellow">
                Writing +
              </button>
              <button type="button" className="PP-button PP-button-yellow">
                Reading +
              </button>
              <button type="button" className="PP-button PP-button-yellow">
                Cuisine +
              </button>
              <button type="button" className="PP-button PP-button-yellow">
                Tennis +
              </button>
              <button type="button" className="PP-button PP-button-yellow">
                Basketball +
              </button>
            </div>
          </div>
        </div>

        {/* text 2 */}
        <p className="PP-text2">
          Feel free to type in other fields as you like.{" "}
        </p>

        <div className="PPWrapper2">
          <div className="row justify-content-between">
            <div className="col-auto">
              <div className="input-group">
                <button type="button" className="PP-addButton">
                  +
                </button>
                <input
                  type="text"
                  id="tags"
                  className="form-control"
                  aria-describedby="tagsHelpInline"
                />
              </div>
            </div>

            <div className="col-auto">
              <button
                type="button"
                className="PP-button PP-button-green shadow"
              >
                I am ready!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
