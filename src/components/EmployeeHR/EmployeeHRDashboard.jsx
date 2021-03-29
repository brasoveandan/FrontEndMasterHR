import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import NotFoundPage from "../utils/NotFoundPage";
import ViewContract from "../../common/ViewContract";
import SidebarDashboard from "../../common/SidebarDashboard";
import EmployeeHRLandingPage from "./EmployeeHRLandingPage";

class EmployeeHRDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        this.show = this.show.bind(this);
        this.state = {render: <EmployeeHRLandingPage/>}
    }

    show(type){
        switch(type){
            case "detalii_contract": this.setState({render: <ViewContract/>}); break;
            case "vizualizare_pontaj": this.setState({render : <NotFoundPage/>}); break;
            case "fluturas_salariu": this.setState({render: <NotFoundPage />}); break;
            case "vizualizare_concedii" : this.setState({render: <NotFoundPage />}); break;
            case "inregistrare_cerere" : this.setState({render: <NotFoundPage/>}); break;
            case "istoric_cereri" : this.setState({render: <NotFoundPage/>}); break;
            case "editare_conturi" : this.setState({render: <NotFoundPage/>}); break;
            case "inchidere_luna" : this.setState({render: <NotFoundPage/>}); break;
            case "calcul_salar" : this.setState({render: <NotFoundPage/>}); break;
            case "adauga_pontaj" : this.setState({render: <NotFoundPage/>}); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <EmployeeHRLandingPage/>})
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
