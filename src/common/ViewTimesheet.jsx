import React from "react";
import {
    Button,
    Card,
    Col,
    Container,
    Form,
    FormGroup,
    FormLabel,
    Modal,
    ProgressBar,
    Row,
    Table
} from "react-bootstrap";
import {FaTimes} from "react-icons/all";
import { format } from "date-fns";

export default class ViewTimesheet extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            timesheet: [],
            clocking: [],
            status: localStorage.getItem("status") ? localStorage.getItem("status") : "depontat",
            workDate: localStorage.getItem("workDate") ? new Date(localStorage.getItem("workDate")) : "",
            workDateAfterClocking: localStorage.getItem("workDateAfterClocking") ? new Date(localStorage.getItem("workDateAfterClocking")) : "",
            show: false,
            value: "",
            ora_intrare: "",
            ora_iesire: "",
            motiv: ""
        };

        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.handlePontaj = this.handlePontaj.bind(this)
        this.handleDepontaj = this.handleDepontaj.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handlePontajManual = this.handlePontajManual.bind(this)

        let newDate = new Date();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        fetch('http://localhost:8080/timesheet/' + localStorage.getItem('username') + year + month, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({timesheet: json});
                    });
                }
                else {
                    console.log("error timesheet")
                }
            })

        fetch('http://localhost:8080/clocking/' + localStorage.getItem('username'), {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({clocking: json});
                    });
                }
                else {
                    console.log("error clocking")
                }
            })
    }

    openModal() {
        this.setState({
            show: true
        });
    }

    closeModal = e => {
        this.setState({
            show: false
        });
    };

    handlePontaj() {
        const payload = {
            usernameEmployee: localStorage.getItem("username"),
            fromHour: new Date(),
            toHour: new Date(),
        }
        fetch('http://localhost:8080/clocking', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
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

    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handlePontajManual() {
        const payload = {
            usernameEmployee: localStorage.getItem("username"),
            type: this.state.value,
            fromHour: this.state.ora_intrare,
            toHour: this.state.ora_iesire,
            reason: this.state.motiv
        }
        fetch('http://localhost:8080/clocking', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
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
        this.setState({
            show: false
        });
    }

    handleDepontaj() {
        const payload = {
            usernameEmployee: localStorage.getItem("username"),
            toHour: new Date()
        }
        fetch('http://localhost:8080/clocking', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
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
    }

    render(){
        let {year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeLeave} = this.state.timesheet;
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
                                                                        <FormGroup>
                                                                            <FormLabel>Tip<span className="text-danger">*</span></FormLabel>
                                                                            <select className="form-control" name="value" value={this.state.value} onChange={this.handleChange}>
                                                                                <option>Selectează Tip</option>
                                                                                <option value="Telemuncă">Telemuncă</option>
                                                                                <option value="Normal">Normal</option>
                                                                            </select>
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>Oră intrare <span className="text-danger">*</span></label>
                                                                            <div className="cal-icon">
                                                                                <input className="form-control" placeholder="Ora intrare" name="ora_intrare" type="datetime-local" onChange={this.handleChange}/>
                                                                            </div>
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>Oră ieșire <span className="text-danger">*</span></label>
                                                                            <div className="cal-icon">
                                                                                <input className="form-control" placeholder="Ora iesire" name="ora_iesire" type="datetime-local" onChange={this.handleChange}/>
                                                                            </div>
                                                                        </FormGroup>
                                                                        <FormGroup>
                                                                            <label>Motiv <span className="text-danger">*</span></label>
                                                                            <textarea rows="3" className="form-control" name="motiv" onChange={this.handleChange}/>
                                                                        </FormGroup>
                                                                        <div className="submit-section text-center">
                                                                            <button className="my-btn" type="button" onClick={this.handlePontajManual}>Pontare</button>
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
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                    <Col sm={12} className="text-center mb-3">
                                        <label className="text-white font-weight-bold">An:</label>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="an" type="text" placeholder="ex: 2021" defaultValue={year} onChange={this.handleChange}/>
                                        <label className="text-white font-weight-bold">Luna:</label>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="luna" type="text" placeholder="ex: 2" defaultValue={month} onChange={this.handleChange}/>
                                        <Button className="col-sm-3 ml-md-3 btn-success btn text-uppercase font-weight-bold" type="button" onClick={this.handleFilter}>Caută</Button>
                                    </Col>
                                    <Col sm={12}>
                                        {this.state.clocking.length > 0 ?
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
                                                {this.state.clocking.map((item) => (
                                                    <tr>
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
                                            <Modal.Header className="bg-white font-weight-bold">Nu există date</Modal.Header>
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
