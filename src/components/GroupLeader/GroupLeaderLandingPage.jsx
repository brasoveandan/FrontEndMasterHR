import React from "react"
import LandingPage from "../../common/LandingPage";


export default class GroupLeaderLandingPage extends LandingPage{

    render(){
        return (
            <div>
                {this.renderPage(
                    <p className="card-text">
                        Ca Group Leader vei putea efectua următoarele:
                        <br/>- poți vizualiza detaliile contractuale
                        <br/>- poți vizualiza cererile echipei tale
                        <br/>- poți înregistra o cerere
                        <br/>- poți vizualiza istoricul cererilor
                        <br/>- poți vizualiza fluturașul de salariu
                        <br/>- poți vizualiza pontajul
                        <br/>- poți adăuga pontajul pentru o zi de muncă
                        <br/>- poți vizualiza concediile
                    </p>
                )}
            </div>
        )
    }

}
