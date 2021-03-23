import React from "react"

export default class LandingPage extends React.Component{

    render(){
        return (
            <div className="d-flex justify-content-center mr-xl-5 pr-xl-5">
                <div className="card text-center w-75" style={{opacity: ".75", margin: "auto", float: "none", marginTop: "100px", marginBottom: "200px"}}>
                    <div className="card-header bg-dark my-label font-weight-bold">
                        <h4>Salutare, {localStorage.getItem("name")}!</h4>
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Bine ai revenit!</h5>
                        <p className="card-text">Navigând prin meniul din stânga vei putea efectua urmatoarele:
                            <br/>- poți vizualiza detaliile contractuale
                            <br/>- poți înregistra o cerere
                            <br/>- poți vizualiza istoricul cererilor
                            <br/>- poți vizualiza fluturașul de salariu
                            <br/>- poți vizualiza pontajul
                            <br/>- poți vizualiza concediile</p>
                    </div>
                </div>
                <br/>
            </div>
        )
    }
}
