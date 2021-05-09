import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import LandingPage from "./EmployeeLandingPage";
import ViewContract from "../../common/ViewContract";
import SidebarDashboard from "../../common/SidebarDashboard";
import ViewPayslip from "../../common/ViewPayslip";
import ViewTimesheet from "../../common/ViewTimesheet";
import ViewHoliday from "../../common/ViewHoliday";

class EmployeeDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        this.show = this.show.bind(this);
        this.state = {render: <LandingPage/>}
    }

    show(type){
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); break;
            case "vizualizare_pontaj": this.setState({render : <ViewTimesheet/>}); break;
            case "fluturas_salariu": this.setState({render: <ViewPayslip/>}); break;
            case "vizualizare_concedii" : this.setState({render: <ViewHoliday/>}); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <LandingPage/>})
        }
    }

    logout(){
        localStorage.clear();
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
