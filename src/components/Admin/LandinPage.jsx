import React from "react"


export default class LandingPage extends React.Component{

    render(){
        return (
            <div>
                <div className="card text-center w-75" style={{opacity: ".75", margin: "auto", float: "none", marginTop: "100px", marginBottom: "200px"}}>
                    <div className="card-header">
                        Salutare, {localStorage.getItem("name")}!
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Bine ai revenit!</h5>
                        <p className="card-text">Ca administrator vei putea efectua urmatoarele:
                            <br></br>- poți vizualiza toate conturile
                            <br></br>- poți adauga un cont nou</p>
                    </div>
                </div>

                <br></br>
            </div>
        )
    }

}
