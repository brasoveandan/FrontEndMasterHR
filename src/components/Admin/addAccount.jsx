import React from "react";
import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import MyForm from "../utils/MyForm";
import * as Joi from "joi-browser";

export default class AddAccount extends MyForm{
    constructor(props) {
        super(props);
        this.state = {
            data: {
                username: "",
                password: "",
                personalNumber: "",
                adminRole: "",
                firstName: "",
                lastName: "",
                mail: "",
            },
            errors: {},
            showAlert: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    schema = {
        username: Joi.string().min(3).required().error(() => {return {message: "Numele de utilizator este prea scurt."}}),
        password: Joi.string().min(8).required().error(() => {return {message: "Parola trebuie să conțină cel puțin 8 caractere."}}),
        personalNumber: Joi.string().min(6).required().error(() => {return {message: "Numărul personal nu poate fi vid și trebuie să conțină cel puțin 6 cifre."}}),
        firstName: Joi.string().required().error(() => {return {message: "Prenumele este obligatoriu."}}),
        lastName: Joi.string().required().error(() => {return {message: "Numele este obligatoriu."}}),
        adminRole: Joi.string().required().error(() => {return {message: "Trebuie setate permisiunile contului."}}),
        mail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['ro', 'com', 'net'] } }).min(13).required().error(() => {return {message: "E-mail invalid."}}),
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
    }

    doSubmit = () => {
        fetch('http://localhost:8080/employee', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify(this.state.data)
        })
        .then(res => {
            if (res.ok) {
                this.setState({
                    showAlert: true,
                    message: "Contul a fost adăugat!"
                })
                this.state.data = {
                    username: "",
                    password: "",
                    personalNumber: "",
                    adminRole: "",
                    firstName: "",
                    lastName: "",
                    mail: "",
                };
            }
            else if(res.status === 417){
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Contul nu a fost salvat."
                    })
                });
            }
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Există deja un cont cu acest nume de utilizator."
                })
            else
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        return (
            <Container fluid className="mt-5 mb-5">
                <Modal show={this.state.showAlert} onHide={this.closeAlert} centered>
                    <Modal.Header className="font-weight-bold">
                        <Modal.Title>
                            Notificare
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
                <Card>
                    <Card.Header className="text-center bg-dark text-white text-monospace">
                        <Card.Title className="my-label">
                            <h4>Adăugare cont nou de utilizator</h4>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            {this.renderInput("form-control", "username", "Utilizator:", "Nume de utilizator", "text")}
                            {this.renderInput("form-control", "password", "Parola:", "Parola", "text")}
                            {this.renderSelect("form-control", "adminRole", "Permisiune cont:", Array.of("DEFAULT", "ADMIN", "GROUP_LEADER", "HR_EMPLOYEE", "HR_DEPARTMENT_RESPONSIVE"), "text")}
                            {this.renderInput("form-control", "personalNumber", "Număr personal:", "Număr personal", "text")}
                            {this.renderInput("form-control", "lastName", "Nume:", "Nume", "text")}
                            {this.renderInput("form-control", "firstName", "Prenume:", "Prenume", "text")}
                            {this.renderInput("form-control", "mail", "E-mail:", "E-mail", "mail")}
                            <div className="text-center" onClick={(e) => this.handleSubmit("", e)}>
                                {this.renderButton("my-btn", "SALVEAZĂ", "button")}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
};
