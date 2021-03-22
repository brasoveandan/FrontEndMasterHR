import React from "react"


export default class LandingPage extends React.Component{

    render(){
        return (
            <div>
                <div className="card text-center w-75" style={{opacity: ".85", margin: "auto", float: "none", marginTop: "100px", marginBottom: "200px"}}>
                    <div className="card-header">
                        Salutare, {localStorage.getItem("name")}!
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Bine ai revenit!</h5>
                        <p className="card-text">Ca Group Leader vei putea efectua urmatoarele:
                            <br></br>- poți vizualiza detaliile contractuale
                            <br></br>- poți vizualiza cererile echipei tale
                            <br></br>- poți înregistra o cerere
                            <br></br>- poți vizualiza istoricul cererilor
                            <br></br>- poți vizualiza fluturașul de salariu
                            <br></br>- poți vizualiza pontajul
                            <br></br>- poți vizualiza concediile</p>
                    </div>
                </div>

                <br></br>
            </div>
        )
    }

}
