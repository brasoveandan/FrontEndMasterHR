import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import {withRouter} from "react-router-dom";
import SidebarDashboard from "../../common/sidebarDashboard";
import AdminLandingPage from "./adminLandingPage";
import ViewAccounts from "./viewAccounts";
import AddAccount from "./addAccount";

class AdminDashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            name: localStorage.getItem("username"),
            adminRole: localStorage.getItem("adminRole")
        };
        switch (sessionStorage.getItem("page")) {
            case "vizualizare_conturi": this.state = {render: <ViewAccounts/>}; break;
            case "adauga_cont": this.state = ({render: <AddAccount/>});break;
            default: this.state = {render: <AdminLandingPage/>};
        }
    }

    show = (type) =>{
        switch(type){
            case "vizualizare_conturi": this.setState({render : <ViewAccounts/>}); sessionStorage.setItem("page", "vizualizare_conturi"); break;
            case "adauga_cont": this.setState({render: <AddAccount/>}); sessionStorage.setItem("page", "adauga_cont"); break;
            case "logout": this.logout(); break;
            default: this.setState({render: <AdminLandingPage/>}); sessionStorage.setItem("page", "")
        }
    }

    logout(){
        sessionStorage.clear();
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