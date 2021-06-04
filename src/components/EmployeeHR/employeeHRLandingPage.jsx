import React from "react"
import LandingPage from "../../common/landingPage";

export default class EmployeeHRLandingPage extends LandingPage{

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
                        <br/>7. vizualizare contracte angajați
                        <br/>8. adăugare contract pentru un anumit angajat
                        <br/>9. editare contract pentru un anumit angajat
                        <br/>10. vizualizare pontaje angajați
                        <br/>11. confirmare pontaje angajați pentru o anumită lună
                    </p>
                )}
            </div>
        )
    }
}
