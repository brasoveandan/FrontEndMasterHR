import React from "react";
import {Button, Card, Col, Container, Modal, ProgressBar, Row, Table} from "react-bootstrap";
import {FaTimes, MdEdit} from "react-icons/all";

export default class ViewTimesheet extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            timesheet: [],
            clocking: [],
            pontaj: false,
            show: false
        };

        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)

        let newDate = new Date();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();

        const payload = {
            idTimesheet: localStorage.getItem('username') + year + month
        }

        fetch('http://localhost:8080/timesheet/' + payload.idTimesheet, {
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
                    // LOGIN PERSISTANCE
                }
                else {
                    console.log("error")
                    console.log(payload.idTimesheet)
                }
            })
        fetch('http://localhost:8080/clocking', {
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
                    // LOGIN PERSISTANCE
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

    handleFilter () {
        return (
            this.state.clocking.map((item, index) => (
                    <tr>
                        <td>{index + 1}</td>
                        <td>{item.fromHour}</td>
                        <td>{item.toHour}</td>
                        <td>{item.fromHour - item.toHour}</td>
                        <td>0</td>
                    </tr>
                ))
        )
    }

    render(){
        let {year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeLeave, fromHourClocking, toHourClocking} = this.state.timesheet;
        return (
            <Container fluid>
                <Row className="mt-4 mb-4 ml-sm-5 ml-md-0" style={{opacity: ".85"}}>
                    <Col sm={12}>
                        <Card className="bg-dark">
                            <Card.Body>
                                <Row>
                                    <Col sm={6} className="mb-3">
                                        <Card className="punch-status">
                                            <Card.Body>
                                                <h5 className="card-title">Pontaj
                                                    <span className="text-muted"> 11 Mar 2019</span>
                                                </h5>
                                                <div className="punch-det text-white bg-dark">
                                                    <h6>Pontat la</h6>
                                                    <p>Wed, 11th Mar 2019 10.00 AM</p>
                                                </div>
                                                <div className="text-center">
                                                    <Button className="my-btn punch-btn" type="button">{(this.state.pontaj) ? "Depontare" : "Pontare"}</Button>
                                                </div>
                                            </Card.Body>
                                            <div className="card-footer bg-white border-top border-dark text-center">
                                                <Button className="my-btn" type="button" onClick={this.openModal}>Adaugă pontaj manual</Button>
                                            </div>
                                            <Modal show={this.state.show} onHide={this.closeModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Adaugă pontaj</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className="container container-fluid mt-5 mb-5">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="card-body">
                                                                    <form>
                                                                        <div className="form-group">
                                                                            <label>Tip<span className="text-danger">*</span></label>
                                                                            <select className="select select2-hidden-accessible" data-select2-id="7" tabIndex="-1" aria-hidden="true">
                                                                                <option data-select2-id="9">Selectează Tip</option>
                                                                                <option data-select2-id="18">Telemuncă</option>
                                                                                <option data-select2-id="19">Normal</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Oră intrare <span className="text-danger">*</span></label>
                                                                            <div className="cal-icon">
                                                                                <input className="form-control" placeholder="Ora intrare" type="datetime-local"/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Oră ieșire <span className="text-danger">*</span></label>
                                                                            <div className="cal-icon">
                                                                                <input className="form-control" placeholder="Ora iesire" type="datetime-local"/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Motiv <span className="text-danger">*</span></label>
                                                                            <textarea rows="3" className="form-control"/>
                                                                        </div>
                                                                        <div className="submit-section text-center">
                                                                            <button className="my-btn">Trimite</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                        <span>Luna curentă <strong>{workedHours} <small>/ {requiredHours} ore</small></strong></span>
                                                        <ProgressBar now={workedHours / requiredHours * 100}/>
                                                    </div>
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Ore telemuncă <strong>{homeOfficeHours} <small>/ 40</small></strong></span>
                                                        <ProgressBar now={homeOfficeHours / 40 * 100}/>
                                                    </div>
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Ore necesare <strong>{workedHours + homeOfficeHours} <small>/ {requiredHours}</small></strong></span>
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
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="an" type="text" placeholder="An" defaultValue={year} onChange={this.handleChange}/>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="luna" type="text" placeholder="Luna" defaultValue={month} onChange={this.handleChange}/>
                                        <Button className="col-sm-3 ml-md-3 btn-success btn text-uppercase font-weight-bold" type="submit" onClick={this.handleFilter}>Caută</Button>
                                    </Col>
                                    <Col sm={12}>
                                        <Table responsive striped hover className="bg-white">
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
                                                {this.handleFilter()}
                                            </tbody>
                                        </Table>
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
