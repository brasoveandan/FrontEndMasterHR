import React from "react"
import LandingPage from "../../common/LandingPage";


export default class AdminLandingPage extends LandingPage{

    render(){
        return (
            <div>
                {this.renderPage(
                    <p className="card-text">
                        Ca administrator vei putea efectua urmatoarele:
                        <br/>- poți vizualiza toate conturile
                        <br/>- poți adăuga un cont nou
                    </p>
                )}
            </div>
        )
    }
}
