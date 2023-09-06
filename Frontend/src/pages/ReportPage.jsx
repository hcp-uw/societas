export default function ReportPage() {
    return (
        <div>  
            <h1 class="text-center RP-title RP-text1">We are sorry that your expereince didn’t go as well as you expected, please report
                any inappropriate or miss-leading activity to make our Societas community better.</h1>
            
            <div class="row" style={{marginLeft: "5%", marginRight: "15%", marginTop: "5em"}}>
                <div class="col-7 RP-text1" style={{textAlign: "center"}}>User to Report: </div>
                <div class="col-5" style={{paddingLeft: "2em", paddingRight: "0"}}>
                    <input type="text" id="tags" class="RP-form-control" aria-describedby="tagsHelpInline" placeholder="User ID"/>
                </div>
            </div>

            <div class="row" style={{marginLeft: "5%", marginRight: "15%", marginTop: "5em"}}>
                <div class="col-7 RP-text1" style={{textAlign: "center"}}>Project to report: </div>
                <div class="col-5" style={{paddingLeft: "2em", paddingRight: "0"}}>
                    <input type="text" id="tags" class="RP-form-control" aria-describedby="tagsHelpInline" placeholder="Project ID"/>
                </div>
            </div>

            <div class="row" style={{marginLeft: "5%", marginRight: "15%", marginTop: "5em"}}>
                <div class="col-7 RP-text1" style={{textAlign: "center"}}>Comment on the offense: </div>
                <div class="col-5" style={{paddingLeft: "2em", paddingRight: "0"}}>
                    <input type="text" id="tags" class="RP-form-control" aria-describedby="tagsHelpInline" placeholder="Comments"/>
                </div>
            </div>

            <div class="row" style={{justifyContent: "center", marginTop: "6em", marginBottom: "4em"}}>
                <button type="button" class="RP-button">Report</button>
            </div>

        </div>
    )

}