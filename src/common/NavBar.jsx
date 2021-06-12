import React from "react";
import logo from "../img/logo/MasterHR.png";
import {Link} from "react-router-dom";
import {Button, Nav} from "react-bootstrap";

const NavBar = () => {
    return(
        <Nav className="navbar navbar-expand-lg navbar-light">
            <a id="logo" className="navbar-brand" href="/">
                <img alt="Logo" src={logo}/>
            </a>
            <Button className="navbar-toggler bg-white" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </Button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link btnnavbar" to="/">Acasa</Link>
                    </li>
                    <li className="nav-item active">
                        <Link className="nav-link btnnavbar mr-4" to="/login">Conectare</Link>
                    </li>
                </ul>
            </div>
        </Nav>
    )
}

export default NavBar;
