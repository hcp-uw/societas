export default function PreferencePage() {
    return (
        <div>  
            <h1 class="text-center PP-title">Welcome to Societas</h1>

            {/* text1  & tags */}
            <div class="PPwrapper" >
                <p class="PP-text1">Please check the boxes you are interested. </p>
                {/* buttons */}
                <div style={{marginTop: "2em", marginLeft: "1em"}} class="col align-self-center">
                    <div class="PPbutton-container col ">
                        <div class="align-contents-center">
                            <button type="button" class="PP-button PP-button-purple">Coding +</button>
                            <button type="button" class="PP-button PP-button-purple">Front End +</button>
                            <button type="button" class="PP-button PP-button-purple">Back End +</button>
                            <button type="button" class="PP-button PP-button-purple">Robotic +</button>
                            <button type="button" class="PP-button PP-button-purple">Music Composition +</button>
                        </div>

                        <div>
                            <button type="button" class="PP-button PP-button-red">Chess +</button>
                            <button type="button" class="PP-button PP-button-red">Go +</button>
                            <button type="button" class="PP-button PP-button-red">Texas Hold 'em +</button>
                            <button type="button" class="PP-button PP-button-red">Engineering +</button>
                            <button type="button" class="PP-button PP-button-red">Mechanical Keyboard +</button>
                        </div>

                        <div>
                            <button type="button" class="PP-button PP-button-orange">Guitar +</button>
                            <button type="button" class="PP-button PP-button-orange">Piano +</button>
                            <button type="button" class="PP-button PP-button-orange">Mathmatics +</button>
                            <button type="button" class="PP-button PP-button-orange">Trumpt +</button>
                            <button type="button" class="PP-button PP-button-orange">Jazz +</button>
                        </div>

                        <div>
                            <button type="button" class="PP-button PP-button-yellow">Writing +</button>
                            <button type="button" class="PP-button PP-button-yellow">Reading +</button>
                            <button type="button" class="PP-button PP-button-yellow">Cuisine +</button>
                            <button type="button" class="PP-button PP-button-yellow">Tennis +</button>
                            <button type="button" class="PP-button PP-button-yellow">Basketball +</button>
                        </div>            
                    </div>
                </div>
                
                {/* text 2 */}
                <p class="PP-text2">Feel free to type in other fields as you like. </p>

                <div class="PPWrapper2">
                    <div class="row justify-content-between">
                        <div class="col-auto">
                            <div class="input-group">
                                <button type="button" class="PP-addButton">+</button>
                                <input type="text" id="tags" class="form-control" aria-describedby="tagsHelpInline"/>
                            </div>
                        </div>

                        <div class="col-auto">
                            <button type="button" class="PP-button PP-button-green shadow">I am ready!</button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    )

}