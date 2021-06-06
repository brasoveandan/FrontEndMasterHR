import React, {Component} from "react";
import NavBar from "../../common/NavBar";
import {Button, Form, Modal} from "react-bootstrap";
import Joi from "joi-browser";

export default class ResetPasswordPage extends Component{
    constructor(props) {
        super(props);
        this.state = {
            token: new URLSearchParams(this.props.location.search).get("token"),
            data: {
                password: "",
                password_confirm: ""
            },
            errors: {},
            showAlert: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this);
    }

    schema = {
        password: Joi.string().min(8).required().error(() => {return {message: "Parola trebuie să conțină cel puțin 8 caractere."}}),
        password_confirm: Joi.string().min(8).required().error(() => {return {message: "Parola trebuie să conțină cel puțin 8 caractere."}}),
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
    }

    doSubmit = () => {
        const payload = this.state.data
        payload["token"] = this.state.token
        fetch('http://localhost:8080/reset_password', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    showAlert: true,
                    message: "Parola a fost schimbată cu succes!"
                })
                this.props.history.replace("/login")
            }
            else if (res.status === 417) {
                this.setState({
                    showAlert: true,
                    message: "Datele introduse nu sunt valide!"
                })
            }
            else if (res.status === 401) {
                this.setState({
                    showAlert: true,
                    message: "Vă rugăm să alegeți altă parolă! Mulțumim!"
                })
            }
            else if (res.status === 404) {
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
            }
        })
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors: errors || {} });
        if (errors) return;

        this.doSubmit();
    }

    validate = () => {
        const options = {abortEarly: false};
        const {error} = Joi.validate(this.state.data, this.schema, options);

        if (!error) {
            if (this.state.data["password"] !== this.state.data["password_confirm"]) {
                const errorV2 = {}
                errorV2["password_confirm"] = "Cele două parole nu coincid."
                return errorV2
            }
            return null;
        }

        const errors = {};

        for(let item of error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    validateProperty = ({name, value}) => {
        const obj = {[name]: value};
        const schema = { [name]: this.schema[name] };
        const {error} = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
    }

    handleChange(event) {
        const errors = { ...this.state.errors};
        const errorMessage = this.validateProperty(event.target);
        if(errorMessage) errors[event.target.name]=errorMessage;
        else delete errors[event.target.name];

        const data = {...this.state.data};
        data[event.target.name] = event.target.value;
        this.setState({data, errors});
    }

    handleEnter = e => {
        if (e.keyCode === 13) {
            this.handleSubmit(e);
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
                                    Notificare resetare parolă
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
                        <Form className="d-flex flex-column my-border-form border rounded border-secondary w-50" >
                            <h3 className="align-self-center text-white text-uppercase">Resetare Parolă</h3>
                            <hr/>
                            <Form.Group>
                                <Form.Label className="my-label">Parolă nouă</Form.Label>
                                <Form.Control className="align-self-center bg-white" name="password" type="password" placeholder="Parola" onChange={this.handleChange}/>
                            </Form.Group>
                            {this.state.errors["password"] && <div className="alert alert-danger">{this.state.errors["password"]}</div>}
                            <Form.Group>
                                <Form.Label className="my-label">Confirmare Parolă</Form.Label>
                                <Form.Control className="align-self-center bg-white" name="password_confirm" type="password" placeholder="Confirmare Parola" onChange={this.handleChange}/>
                            </Form.Group>
                            {this.state.errors["password_confirm"] && <div className="alert alert-danger">{this.state.errors["password_confirm"]}</div>}
                            <Button className="align-self-center my-btn" type="button" onClick={this.handleSubmit} onKeyPress={this.handleEnter}>
                                Resetare
                            </Button>
                            <br/>
                        </Form>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
