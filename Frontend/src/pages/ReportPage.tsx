// report page and its styling
export default function ReportPage() {
  return (
    <div>
      <h1 className="text-center RP-title RP-text1">
        We are sorry that your expereince didn’t go as well as you expected,
        please report any inappropriate or miss-leading activity to make our
        Societas community better.
      </h1>

      <div
        className="row"
        style={{ marginLeft: "5%", marginRight: "15%", marginTop: "5em" }}
      >
        <div className="col-7 RP-text1" style={{ textAlign: "center" }}>
          User to Report:{" "}
        </div>
        <div
          className="col-5"
          style={{ paddingLeft: "2em", paddingRight: "0" }}
        >
          <input
            type="text"
            id="tags"
            className="RP-form-control"
            aria-describedby="tagsHelpInline"
            placeholder="User ID"
          />
        </div>
      </div>

      <div
        className="row"
        style={{ marginLeft: "5%", marginRight: "15%", marginTop: "5em" }}
      >
        <div className="col-7 RP-text1" style={{ textAlign: "center" }}>
          Project to report:{" "}
        </div>
        <div
          className="col-5"
          style={{ paddingLeft: "2em", paddingRight: "0" }}
        >
          <input
            type="text"
            id="tags"
            className="RP-form-control"
            aria-describedby="tagsHelpInline"
            placeholder="Project ID"
          />
        </div>
      </div>

      <div
        className="row"
        style={{ marginLeft: "5%", marginRight: "15%", marginTop: "5em" }}
      >
        <div className="col-7 RP-text1" style={{ textAlign: "center" }}>
          Comment on the offense:{" "}
        </div>
        <div
          className="col-5"
          style={{ paddingLeft: "2em", paddingRight: "0" }}
        >
          <input
            type="text"
            id="tags"
            className="RP-form-control"
            aria-describedby="tagsHelpInline"
            placeholder="Comments"
          />
        </div>
      </div>

      <div
        className="row"
        style={{
          justifyContent: "center",
          marginTop: "6em",
          marginBottom: "4em",
        }}
      >
        <button type="button" className="RP-button">
          Report
        </button>
      </div>
    </div>
  )
}
