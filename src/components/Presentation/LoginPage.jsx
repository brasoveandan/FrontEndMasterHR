import React from "react";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import NavBar from "../utils/NavBar";
import {FaLock, FaUser} from "react-icons/all";

export default class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            showAlert: false,
            message: ""
        }

        this.handleChange = this.handleChange.bind(this);
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
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
                sessionStorage.setItem('username', this.state.username)
                res.json().then(json =>{
                    const { adminRole, name, jwt } = json
                    sessionStorage.setItem('adminRole', adminRole)
                    sessionStorage.setItem('name', name)
                    sessionStorage.setItem('jwt', jwt)
                    sessionStorage.setItem("page", "")
                    if (adminRole === "DEFAULT")
                        this.props.history.replace("/employeedashboard");
                    else if (adminRole === "GROUP_LEADER")
                        this.props.history.replace("/groupleaderdashboard");
                    else if (adminRole === "HR_EMPLOYEE")
                        this.props.history.replace("/employeehrdashboard");
                    else if (adminRole === "ADMIN") {
                        this.props.history.replace("/admindashboard");
                    }
                });
            }
            else if (res.status === 403)
                this.setState({
                    showAlert: true,
                    message: "Utilizatorul nu există!"
                })
            else if (res.status === 401)
                this.setState({
                    showAlert: true,
                    message: "Numele de utilizator sau parola sunt incorecte! Reîncercați!"
                })
            else
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
        })
            .catch(error =>
                this.setState({
                showAlert: true,
                message: "A apărut o eroare."
            }))
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
                <Modal show={this.state.showAlert} onHide={this.closeAlert} centered>
                    <Modal.Header className="font-weight-bold">
                        <Modal.Title>
                            Autentificare eșuată
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.message}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.closeAlert}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <div className="align-content-center">
                    <div className="d-flex justify-content-center align-items-center my-4">
                        <Form className="d-flex flex-column my-border-form border rounded border-secondary w-50" onSubmit={this.doSubmit}>
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
                            <Button className="align-self-center my-btn" type="submit" onClick={this.doSubmit} onKeyPress={this.handleEnter}>
                                Autetintificare
                            </Button>
                            <br/>
                            <Form.Group controlId="formForgotPassword" className="align-self-center">
                                <Form.Text>
                                    <NavLink className="nav-link my-label" to="/forgot_password">Ti-ai uitat parola?</NavLink>
                                </Form.Text>
                            </Form.Group>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
