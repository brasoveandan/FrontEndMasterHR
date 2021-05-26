import React from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import NavBar from "../utils/NavBar";
import {FaEnvelope} from "react-icons/all";

export default class ForgotPasswordPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: ""
        };
        this.handleChange = this.handleChange.bind(this);
    }

    doSubmit = (e) => {
        e.preventDefault()
        const payload = {
            email: this.state.email
        }
        fetch('http://localhost:8080/forgot', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
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
                    <div className="d-flex justify-content-center align-items-center my-5">
                        <Form className="d-flex flex-column my-border-form border rounded border-secondary w-50" onSubmit={this.doSubmit}>
                            <h3 className="align-self-center text-white text-uppercase">Schimbare Parola</h3>
                            <hr/>
                            <Form.Group controlId="formUser">
                                <Form.Label className="my-label">Email</Form.Label>
                                <InputGroup className="mb-2" >
                                    <InputGroup.Text className="bg-white"><FaEnvelope/></InputGroup.Text>
                                    <Form.Control className="align-self-center bg-white" name="email" type="email" placeholder="Email" onChange={this.handleChange}/>
                                </InputGroup>
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
