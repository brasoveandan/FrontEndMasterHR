import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import SidebarDashboard from "./SidebarDashboard";
import NotFoundPage from "../utils/NotFoundPage";
import LandingPage from "./LandingPage";

class GroupLeaderDashboard extends React.Component {

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
            case "detalii_contract": this.setState({render: <NotFoundPage/>}); break;
            case "vizualizare_pontaj": this.setState({render : <NotFoundPage/>}); break;
            case "fluturas_salariu": this.setState({render: <NotFoundPage />}); break;
            case "vizualizare_concedii" : this.setState({render: <NotFoundPage />}); break;
            case "vizualizare_cereri" : this.setState({render: <NotFoundPage />}); break;
            case "inregistrare_cerere" : this.setState({render: <NotFoundPage/>}); break;
            case "istoric_cereri" : this.setState({render: <NotFoundPage/>}); break;
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
        document.body.classList.add("background-group-leader-dashboard");
        return (
            <div className="background-dashboard">
                <Container fluid>
                    <Row>
                        <Col xs={3} id="sidebar-wrapper">
                            <SidebarDashboard show={this.show}/>
                        </Col>
                        <Col xs={9} id="page-content-wrapper">
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
