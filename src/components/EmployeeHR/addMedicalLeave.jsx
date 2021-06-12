import MyForm from "../../common/MyForm";
import * as Joi from "joi-browser";
import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import React from "react";

export default class AddMedicalLeave extends MyForm{
    constructor(props) {
        super(props);
        this.state = {
            data: {
                user: "",
                fromDate: "",
                toDate: ""
            },
            errors: {},
            showAlert: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    schema = {
        user: Joi.string().min(3).required().error(() => {return {message: "Numele de utilizator este prea scurt."}}),
        fromDate: Joi.date().iso().required().error(() => {return {message: "Data de început este obligatorie."}}),
        toDate: Joi.date().iso().required().error(() => {return {message: "Data de sfârșit este obligatorie."}}),
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
    }

    doSubmit = () => {
        console.log(this.state.data)
        fetch('http://localhost:8080/holiday', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(this.state.data)
        })
            .then(res => {
                if (res.ok) {
                    this.setState({
                        showAlert: true,
                        message: "Concediul medical a fost adăugat!"
                    })
                    this.state.data = {
                        user: "",
                        fromDate: "",
                        toDate: ""
                    };
                }
                else if(res.status === 417){
                    res.text().then(text =>{
                        this.setState({
                            showAlert: true,
                            message: text + " Concediul medical nu a fost salvat."
                        })
                    });
                }
                else if (res.status === 409)
                    this.setState({
                        showAlert: true,
                        message: "Există deja concediu medical cu datele intrduse pentru acest numar personal."
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
    }

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
                            <h4>Adăugare concediu medical</h4>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            {this.renderInput("form-control", "user", "Utilizator:", "Nume de utilizator", "text")}
                            {this.renderInput("form-control", "fromDate", "Din data", "data", "date")}
                            {this.renderInput("form-control", "toDate", "Pâna la data", "data", "date")}
                            <div className="text-center" onClick={(e) => this.handleSubmit("", e)}>
                                {this.renderButton("my-btn", "SALVEAZĂ", "button")}
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        )
    }
}
