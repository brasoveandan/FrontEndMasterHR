import React from "react";
import backImage from "../../img/logo/MasterHR-logos_transparent.png"
import NavBar from "../../common/NavBar";
import {Card, CardImg} from "react-bootstrap";
import {Link} from "react-router-dom";

class HomePage extends React.Component{
    render() {
        document.body.classList = "";
        document.body.classList.add("background-home");
        return (
            <React.Fragment>
                <NavBar/>
                <Card className="bg-transparent border-0" style={{width: "100%",margin: "0 auto"}}>
                    <CardImg variant="bottom" className="card-image-home" alt="cardImage" style={{borderRadius: "5%"}} src={backImage} />
                    <Card.Footer className="bg-transparent align-self-center">
                        <h5 className="text-muted">
                            <Link to="/login" className="btn my-btn" style={{fontSize: "18px"}}>Conectare</Link>
                        </h5>
                    </Card.Footer>
                </Card>
            </React.Fragment>
        );
    }
}

export default HomePage;
