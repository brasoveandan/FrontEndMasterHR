import React from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    Modal,
    ProgressBar,
    Row,
    Table
} from "react-bootstrap";
import {FaTimes} from "react-icons/all";
import { format } from "date-fns";
import {clockingOptions} from "../components/utils/select";
import MyForm from "../components/utils/MyForm";
import * as Joi from "joi-browser";

export default class ViewTimesheet extends MyForm{
    constructor(props){
        super(props);
        const dict = JSON.parse(localStorage.getItem("clockingDict")) ? JSON.parse(localStorage.getItem("clockingDict")): {}
        const username = sessionStorage.getItem("username")
        this.state = {
            timesheet: [],
            showTimesheet: true,
            clocking: [],
            status: dict[username] && dict[username]["status"] ? dict[username]["status"] : "depontat",
            workTime:  dict[username] && dict[username]["workTime"] ? new Date(dict[username]["workTime"]) : "",
            workTimeEndOfDay: dict[username] && dict[username]["workTimeEndOfDay"] ? new Date(dict[username]["workTimeEndOfDay"]) : "",
            show: false,
            data: {
                type: "",
                fromHour: "",
                toHour: "",
                reason: ""
            },
            errors: {},
            showAlert: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this)
        this.loadData()
    }

    schema = {
        type: Joi.string().required().error(() => {return {message: "Trebuie selectat tipul pontării."}}),
        fromHour: Joi.date().iso().required().error(() => {return {message: "Ora de început este obligatorie."}}),
        toHour: Joi.date().iso().required().error(() => {return {message: "Ora de sfârșit este obligatorie."}}),
        reason: Joi.string().optional().allow(""),
    }

