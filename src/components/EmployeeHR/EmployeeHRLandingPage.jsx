import React from "react"
import LandingPage from "../../common/LandingPage";

export default class EmployeeHRLandingPage extends LandingPage{

    render(){
        return (
            <div>
                {this.renderPage(
                    <p className="card-text">
                        Navigând prin meniul din stânga vei putea efectua următoarele:
                        <br/>- poți vizualiza detaliile contractuale
                        <br/>- poți înregistra o cerere
                        <br/>- poți vizualiza istoricul cererilor
                        <br/>- poți vizualiza fluturașul de salariu
                        <br/>- poți vizualiza pontajul
                        <br/>- poți adăuga pontajul pentru o zi de muncă
                        <br/>- poți vizualiza concediile
                        <br/>- poți edita datele unui angajat
                        <br/>- poți închide luna pentru un anumit angajat
                        <br/>- poți calcula salariul pentru un anumit angajat
                    </p>
                )}
            </div>
        )
    }
}
