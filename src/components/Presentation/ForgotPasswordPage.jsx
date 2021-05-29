import React from "react";
import {Button, Form, InputGroup, Modal} from "react-bootstrap";
import NavBar from "../utils/NavBar";
import {FaEnvelope} from "react-icons/all";

export default class ForgotPasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            showAlert: false,
            message: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
    }

    doSubmit = () => {
        fetch('http://localhost:8080/sendEmail', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
            body: this.state.email

        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    email: "",
                    showAlert: true,
                    message: "Vei primi un email la adresa introdusă cu link-ul pentru resetarea parolei! " +
                        "În caz ca nu primiți niciun email contactați-ne la adresa masterhr.contact@gmail.com"
                })
            }
            else if (res.status === 404) {
                this.setState({
                    showAlert: true,
                    message: "Nu există niciun utilizator cu email-ul introdus!"
                })
            }
            else {
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
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
                    <div className="d-flex justify-content-center align-items-center my-5">
                        <Modal show={this.state.showAlert} onHide={this.closeAlert} centered>
                            <Modal.Header className="font-weight-bold">
                                <Modal.Title>
                                    Schimbare parolă
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
                        <Form className="d-flex flex-column my-border-form border rounded border-secondary w-50" onSubmit={this.doSubmit}>
                            <h3 className="align-self-center text-white text-uppercase">Schimbare Parolă</h3>
                            <hr/>
                            <Form.Group>
                                <Form.Label className="my-label">E-mail</Form.Label>
                                <InputGroup className="mb-2" >
                                    <InputGroup.Text className="bg-white"><FaEnvelope/></InputGroup.Text>
                                    <Form.Control className="align-self-center bg-white" name="email" type="email" placeholder="E-mail" onChange={this.handleChange}/>
                                </InputGroup>
                            </Form.Group>
                            <Button className="align-self-center my-btn" type="button" onClick={this.doSubmit} onKeyPress={this.handleEnter}>
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
