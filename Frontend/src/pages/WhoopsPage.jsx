export default function WhoopsPage() {
    return (
        <div>  
            <h1 class="text-center WP-title">Whoops!</h1>

            {/* text */}
            <div class="row justify-content-center WP-wrapper">
                <div class="text-wrap" style={{width: "50%", textAlign: "center"}}>
                    <p class="WP-text1">This post is already posted, you can't post redundant project.</p>
                    <p class="WP-text1">You can contact us through xxxxx@gmail.com </p>
                    <p class="WP-text1">Thank you for your understanding. </p>              
                </div>                  
            </div>

            {/* button */}
            <div class="WP-button-container row justify-content-center">
                <button type="button" class="WP-button">Ok</button>
            </div>

        </div>
    )

}