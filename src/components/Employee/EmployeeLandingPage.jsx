import React from "react"
import LandingPage from "../../common/LandingPage";

export default class EmployeeLandingPage extends LandingPage{

    render(){
        return (
            <div>
                {this.renderPage(
                    <p>
                        Aveți următoarele acțiuni la dispoziție:
                        <br/>1. vizualizare detalii contractuale
                        <br/>2. vizualizare fluturaș de salariu
                        <br/>3. vizualizare pontaj
                        <br/>4. adăugare pontaj manual/automat
                        <br/>5. vizualizare cereri de concediu
                        <br/>6. înregistrare cerere de concediu
                    </p>
                )}
            </div>
        )
    }
}
