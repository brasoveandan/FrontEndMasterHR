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
import {clockingOptions} from "../common/MySelect";
import MyForm from "../common/MyForm";
import * as Joi from "joi-browser";

export default class ViewTimesheet extends MyForm{
    constructor(props){
        super(props);
        let dict = JSON.parse(localStorage.getItem("clockingDict")) ? JSON.parse(localStorage.getItem("clockingDict")): {"today" : new Date()}
        if (new Date(dict["today"]).getDate() !== new Date().getDate()) {
            dict = {}
            dict["today"] = new Date()
        }
        const username = sessionStorage.getItem("username")
        this.state = {
            timesheet: [],
            showTimesheet: true,
            timesheetStatus: true,
            clocking: [],
            status: dict[username] && dict[username]["status"] ? dict[username]["status"] : "depontat",
            workTime:  dict[username] && dict[username]["workTime"] ? new Date(dict[username]["workTime"]) : "",
            workTimeEndOfDay: dict[username] && dict[username]["workTimeEndOfDay"] ? new Date(dict[username]["workTimeEndOfDay"]) : "",
            dict: dict,
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
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
        this.handleChangeInput = this.handleChangeInput.bind(this)
        this.loadData(this.state.year, this.state.month)
    }

    addHours= (hours, date) =>{
        const newDate = new Date(date)
        newDate.setHours(newDate.getHours() + hours)
        return newDate
    }

    deleteHours= (hours, date) =>{
        const newDate = new Date(date)
        newDate.setHours(newDate.getHours() - hours)
        return newDate
    }

    schema = {
        type: Joi.string().required().error(() => {return {message: "Trebuie selectat tipul pont??rii."}}),
        fromHour: Joi.date().iso().required().error(() => {return {message: "Ora de ??nceput este obligatorie."}}),
        toHour: Joi.date().iso().required().error(() => {return {message: "Ora de sf??r??it este obligatorie."}}),
        reason: Joi.string().optional().allow(""),
    }

    loadData = (year, month) => {
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
                        let timesheetStatus
                        timesheetStatus = json.status === "OPENED" && json.month === new Date().getMonth() + 1;
                        this.setState({
                            showTimesheet: true,
                            timesheet: json,
                            timesheetStatus: timesheetStatus
                        });
                    });
                }
                else if (res.status === 404) {
                    const today = new Date()
                    if (Number(this.state.year) === today.getFullYear() && Number(this.state.month) === today.getMonth() + 1)
                        this.setState({
                            showTimesheet: false,
                            timesheet: [],
                            timesheetStatus: true
                        })
                    else
                        this.setState({
                            showTimesheet: false,
                            timesheet: [],
                            timesheetStatus: false
                        })
                }
                else {
                    this.setState({
                        showTimesheet: false,
                        timesheet: [],
                        timesheetStatus: false
                    })
                }
            })

        fetch('http://localhost:8080/clocking/' + payload.username + "/" + year + "/" + month, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.token
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json => {
                        if (month < 10 && month >= 1)
                            month = "0" + month
                        let workTime = new Date()
                        let workTimeEndOfDay = new Date()
                        let ok = false
                        const today = new Date()
                        json.forEach(clocking => {
                            if (clocking.day < 10 && clocking.day >= 1)
                                clocking.day = "0" + clocking.day
                            const buildFromHour = year + "-" + month + "-" + clocking.day + "T" + clocking.fromHour + ":00Z"
                            const buildToHour = year + "-" + month + "-" + clocking.day + "T" + clocking.toHour + ":00Z"
                            const fromHour = new Date(buildFromHour)
                            const toHour = new Date(buildToHour)
                            if (fromHour.getDate() === today.getDate() && fromHour.toString() !== toHour.toString()) {
                                ok = true
                                workTime = this.deleteHours(3, fromHour)
                                workTimeEndOfDay = this.deleteHours(3, toHour)
                            }
                        })
                        ok ?
                            this.setState({
                                clocking: json,
                                workTime: workTime,
                                workTimeEndOfDay: workTimeEndOfDay,
                                status: "endOfDay"
                            })
                            :
                            this.setState({
                                clocking: json
                            })
                    });
                }
                else
                    if (res.status === 404)
                        this.setState({clocking: []});
            })
    }

    openModal = () => {
        this.setState({
            show: true,
            data: {
                type: "",
                fromHour: "",
                toHour: "",
                reason: ""
            }
        });
    }

    closeModal = () => {
        this.setState({
            show: false,
        });
    };

    closeAlert = () => {
        this.setState({
            showAlert:false
        })
    }

    handleChangeInput(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
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
                let {dict, year, month} = this.state
                dict[payload.usernameEmployee] = {status: "pontat", workTime: payload.fromHour, workTimeEndOfDay: ""}
                localStorage.setItem("clockingDict", JSON.stringify(dict))
                this.loadData(year, month)
            }
            else if (res.status === 417)
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Pontarea nu a fost realizat??."
                    })
                });
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Exist?? deja pontare pentru ziua de ast??zi. Contacta??i echipa tehnic??."
                })
            else
                this.setState({
                    showAlert: true,
                    message: "A ap??rut o eroare. Dac?? persist??, v?? rug??m s?? ne semnala??i eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mul??umim!"
                })
        })
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
                let {dict, year, month} = this.state
                dict[payload.usernameEmployee] = {status: "endOfDay", workTime: payload.fromHour, workTimeEndOfDay: payload.toHour}
                localStorage.setItem("clockingDict", JSON.stringify(dict))
                this.loadData(year, month)
            }
            else if (res.status === 417)
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Depontarea nu a fost realizat??."
                    })
                });
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Eroare. Contacta??i echipa tehnic??."
                })
            else
                this.setState({
                    showAlert: true,
                    message: "A ap??rut o eroare. Dac?? persist??, v?? rug??m s?? ne semnala??i eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mul??umim!"
                })
        })
    }

    doSubmit = () => {
        const payload = {
            usernameEmployee: sessionStorage.getItem("username"),
            type: this.state.data.type,
            fromHour: this.state.data.fromHour,
            toHour: this.state.data.toHour,
            reason: this.state.data.reason
        }
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
                this.closeModal()
                const {year, month} = this.state
                this.loadData(year, month)
            }
            else if (res.status === 409)
                this.setState({
                    showAlert: true,
                    message: "Exist?? deja pontaj pentru datele introduse."
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
                    message: "A ap??rut o eroare. Dac?? persist??, v?? rug??m s?? ne semnala??i eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mul??umim!"
                })
        })
    }

    handleFilter = () => {
        const payload = {
            year : this.state.year,
            month: this.state.month
        }
        if (payload.year.toString() === "" || payload.month === "")
            this.setState({
                timesheet: [],
                clocking: [],
                showTimesheet: false,
                showAlert: true,
                message: "Nu exist?? date."
            })
        else
            this.loadData(payload.year, payload.month)
    }

    render(){
        let {year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeHours, status} = this.state.timesheet;
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
                                        <Card className="punch-status">
                                            <Card.Body>
                                                {this.state.timesheetStatus ?
                                                    <React.Fragment>
                                                        <h5 className="card-title">Pontaj
                                                            <span className="text-muted ml-2">
                                                                {new Date().toLocaleDateString("ro-RO", {year: 'numeric', month: 'long', day: 'numeric'})}
                                                             </span>
                                                        </h5>
                                                        {this.state.status === "depontat" ?
                                                            <div className="punch-det text-white bg-dark">
                                                                <h6>Status: NEPONTAT</h6>
                                                                <p>Ad??ugare pontaj manual - pontare pentru o alt?? zi din lun?? sau pentru ziua de telemunc??.</p>
                                                                <p>Pontare - adaug?? pontaj pentru ziua ??n curs.</p>
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
                                                                    <React.Fragment>
                                                                        <Button className="my-btn punch-btn" type="button" onClick={this.handleDepontaj}>{"Depontare"}</Button>
                                                                        <div className="punch-det text-white bg-dark my-3">
                                                                            <p>Ad??ugare pontaj manual - pontare pentru o alt?? zi din lun?? sau pentru ziua de telemunc??.</p>
                                                                        </div>
                                                                    </React.Fragment>
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
                                                    </React.Fragment>
                                                    :
                                                    <React.Fragment>
                                                        <h5 className="card-title">Pontaj
                                                            <span className="text-muted ml-2">
                                                                {new Date(this.state.year, Number(this.state.month) - 1).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long'})}
                                                            </span>
                                                        </h5>
                                                        {status === "CLOSED" ?
                                                            <div className="punch-det text-white bg-dark">
                                                                <h5>Pontajul a fost <strong>CONFIRMAT</strong>.</h5>
                                                                <p>Nu se mai pot efectua modific??ri.</p>
                                                            </div>
                                                            :
                                                            <div className="punch-det text-white bg-dark">
                                                                <h5>Nu se pot efectua modific??ri pentru luna
                                                                    selectat??.</h5>
                                                            </div>
                                                        }
                                                    </React.Fragment>
                                                }
                                            </Card.Body>
                                            <div className="card-footer bg-white border-top border-dark text-center">
                                                <Button className="my-btn" disabled={!this.state.timesheetStatus} type="button" onClick={this.openModal}>Adaug?? pontaj manual</Button>
                                            </div>
                                            <Modal backdrop="static" keyboard={false} show={this.state.show} onHide={this.closeModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Adaug?? pontaj</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className="container container-fluid mt-5 mb-5">
                                                        <Card>
                                                            <Card.Header>
                                                                <Card.Body>
                                                                    <Form>
                                                                        {this.renderSelect("form-control", "type", "Tip", clockingOptions)}
                                                                        {this.renderInput("form-control", "fromHour", "Or?? intrare", "Ora intrare", "datetime-local")}
                                                                        {this.renderInput("form-control", "toHour", "Or?? ie??ire", "Ora iesire", "datetime-local")}
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
                                                            <span>Luna curent?? <strong>{workedHours + homeOfficeHours + overtimeHours}<small>/ {requiredHours}</small></strong></span>
                                                            <ProgressBar now={(workedHours + homeOfficeHours + overtimeHours) / requiredHours * 100}/>
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Ore la birou <strong>{workedHours} <small>/ {requiredHours}</small></strong></span>
                                                            {/*<ProgressBar now={workedHours / requiredHours * 100}/>*/}
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Ore telemunc?? <strong>{homeOfficeHours} <small>/ {requiredHours}</small></strong></span>
                                                            {/*<ProgressBar now={homeOfficeHours / requiredHours * 100}/>*/}
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Ore suplimentare lun?? curent?? <strong>{overtimeHours}</strong></span>
                                                        </div>
                                                        <div className="stats-info bg-dark text-white">
                                                            <span>Total ore suplimentare <strong>{totalOvertimeHours}</strong></span>
                                                        </div>
                                                    </div>
                                                :
                                                    <Modal.Header>Nu exist?? statistica.</Modal.Header>
                                                }
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col sm={12} className="text-center mb-3">
                                        <label className="text-white font-weight-bold">An:</label>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="year" type="text" placeholder="ex: 2021" defaultValue={year} onChange={this.handleChangeInput}/>
                                        <label className="text-white font-weight-bold">Luna:</label>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="month" type="text" placeholder="ex: 2" defaultValue={month} onChange={this.handleChangeInput}/>
                                        <Button className="col-sm-3 ml-md-3 btn-success btn text-uppercase font-weight-bold" type="button" onClick={this.handleFilter}>Caut??</Button>
                                    </Col>
                                    <Col sm={12}>
                                        {clockingLength > 0 ?
                                            <Table responsive striped hover className={"bg-white"}>
                                                <thead className="text-center">
                                                <tr>
                                                    <th>Ziua</th>
                                                    <th>Or?? intrare</th>
                                                    <th>Or?? ie??ire</th>
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
                                            <Modal.Header className="bg-white font-weight-bold">Nu au fost ??nregistrate pont??ri.</Modal.Header>
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
