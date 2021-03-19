import React from "react";
import logo from "../../img/logo/MasterHR-logos_transparent.png";
import {Link} from "react-router-dom";

const NavBar = () => {
    return(
        <nav className="navbar navbar-expand-lg navbar-light">
            <a id="logo" className="navbar-brand" href="/">
                <img alt="Logo" src={logo}/>
            </a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"/>
            </button>

            <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                    <li className="nav-item active">
                        <Link className="nav-link btnnavbar" to="/">Acasa</Link>
                    </li>
                    <li className="nav-item active">
                        <a className="nav-link btnnavbar mr-4" href="/login">Conectare</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default NavBar;
