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
        this.state = {
            timesheet: [],
            showTimesheet: true,
            clocking: [],
            status: localStorage.getItem("status") ? localStorage.getItem("status") : "depontat",
            workDate: localStorage.getItem("workDate") ? new Date(localStorage.getItem("workDate")) : "",
            workDateAfterClocking: localStorage.getItem("workDateAfterClocking") ? new Date(localStorage.getItem("workDateAfterClocking")) : "",
            show: false,
            data: {
                type: "",
                fromHour: "",
                toHour: "",
                reason: ""
            },
            errors: {},
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
            idTimesheet: localStorage.getItem("username") + year + month,
            username: localStorage.getItem("username"),
            token: localStorage.getItem("jwt")
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

    handlePontaj = () => {
        const payload = {
            usernameEmployee: localStorage.getItem("username"),
            token: localStorage.getItem("jwt"),
            fromHour: new Date(),
            toHour: new Date(),
        }
        fetch('http://localhost:8080/clocking', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.token
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.status === 200)
                {
                    this.setState({
                        status: "pontat",
                        workDate: payload.fromHour,
                    })
                    localStorage.setItem("status", "pontat")
                    localStorage.setItem("workDate", payload.fromHour)
                    alert("Succes")
                }
                else if (res.status === 409)
                    alert("Conflict")
                else
                    alert("Exception")
            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => { const mute = error} );

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    doSubmit = (action) => {
        const payload = this.state.data
        payload["usernameEmployee"] = localStorage.getItem("username")
        fetch('http://localhost:8080/clocking', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status === 200)
                alert("Succes")
            else if (res.status === 409)
                alert("Conflict")
            else
                alert("Exception")
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { const mute = error} );
        this.setState({
            show: false
        })
    }

    handleDepontaj = () => {
        const payload = {
            token: localStorage.getItem("jwt"),
            toHour: new Date()
        }
        fetch('http://localhost:8080/clocking', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    status: "endOfDay",
                    workDateAfterClocking: payload.toHour,
                })
                localStorage.setItem("status", "endOfDay")
                localStorage.setItem("workDateAfterClocking", payload.toHour)
                alert("Succes")
            }
            else if (res.status === 409)
                alert("Conflict")
            else
                alert("Exception")
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { const mute = error} );
    }

    render(){
        let {year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeLeave} = this.state.timesheet;
        const clockingLength = this.state.clocking.length;
        return (
            <Container fluid>
                <Row className="mt-4 mb-4 ml-sm-5 ml-md-0" style={{opacity: ".85"}}>
                    <Col sm={12}>
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
                                                        <p>Adăugare pontaj manual - pontare pentru o altă zi sau ziua de telemuncă.</p>
                                                        <p>Pontare - adaugă pontaj pentru ziua în curs.</p>
                                                    </div>
                                                    :
                                                    this.state.status === "pontat" ?
                                                        <div className="punch-det text-white bg-dark">
                                                            <h6>Status: PONTAT</h6>
                                                            <p>{this.state.workDate.toLocaleDateString("ro-RO", {hour: "numeric", minute: "numeric", weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'})}</p>
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
                                                        <div><h6 className="font-weight-bold mb-3">- Sumarul zilei -</h6></div>
                                                        <p>Pontat:  {format(this.state.workDate, "HH:mm")}</p>
                                                        <p>Depontat: {format(this.state.workDateAfterClocking, "HH:mm")}</p>
                                                        <p>Ore lucrate: {this.state.workDateAfterClocking.getHours() - this.state.workDate.getHours()}</p>
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
                                                            <span>Total ore suplimentare <strong>{totalOvertimeLeave}</strong></span>
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
