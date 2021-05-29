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
import {Label} from "semantic-ui-react";

class EmployeeHRDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole"),
        };
        switch (localStorage.getItem("page")) {
            case "detalii_contract": this.state = {render: <ViewContract/>}; break;
            default: this.state = {render: <EmployeeHRLandingPage/>};
        }
    }

    show = (type) =>{
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); localStorage.setItem("page", "detalii_contract"); break;
            case "fluturas_salariu": this.setState({render: <ViewPayslip/>}); break;
            case "vizualizare_pontaj": this.setState({render : <ViewTimesheet/>}); break;
            case "vizualizare_concedii" : this.setState({render: <ViewHoliday/>}); break;
            case "contracte_angajati" : this.setState({render: <ViewAllContracts/>}); break;
            case "pontaje_angajati" : this.setState({render: <ViewAllTimesheet/>}); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <EmployeeHRLandingPage/>}); localStorage.setItem("page", "")
        }
    }

    logout(){
        localStorage.clear();
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
