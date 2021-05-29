import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import GroupLeaderLandingPage from "./GroupLeaderLandingPage";
import ViewContract from "../../common/ViewContract";
import SidebarDashboard from "../../common/SidebarDashboard";
import ViewPayslip from "../../common/ViewPayslip";
import ViewTimesheet from "../../common/ViewTimesheet";
import ViewHoliday from "../../common/ViewHoliday";
import ViewAllRequests from "./ViewAllRequests";

class GroupLeaderDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        this.state = {render: <GroupLeaderLandingPage/>}
    }

    show = (type) =>{
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); break;
            case "fluturas_salariu": this.setState({render: <ViewPayslip/>}); break;
            case "vizualizare_pontaj": this.setState({render : <ViewTimesheet/>}); break;
            case "vizualizare_concedii" : this.setState({render: <ViewHoliday/>}); break;
            case "cereri_angajati" : this.setState({render: <ViewAllRequests/>}); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <GroupLeaderLandingPage/>})
        }
    }

    logout(){
        localStorage.clear();
        this.props.history.replace('/login');
    }

    render(){
        document.body.classList = "";
        document.body.classList.add("background-group-leader-dashboard");
        return (
            <div className="background-dashboard">
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
            </div>
        );
    }
}

const Dashboard = withRouter(GroupLeaderDashboard);
export default Dashboard
