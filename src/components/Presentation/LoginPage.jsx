import React from "react";
import {Button, Col, Form, FormControl, FormGroup, InputGroup} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import NavBar from "../utils/NavBar";
import {FaLock, FaUser} from "react-icons/all";

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        };
        this.handleChange = this.handleChange.bind(this);
        this.doSubmit = this.doSubmit.bind(this);
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
                        this.props.history.replace("/employeedashboard");
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

    render() {
        document.body.classList = "";
        document.body.classList.add("background-general");
        return (
            <React.Fragment>
                <NavBar/>
                <div className="align-content-center">
                    <div className="d-flex justify-content-center align-items-center" style={{ marginTop: "2%", marginBottom: "2%"}}>
                        <Form className="d-flex  flex-column my-border-form border rounded border-secondary" style={{width:"40%"}}>
                            <h2 className="align-self-center text-white text-uppercase">Autentificare</h2>
                            <hr/>

                            <Form.Group controlId="formUser">
                                <Form.Label className="my-label">
                                    Nume utilizator
                                </Form.Label>
                                <InputGroup className="mb-2">
                                    <InputGroup.Text className="bg-white"><FaUser/></InputGroup.Text>
                                    <Form.Control className="align-self-center bg-white" name="username" type="text" placeholder="Nume de utilizator" onChange={this.handleChange}/>
                                </InputGroup>
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label className="my-label">Parola</Form.Label>
                                <InputGroup>
                                    <InputGroup.Prepend>
                                        <InputGroup.Text className="bg-white"><FaLock/></InputGroup.Text>
                                    </InputGroup.Prepend>
                                    <Form.Control className="align-self-center bg-white" name="password" type="password" placeholder="Parola" onChange={this.handleChange}/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group controlId="formBasicCheckbox" className="align-self-center">
                                <Form.Check className="text-white" type="checkbox" label="Pastreaza datele" />
                            </Form.Group>
                            <Button className="align-self-center my-btn" onClick={this.doSubmit}>
                                Conectare
                            </Button>
                            <br/>
                            <Form.Group controlId="formForgotPassword" className="align-self-center">
                                <Form.Text>
                                    <NavLink className="nav-link my-label" to="/not-found">Ti-ai uitat parola?</NavLink>
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
