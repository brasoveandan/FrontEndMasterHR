import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import GroupLeaderLandingPage from "./groupLeaderLandingPage";
import ViewContract from "../../common/viewContract";
import SidebarDashboard from "../../common/sidebarDashboard";
import ViewPayslip from "../../common/viewPayslip";
import ViewTimesheet from "../../common/viewTimesheet";
import ViewHoliday from "../../common/viewHoliday";
import ViewAllRequests from "./viewAllRequests";

class GroupLeaderDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        switch (sessionStorage.getItem("page")) {
            case "detalii_contract": this.state = {render: <ViewContract/>}; break;
            case "fluturas_salariu": this.state = ({render: <ViewPayslip/>});break;
            case "vizualizare_pontaj": this.state = ({render : <ViewTimesheet/>});break;
            case "vizualizare_concedii" : this.state = ({render: <ViewHoliday/>});break;
            case "cereri_angajati" : this.state = ({render: <ViewAllRequests/>});break;
            default: this.state = {render: <GroupLeaderLandingPage/>};
        }
    }

    show = (type) =>{
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); sessionStorage.setItem("page", "detalii_contract"); break;
            case "fluturas_salariu": this.setState({render: <ViewPayslip/>}); sessionStorage.setItem("page", "fluturas_salariu");break;
            case "vizualizare_pontaj": this.setState({render : <ViewTimesheet/>}); sessionStorage.setItem("page", "vizualizare_pontaj");break;
            case "vizualizare_concedii" : this.setState({render: <ViewHoliday/>}); sessionStorage.setItem("page", "vizualizare_concedii");break;
            case "cereri_angajati" : this.setState({render: <ViewAllRequests/>}); sessionStorage.setItem("page", "cereri_angajati"); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <GroupLeaderLandingPage/>})
        }
    }

    logout(){
        sessionStorage.clear();
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
