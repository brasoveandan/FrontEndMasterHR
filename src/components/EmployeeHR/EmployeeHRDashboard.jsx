import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import ViewContract from "../../common/ViewContract";
import SidebarDashboard from "../../common/SidebarDashboard";
import EmployeeHRLandingPage from "./EmployeeHRLandingPage";
import ViewPayslip from "../../common/ViewPayslip";
import ViewTimesheet from "../../common/ViewTimesheet";
import ViewHoliday from "../../common/ViewHoliday";
import ViewAllContracts from "./ViewAllContracts";
import ViewAllTimesheet from "./ViewAllTimesheet";

class EmployeeHRDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: sessionStorage.getItem("username"),
            adminRole: sessionStorage.getItem("adminRole"),
        };
        switch (sessionStorage.getItem("page")) {
            case "detalii_contract": this.state = {render: <ViewContract/>}; break;
            case "fluturas_salariu": this.state({render: <ViewPayslip/>});break;
            case "vizualizare_pontaj": this.state({render : <ViewTimesheet/>});break;
            case "vizualizare_concedii" : this.state({render: <ViewHoliday/>});break;
            case "contracte_angajati" : this.state({render: <ViewAllContracts/>});break;
            case "pontaje_angajati" : this.state({render: <ViewAllTimesheet/>});break;
            default: this.state = {render: <EmployeeHRLandingPage/>};
        }
    }

    show = (type) =>{
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); sessionStorage.setItem("page", "detalii_contract"); break;
            case "fluturas_salariu": this.setState({render: <ViewPayslip/>}); sessionStorage.setItem("page", "fluturas_salariu");break;
            case "vizualizare_pontaj": this.setState({render : <ViewTimesheet/>}); sessionStorage.setItem("page", "vizualizare_pontaj");break;
            case "vizualizare_concedii" : this.setState({render: <ViewHoliday/>}); sessionStorage.setItem("page", "vizualizare_concedii");break;
            case "contracte_angajati" : this.setState({render: <ViewAllContracts/>}); sessionStorage.setItem("page", "contracte_angajati");break;
            case "pontaje_angajati" : this.setState({render: <ViewAllTimesheet/>}); sessionStorage.setItem("page", "pontaje_angajati");break;
            case "logout": this.logout(); break;
            default: this.setState({render: <EmployeeHRLandingPage/>}); sessionStorage.setItem("page", "")
        }
    }

    logout(){
        sessionStorage.clear();
        this.props.history.replace('/login');
    }

    render(){
        document.body.classList = "";
        document.body.classList.add("background-employee-hr-dashboard");
        return (
            <Container fluid>
                <Row>
                    <Col className="col-sm-12 col-md-3" xs={3} id="sidebar-wrapper">
                        <SidebarDashboard show={this.show}/>
                    </Col>
                    <Col className="col-sm-12 col-md-9 col-xl-8" xs={9} id="page-content-wrapper">
                        { this.state.render }
                    </Col>
                </Row>

            </Container>
        );
    }
}

const Dashboard = withRouter(EmployeeHRDashboard );
export default Dashboard
