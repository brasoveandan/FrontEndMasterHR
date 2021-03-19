import React from "react";
import backImage from "../../img/logo/MasterHR-logos_transparent.png"
import NavBar from "../utils/NavBar";

class HomePage extends React.Component{
    render() {
        document.body.classList = "";
        document.body.classList.add("background-home");
        return (
            <React.Fragment>
                <NavBar/>
                <div className="card bg-transparent border-0" style={{width: "100%",margin: "0 auto"}}>
                    <img className="card-img-bottom card-image-home" alt="cardImage" style={{borderRadius: "5%"}} src={backImage} />
                    <div className="card-footer bg-transparent align-self-center">
                        <h5 className="text-muted">
                            <a href="/login" className="btn my-btn" style={{fontSize: "18px"}}>Conectare</a>
                        </h5>
                    </div>
                </div>
            </React.Fragment>
        );
    }
};

export default HomePage;
