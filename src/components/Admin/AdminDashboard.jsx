import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import NotFoundPage from "../utils/NotFoundPage";
import SidebarDashboard from "../../common/SidebarDashboard";
import AdminLandingPage from "./AdminLandinPage";

class AdminDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        this.show = this.show.bind(this);
        this.state = {render: <AdminLandingPage/>}
    }

    show(type){
        switch(type){
            case "vizualizare_conturi": this.setState({render : <NotFoundPage/>}); break;
            case "adauga_cont": this.setState({render: <NotFoundPage/>}); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <AdminLandingPage/>})
        }
    }

    logout(){
        localStorage.clear();
        this.props.history.replace('/login');
    }

    render(){
        document.body.classList = "";
        document.body.classList.add("background-admin-dashboard");
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

const Dashboard = withRouter(AdminDashboard);
export default Dashboard