    loadData = () => {
        let newDate = new Date();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        const payload = {
            idTimesheet: sessionStorage.getItem("username") + year + month,
            username: sessionStorage.getItem("username"),
            token: sessionStorage.getItem("jwt")
        }

        fetch('http://localhost:8080/timesheet/' + payload.idTimesheet, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({timesheet: json});
                    });
                }
                else {
                    this.setState({
                        showTimesheet: false
                    })
                }
            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => { const mute = error} );

        fetch('http://localhost:8080/clocking/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({clocking: json});
                    });
                }
                else {
                    this.setState({
                        message: "Nu au fost înregistrate pontări."
                    })
                }
            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => { const mute = error} );
    }

    openModal = () => {
        this.setState({
            show: true
        });
    }

    closeModal = () => {
        this.setState({
            show: false
        });
    };

    closeAlert = () => {
        this.setState({
            showAlert:false
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    addHours= (hours, date) =>{
        const newDate = new Date(date)
        newDate.setHours(newDate.getHours() + hours)
        return newDate
    }

    handlePontaj = () => {
        const payload = {
            usernameEmployee: sessionStorage.getItem("username"),
            fromHour: new Date(),
            toHour: new Date(),
        }
        fetch('http://localhost:8080/clocking', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                usernameEmployee: payload.usernameEmployee,
                fromHour: this.addHours(3, payload.fromHour),
                toHour: this.addHours(3, payload.toHour),
            })
        })
        .then(res => {
            if (res.status === 200)
            {
                this.setState({
                    status: "pontat",
                    workTime: payload.fromHour,
                    showAlert: true,
                    message: "Te-ai pontat la ora " + format(payload.fromHour, "HH:mm")
                })
                let localDict = JSON.parse(localStorage.getItem("clockingDict")) ? JSON.parse(localStorage.getItem("clockingDict")): {}
                localDict[payload.usernameEmployee] = {status: "pontat", workTime: payload.fromHour, workTimeEndOfDay: ""}
                localStorage.setItem("clockingDict", JSON.stringify(localDict))
                this.loadData()
            }
            else if (res.status === 417)
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Pontarea nu a fost realizată."
                    })
                });
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Eroare. Contactați echipa tehnică."
                })
            else
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { const mute = error} );
    }

    handleDepontaj = () => {
        const payload = {
            usernameEmployee: sessionStorage.getItem("username"),
            fromHour:  this.state.workTime,
            toHour: new Date(),
        }
        fetch('http://localhost:8080/clocking', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify({
                usernameEmployee: payload.usernameEmployee,
                fromHour:  payload.fromHour,
                toHour: this.addHours(3, payload.toHour),
            })
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    status: "endOfDay",
                    workTimeEndOfDay: payload.toHour,
                    showAlert: true,
                    message: "Te-ai depontat la ora " + format(payload.toHour, "HH:mm")
                })
                let localDict = JSON.parse(localStorage.getItem("clockingDict")) ? JSON.parse(localStorage.getItem("clockingDict")): {}
                localDict[payload.usernameEmployee] = {status: "endOfDay", workTime: payload.fromHour, workTimeEndOfDay: payload.toHour}
                localStorage.setItem("clockingDict", JSON.stringify(localDict))
                this.loadData()
            }
            else if (res.status === 417)
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Depontarea nu a fost realizată."
                    })
                });
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Eroare. Contactați echipa tehnică."
                })
            else
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { const mute = error} );
    }

    doSubmit = () => {
        const payload = this.state.data
        payload["usernameEmployee"] = sessionStorage.getItem("username")
        fetch('http://localhost:8080/clocking', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    show: false,
                    showAlert: true,
                    message: "Pontajul a fost salvat cu succes."
                })
                this.loadData()
            }
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Există deja pontaj pentru datele introduse."
                })
            else if (res.status === 417)
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Pontajul nu a fost salvat."
                    })
                });
            else
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { const mute = error} );
    }

    render(){
        let {year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeHours} = this.state.timesheet;
        const clockingLength = this.state.clocking.length;
        return (
            <Container fluid>
                <Row className="mt-4 mb-4 ml-sm-5 ml-md-0" style={{opacity: ".85"}}>
                    <Col sm={12}>
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
                        <Card className="bg-dark">
                            <Card.Body>
                                <Row>
                                    <Col sm={6} className="mb-3">
                                        <Card className="punch-status"  style={{height: "407px"}}>
                                            <Card.Body>
                                                <h5 className="card-title">Pontaj
                                                    <span className="text-muted ml-2">
                                                         {new Date().toLocaleDateString("ro-RO", {year: 'numeric', month: 'long', day: 'numeric'})}
                                                    </span>
                                                </h5>
                                                {this.state.status === "depontat" ?
                                                    <div className="punch-det text-white bg-dark">
                                                        <h6>Status: NEPONTAT</h6>
                                                        <p>Adăugare pontaj manual - pontare pentru o altă zi sau pentru ziua de telemuncă.</p>
                                                        <p>Pontare - adaugă pontaj pentru ziua în curs.</p>
                                                    </div>
                                                    :
                                                    this.state.status === "pontat" ?
                                                        <div className="punch-det text-white bg-dark">
                                                            <h6>Status: PONTAT</h6>
                                                            <p>{this.state.workTime.toLocaleDateString("ro-RO", {hour: "numeric", minute: "numeric", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
                                                        </div>
                                                        : ""
                                                }
                                                <div className="text-center">
                                                    {this.state.status === "depontat" ?
                                                        <Button className="my-btn punch-btn" type="button" onClick={this.handlePontaj}>{"Pontare"}</Button>
                                                        :
                                                        this.state.status === "pontat" ?
                                                            <Button className="my-btn punch-btn" type="button" onClick={this.handleDepontaj}>{"Depontare"}</Button>
                                                            : ""
                                                    }
                                                </div>
                                                {this.state.status === "endOfDay" ?
                                                    <div className="punch-det text-white bg-dark text-center">
                                                        <div><h6 className="font-weight-bold mb-3">-- Sumarul zilei --</h6></div>
                                                        <p>Pontat:  {format(this.state.workTime, "HH:mm")}</p>
                                                        <p>Depontat: {format(this.state.workTimeEndOfDay, "HH:mm")}</p>
                                                        <p>Ore lucrate: {this.state.workTimeEndOfDay.getHours() - this.state.workTime.getHours()}</p>
                                                    </div>
                                                    : ""
                                                }
                                            </Card.Body>
                                            <div className="card-footer bg-white border-top border-dark text-center">
                                                <Button className="my-btn" type="button" onClick={this.openModal}>Adaugă pontaj manual</Button>
                                            </div>
                                            <Modal backdrop="static" keyboard={false} show={this.state.show} onHide={this.closeModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Adaugă pontaj</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className="container container-fluid mt-5 mb-5">
                                                        <Card>
                                                            <Card.Header>
                                                                <Card.Body>
                                                                    <Form>
                                                                        {this.renderSelect("form-control", "type", "Tip", clockingOptions)}
                                                                        {this.renderInput("form-control", "fromHour", "Oră intrare", "Ora intrare", "datetime-local")}
                                                                        {this.renderInput("form-control", "toHour", "Oră ieșire", "Ora iesire", "datetime-local")}
                                                                        {this.renderTextarea("form-control", "reason", "Motiv", "Pe scurt...", "3")}
                                                                        <div className="text-center" onClick={(e) => this.handleSubmit("", e)}>
                                                                            {this.renderButton("my-btn", "Pontare", "button")}
                                                                        </div>
                                                                    </Form>
                                                                </Card.Body>
                                                            </Card.Header>
                                                        </Card>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </Card>
                                    </Col>
                                    <Col sm={6} className="mb-3">
                                        <Card className="att-statistics rounded">
                                            <Card.Body>
                                                <Card.Title>
                                                    <h5>Statistici ore</h5>
                                                </Card.Title>
                                                {this.state.showTimesheet ?
                                                    <div className="stats-list">
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Ore lucrate <strong>{workedHours} <small>/ {requiredHours} ore</small></strong></span>
                                                            <ProgressBar now={workedHours / requiredHours * 100}/>
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Ore telemuncă <strong>{homeOfficeHours} <small>/ {requiredHours}</small></strong></span>
                                                            <ProgressBar now={homeOfficeHours / requiredHours * 100}/>
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Luna curentă <strong>{workedHours + homeOfficeHours} <small>/ {requiredHours}</small></strong></span>
                                                            <ProgressBar now={(workedHours + homeOfficeHours) / requiredHours * 100}/>
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Ore suplimentare lună curentă <strong>{overtimeHours}</strong></span>
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Total ore suplimentare <strong>{totalOvertimeHours}</strong></span>
                                                        </div>
                                                    </div>
                                                :
                                                    <Modal.Header>Nu există statistica.</Modal.Header>
                                                }
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col sm={12} className="text-center mb-3">
                                        <label className="text-white font-weight-bold">An:</label>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" disabled={!(clockingLength> 0)} name="an" type="text" placeholder="ex: 2021" defaultValue={year} onChange={this.handleChange}/>
                                        <label className="text-white font-weight-bold">Luna:</label>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" disabled={!(clockingLength> 0)} name="luna" type="text" placeholder="ex: 2" defaultValue={month} onChange={this.handleChange}/>
                                        <Button className="col-sm-3 ml-md-3 btn-success btn text-uppercase font-weight-bold" type="button" disabled={!(clockingLength> 0)} onClick={this.handleFilter}>Caută</Button>
                                    </Col>
                                    <Col sm={12}>
                                        {clockingLength > 0 ?
                                            <Table responsive striped hover className={"bg-white"}>
                                                <thead className="text-center">
                                                <tr>
                                                    <th>Ziua</th>
                                                    <th>Oră intrare</th>
                                                    <th>Oră ieșire</th>
                                                    <th>Ore lucrate</th>
                                                    <th>Ore suplimentare</th>
                                                </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                {this.state.clocking.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.day}</td>
                                                        <td>{item.fromHour}</td>
                                                        <td>{item.toHour}</td>
                                                        <td>{item.workedHours}</td>
                                                        <td>{item.overtimeHours ? item.overtimeHours : <FaTimes/>}</td>
                                                    </tr>
                                                ))}
                                                </tbody>
                                            </Table>
                                            :
                                            <Modal.Header className="bg-white font-weight-bold">{this.state.message}</Modal.Header>
                                        }
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}
