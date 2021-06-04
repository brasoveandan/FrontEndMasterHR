import React from "react"
import LandingPage from "../../common/landingPage";


export default class AdminLandingPage extends LandingPage{

    render(){
        return (
            <div>
                {this.renderPage(
                    <p>
                        Aveți următoarele acțiuni la dispoziție:
                        <br/>1. vizualizare conturi
                        <br/>2. adăugare cont nou
                        <br/>3. editare cont
                        <br/>4. ștergere cont
                    </p>
                )}
            </div>
        )
    }
}
