import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import LandingPage from "./employeeLandingPage";
import ViewContract from "../../common/viewContract";
import SidebarDashboard from "../../common/sidebarDashboard";
import ViewPayslip from "../../common/viewPayslip";
import ViewTimesheet from "../../common/viewTimesheet";
import ViewHoliday from "../../common/viewHoliday";
import EmployeeLandingPage from "./employeeLandingPage";

class EmployeeDashboard extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        this.show = this.show.bind(this);
        switch (sessionStorage.getItem("page")) {
            case "detalii_contract": this.state = {render: <ViewContract/>}; break;
            case "fluturas_salariu": this.state = ({render: <ViewPayslip/>});break;
            case "vizualizare_pontaj": this.state = ({render : <ViewTimesheet/>});break;
            case "vizualizare_concedii" : this.state = ({render: <ViewHoliday/>});break;
            default: this.state = {render: <EmployeeLandingPage/>};
        }
    }

    show(type){
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); sessionStorage.setItem("page", "detalii_contract"); break;
            case "fluturas_salariu": this.setState({render: <ViewPayslip/>}); sessionStorage.setItem("page", "fluturas_salariu");break;
            case "vizualizare_pontaj": this.setState({render : <ViewTimesheet/>}); sessionStorage.setItem("page", "vizualizare_pontaj");break;
            case "vizualizare_concedii" : this.setState({render: <ViewHoliday/>}); sessionStorage.setItem("page", "vizualizare_concedii");break;
            case "logout": this.logout(); break;
            default: this.setState({render: <LandingPage/>})
        }
    }

    logout(){
        sessionStorage.clear();
        this.props.history.replace('/login');
    }

    render(){
        document.body.classList = "";
        document.body.classList.add("background-employee-dashboard");
        return (
                <Container fluid>
                    <Row>
                        <Col xs={3} sm={12} md={3}  id="sidebar-wrapper">
                            <SidebarDashboard show={this.show}/>
                        </Col>
                        <Col xs={9}  sm={12} md={9} xl={8} id="page-content-wrapper">
                            { this.state.render }
                        </Col>
                    </Row>

                </Container>
        );
    }
}

const Dashboard = withRouter(EmployeeDashboard);
export default Dashboard
