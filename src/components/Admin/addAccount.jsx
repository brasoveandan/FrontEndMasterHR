import React from "react";
import {Card, Container, Form} from "react-bootstrap";
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
                phoneNumber: "",
                socialSecurityNumber: "",
                birthday: "",
                gender: ""
            },
            errors: {},
        };

        this.handleChange = this.handleChange.bind(this);
    }

    schema = {
        username: Joi.string().min(5).required().error(() => {return {message: "Numele de utilizator este invalid."}}),
        password: Joi.string().min(8).required().error(() => {return {message: "Parola trebuie să conțină cel puțin 8 caractere."}}),
        personalNumber: Joi.string().min(6).required().error(() => {return {message: "Numărul personal nu poate fi vid și trebuie să conțină cel puțin 6 cifre."}}),
        firstName: Joi.string().required().error(() => {return {message: "Prenumele este obligatoriu."}}),
        lastName: Joi.string().required().error(() => {return {message: "Numele este obligatoriu."}}),
        adminRole: Joi.string().required().error(() => {return {message: "Trebuie setate permisiunile contului."}}),
        mail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['ro', 'com', 'net'] } }).min(13).required().error(() => {return {message: "E-mail invalid."}}),
        phoneNumber: Joi.string().length(10).regex(/^[0-9]+$/).required().error(() => {return {message: "Numărul de telefon este obligatoriu și trebuie să conțină 10 cifre."}}),
        socialSecurityNumber: Joi.string().length(13).regex(/^[0-9]+$/).error(() => {return {message: "Codul numeric personal este obligatoriu și trebuie să conțină 13 cifre."}}),
        birthday: Joi.string().optional().allow(""),
        gender: Joi.string().valid("Masculin", "Feminin").required().error(() => {return {message: "Genul trebuie sa fie Masculin sau Feminin."}})
    }

    doSubmit = () => {
        fetch('http://localhost:8080/employee', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify(this.state.data)
        })
            .then(res => {
                if (res.ok) {
                    alert("Cont adăugat cu succes!")
                    this.state.data = {
                        username: "",
                        password: "",
                        personalNumber: "",
                        adminRole: "",
                        firstName: "",
                        lastName: "",
                        mail: "",
                        phoneNumber: "",
                        socialSecurityNumber: "",
                        birthday: "",
                        gender: ""
                    };
                }
                else if(res.status === 417){
                    res.text().then(text =>{
                        console.log(text);
                    });
                }
                else if (res.status === 409)
                    alert("Exista deja un cont cu acest nume de utilizator.")
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
                <Card>
                    <Card.Header className="text-center bg-dark text-white text-monospace">
                        <Card.Title className="my-label">
                            <h4>Adăugare cont nou de utilizator</h4>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            {this.renderInput("form-control", "username", "Utilizator:", "Nume de utilizator", "text")}
                            {this.renderInput("form-control", "password", "Parola:", "Parola", "password")}
                            {this.renderInput("form-control", "personalNumber", "Număr personal:", "Număr personal", "text")}
                            {this.renderSelect("form-control", "adminRole", "Permisiune cont:", Array.of("DEFAULT", "ADMIN", "GROUP_LEADER", "HR_EMPLOYEE", "HR_DEPARTMENT_RESPONSIVE"), "text")}
                            {this.renderInput("form-control", "lastName", "Nume:", "Nume", "text")}
                            {this.renderInput("form-control", "firstName", "Prenume:", "Prenume", "text")}
                            {this.renderInput("form-control", "mail", "E-mail:", "E-mail", "mail")}
                            {this.renderInput("form-control", "phoneNumber", "Număr de telefon:", "Număr de telefon", "text")}
                            {this.renderInput("form-control", "socialSecurityNumber", "Cod numeric personal:", "Cod numeric personal", "text")}
                            {this.renderInput("form-control", "birthday", "Data nașterii:", "Data nașterii", "date")}
                            {this.renderInput("form-control", "gender", "Gen", "Gen", "text")}
                            <div className="text-center" onClick={this.handleSubmit}>
                                {this.renderButton("my-btn", "SALVEAZĂ", "button")}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
};
