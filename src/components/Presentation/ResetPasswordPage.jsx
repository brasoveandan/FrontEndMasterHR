import React, {Component} from "react";
import NavBar from "../utils/NavBar";
import {Button, Form} from "react-bootstrap";

export default class ResetPasswordPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            password: "",
            password_confirm: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    doSubmit = (e) => {
        e.preventDefault()
        const payload = {
            token: this.state.token,
            password: this.state.password,
            password_confirm: this.state.password_confirm
        }
        fetch('http://localhost:8080/forgot', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.status === 200) {
                    localStorage.setItem('username', this.state.username)
                    res.json().then(json =>{
                        const { adminRole, name } = json
                        localStorage.setItem('adminRole', adminRole)
                        localStorage.setItem('name', name)
                        console.log(adminRole)
                        if (adminRole === "null")
                            this.props.history.replace("/employeedashboard");
                        else if (adminRole === "GROUP_LEADER")
                            this.props.history.replace("/groupleaderdashboard");
                        else if (adminRole === "HR_EMPLOYEE")
                            this.props.history.replace("/hremployeedashboard");
                        else if (adminRole === "HR_DEPARTMENT_RESPONSIVE")
                            this.props.history.replace("/hrresponsivedashboard");
                        else if (adminRole === "ADMIN") {
                            console.log("Da")
                            this.props.history.replace("/admindashboard");
                        }
                    });

                    // LOGIN PERSISTENCE
                }
                else if (res.status === 404) {
                    alert("Utilizatorul nu exista!")
                }
                else if (res.status === 401) {
                    alert("Parola gresita!")
                }
            })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleEnter = e => {
        if (e.keyCode === 13) {
            this.doSubmit(e);
        }
    };

    render() {
        document.body.classList = "";
        document.body.classList.add("background-general");
        return (
            <React.Fragment>
                <NavBar/>
                <div className="align-content-center">
                    <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "2%", marginBottom: "2%"}}>
                        <Form className="d-flex flex-column my-border-form border rounded border-secondary" onSubmit={this.doSubmit} style={{width:"40%"}}>
                            <h3 className="align-self-center text-white text-uppercase">Resetare Parola</h3>
                            <hr/>
                            <Form.Group controlId="formPassword">
                                <Form.Label className="my-label">Parola</Form.Label>
                                <Form.Control className="align-self-center bg-white" name="password" type="password" placeholder="Parola" onChange={this.handleChange}/>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label className="my-label">Confirmare Parola</Form.Label>
                                <Form.Control className="align-self-center bg-white" name="password_confirm" type="password" placeholder="Confirmare Parola" onChange={this.handleChange}/>
                            </Form.Group>
                            <Button className="align-self-center my-btn" type="submit" onClick={this.doSubmit} onKeyPress={this.handleEnter}>
                                Trimite
                            </Button>
                            <br/>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
