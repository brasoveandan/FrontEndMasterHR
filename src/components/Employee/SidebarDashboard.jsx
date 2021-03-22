import React from 'react';

import logo from "../../img/logo/MasterHR-logos_transparent.png";
import {
    FaBars,
    FaFileInvoiceDollar,
    FaFolderPlus,
    FaHistory,
    FaIdCard,
    FaPlaneDeparture,
    FaSignOutAlt,
    FaUserClock
} from "react-icons/all";
import {Logo} from "react-sidebar-ui";
import {Link} from "react-router-dom";


export default class SidebarDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCollapsed: false,
            windowWidth: window.innerWidth
        };
        this.redirect = this.redirect.bind(this)
    }

    handleResize = (e) => {
        this.setState({ windowWidth: window.innerWidth });
    };

    componentDidMount() {
        window.addEventListener("resize", this.handleResize);
    }

    // eslint-disable-next-line react/no-typos
    componentWillUnMount() {
        window.addEventListener("resize", this.handleResize);
    }

    handleCollapse = () => {
        if (this.state.windowWidth < 768)
            this.setState({isCollapsed: !this.state.isCollapsed})
    }

    redirect = () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <div className="container-fluid" onClick={this.handleCollapse}>
                <div className="row">
                    <div className={this.state.isCollapsed ? 'active' : " col-md-3 float-left col-1 pl-0 pr-0 collapse width show"} id="sidebar">
                        <div className="list-group text-center text-md-left">
                            <div className="sidebar-button toggle-button list-group-item d-inline-block collapsed">
                                <FaBars className="mr-2"/>
                            </div>
                            <Link className={this.state.isCollapsed ? 'active' : "align-self-center"} id="logo-sidebar" onClick={() => this.props.show()}>
                                <Logo
                                    image={logo}
                                    imageName='logo'/>
                            </Link>
                            {/*<div className="align-self-center">*/}
                            {/*    <LogoText >{localStorage.getItem('name')}</LogoText>*/}
                            {/*</div>*/}
                            <br/>
                            <div className="sidebar-button list-group-item d-inline-block collapsed" onClick={() => this.props.show("detalii_contract")}>
                                <FaIdCard className="mr-2"/>
                                <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Detalii contract</span>
                            </div>
                            <div className="list-group-item d-inline-block collapsed" onClick={() => this.props.show("fluturas_salariu")}>
                                <FaFileInvoiceDollar className="mr-2"/>
                                <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Fluturaș salariu</span>
                            </div>
                            <div className="list-group-item d-inline-block collapsed" onClick={() => this.props.show("vizualizare_concedii")}>
                                <FaPlaneDeparture className="mr-2"/>
                                <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Vizualizare concedii</span>
                            </div>
                            <div className="list-group-item d-inline-block collapsed" onClick={() => this.props.show("vizualizare_pontaj")}>
                                <FaUserClock className="mr-2"/>
                                <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Vizualizare pontaj</span>
                            </div>
                            <div className="list-group-item d-inline-block collapsed" onClick={() => this.props.show("inregistrare_cerere")}>
                                <FaFolderPlus className="mr-2"/>
                                <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Înregistrare cerere</span>
                            </div>
                            <div className="list-group-item d-inline-block collapsed" onClick={() => this.props.show("istoric_cereri")}>
                                <FaHistory className="mr-2"/>
                                <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Istoric cereri</span>
                            </div>
                            <div className="sidebar-footer">
                                <div className="list-group-item collapsed" data-parent="#sidebar"  onClick={() => this.props.show("logout")}>
                                    <FaSignOutAlt className="mr-2"/>
                                    <span className={this.state.isCollapsed ? 'active' : "d-none d-md-inline"}>Deconectare</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
}
