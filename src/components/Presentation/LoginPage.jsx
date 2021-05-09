import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import NavBar from "../utils/NavBar";
import {FaLock, FaUser} from "react-icons/all";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }

        this.handleChange = this.handleChange.bind(this);
    }

    doSubmit = (e) => {
        e.preventDefault()
        const payload = {
            username: this.state.username,
            password: this.state.password
        }
        fetch('http://localhost:8080/login', {
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
                        if (adminRole === "null")
                            this.props.history.replace("/employeedashboard");
                        else if (adminRole === "GROUP_LEADER")
                            this.props.history.replace("/groupleaderdashboard");
                        else if (adminRole === "HR_EMPLOYEE")
                            this.props.history.replace("/employeehrdashboard");
                        else if (adminRole === "HR_DEPARTMENT_RESPONSIVE")
                            this.props.history.replace("/responsivehrdashboard");
                        else if (adminRole === "ADMIN") {
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
                            <h3 className="align-self-center text-white text-uppercase">Autentificare</h3>
                            <hr/>
                            <Form.Group controlId="formUser">
                                <Form.Label className="my-label">Nume utilizator</Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text className="bg-white mt-3"><FaUser/></InputGroup.Text>
                                    <Form.Control className="align-self-center bg-white mt-3" name="username" type="text" placeholder="Nume de utilizator" onChange={this.handleChange}/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formPassword">
                                <Form.Label className="my-label">Parola</Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text className="bg-white mt-3"><FaLock/></InputGroup.Text>
                                    <Form.Control className="align-self-center bg-white mt-3" name="password" type="password" placeholder="Parola" onChange={this.handleChange}/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox" className="align-self-center">
                                <Form.Check className="text-white" type="checkbox" label="Pastreaza datele" />
                            </Form.Group>
                            <Button className="align-self-center my-btn" type="submit" onClick={this.doSubmit} onKeyPress={this.handleEnter}>
                                Autetintificare
                            </Button>
                            <br/>
                            <Form.Group controlId="formForgotPassword" className="align-self-center">
                                <Form.Text>
                                    <NavLink className="nav-link my-label" to="/forgot">Ti-ai uitat parola?</NavLink>
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default LoginPage;
