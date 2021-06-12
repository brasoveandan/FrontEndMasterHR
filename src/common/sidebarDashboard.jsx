import React from 'react';

import logo from "../img/logo/MasterHR.png";
import {Logo} from "react-sidebar-ui";
import SidebarButton from "./sidebarButton";
import {Container, Row} from "react-bootstrap";



export default class SidebarDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            adminRole: sessionStorage.getItem("adminRole"),
            isCollapsed: false,
            windowWidth: window.innerWidth
        };
        this.redirect = this.redirect.bind(this)
        this.show = this.show.bind(this);
    }

    show(type){
        switch(type){
            case "detalii_contract": this.props.show("detalii_contract"); break;
            case "fluturas_salariu": this.props.show("fluturas_salariu"); break;
            case "vizualizare_pontaj": this.props.show("vizualizare_pontaj"); break;
            case "vizualizare_concedii" : this.props.show("vizualizare_concedii"); break;
            case "vizualizare_cereri" : this.props.show("vizualizare_cereri"); break;
            case "vizualizare_conturi" : this.props.show("vizualizare_conturi"); break;
            case "adauga_cont" : this.props.show("adauga_cont"); break;
            case "cereri_angajati" : this.props.show("cereri_angajati"); break;
            case "contracte_angajati" : this.props.show("contracte_angajati"); break;
            case "pontaje_angajati" : this.props.show("pontaje_angajati"); break;
            case "adaugare_concediu_medical" : this.props.show("adaugare_concediu_medical"); break;
            case "logout": this.props.show("logout"); break;
            default: this.props.show();
        }
    }

    handleResize = () => {
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

    renderLogo(){
        return(
            <div className={this.state.isCollapsed ? 'active' : "align-self-center"} id="logo-sidebar" onClick={() => this.props.show()}>
                <Logo
                    image={logo}
                    imageName='logo'/>
            </div>
        )
    }

    renderAdminSidebar() {
        return (
            <Container fluid onClick={this.handleCollapse}>
                <Row>
                    <div className={this.state.isCollapsed ? 'active' : "col-md-2 col-xl-1 float-left col-1 pl-0 pr-0 collapse width show"} id="sidebar">
                        <div className="list-group text-center text-md-left">
                            <SidebarButton className="toggle-button" isCollapsed={this.state.isCollapsed} btnText="" />
                            {this.renderLogo()}
                            <br/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare conturi" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Adaugă cont" show = {this.show}/>
                            <div className="sidebar-footer">
                                <SidebarButton className="list-group-item collapsed" isCollapsed={this.state.isCollapsed} btnText="Deconectare" show = {this.show}/>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        )
    }

    renderEmployeeSidebar(){
        return (
            <Container fluid onClick={this.handleCollapse}>
                <Row>
                    <div className={this.state.isCollapsed ? 'active' : "col-md-2 col-xl-1 float-left col-1 pl-0 pr-0 collapse width show"} id="sidebar">
                        <div className="list-group text-center text-md-left">
                            <SidebarButton className="toggle-button" isCollapsed={this.state.isCollapsed} btnText="" show = {this.show}/>
                            {this.renderLogo()}
                            <br/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Detalii contract" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Fluturaș salariu" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare pontaj" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare concedii" show = {this.show}/>
                            <div className="sidebar-footer">
                                <SidebarButton className="list-group-item collapsed" isCollapsed={this.state.isCollapsed} btnText="Deconectare" show = {this.show}/>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        )
    }

    renderGroupLeaderSidebar() {
        return (
            <Container fluid onClick={this.handleCollapse}>
                <Row>
                    <div className={this.state.isCollapsed ? 'active' : " col-md-2 col-xl-1 float-left col-1 pl-0 pr-0 collapse width show"} id="sidebar">
                        <div className="list-group text-center text-md-left">
                            <SidebarButton className="toggle-button" isCollapsed={this.state.isCollapsed} btnText=""/>
                            {this.renderLogo()}
                            <br/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Detalii contract" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Fluturaș salariu" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare pontaj" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare concedii" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Cereri angajați" show = {this.show}/>
                            <div className="sidebar-footer">
                                <SidebarButton className="list-group-item collapsed" isCollapsed={this.state.isCollapsed} btnText="Deconectare" show = {this.show}/>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        )
    }

    renderEmployeeHRSidebar(){
        return (
            <Container fluid onClick={this.handleCollapse}>
                <Row>
                    <div className={this.state.isCollapsed ? 'active' : " col-md-2 col-xl-1 float-left col-1 pl-0 pr-0 collapse width show"} id="sidebar">
                        <div className="list-group text-center text-md-left">
                            <SidebarButton className="toggle-button" isCollapsed={this.state.isCollapsed} btnText=""/>
                            {this.renderLogo()}
                            <br/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Detalii contract" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Fluturaș salariu" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare pontaj" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Vizualizare concedii" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Contracte Angajați" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Pontaje Angajați" show = {this.show}/>
                            <SidebarButton isCollapsed={this.state.isCollapsed} btnText="Concediu medical" show = {this.show}/>
                            <div className="sidebar-footer">
                                <SidebarButton className="list-group-item collapsed" isCollapsed={this.state.isCollapsed} btnText="Deconectare" show = {this.show}/>
                            </div>
                        </div>
                    </div>
                </Row>
            </Container>
        )
    }

    render() {
        if (this.state.adminRole === "DEFAULT") {
            return (
                this.renderEmployeeSidebar()
            )
        }
        else if (this.state.adminRole === "ADMIN") {
            return (
                this.renderAdminSidebar()
            )
        }
        else if (this.state.adminRole === "GROUP_LEADER") {
            return (
                this.renderGroupLeaderSidebar()
            )
        }
        else if (this.state.adminRole === "HR_EMPLOYEE") {
            return (
                this.renderEmployeeHRSidebar()
            )
        }
    }
}
