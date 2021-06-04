import React from "react";
import {FaTimes} from "react-icons/all";
import {Button, Card, CardDeck, Col, Form, Modal, Row, Table} from "react-bootstrap";

export default class ViewPayslip extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            payslip: [],
            yearOptions: [],
            monthOptions: [],
            year: "",
            month: "",
            bool: true,
            showAlert: false,
            message: ""
        };

        this.renderPayslip = this.renderPayslip.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.loadData()
    }

    loadData = () => {
        fetch('http://localhost:8080/payslip', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        const data = json;
                        let yearOptions = [];
                        let monthOptions = [];
                        data.forEach(payslip => {
                            if (payslip.usernameEmployee === sessionStorage.getItem("username")) {
                                yearOptions.push(payslip.year)
                                monthOptions.push(payslip.month)
                            }
                        })
                        this.setState({
                            yearOptions: yearOptions,
                            monthOptions: monthOptions
                        })
                    });
                }
                else {
                    this.setState({
                        showAlert: true,
                        message: "Nu există date."
                    })
                }
            })
            // eslint-disable-next-line no-unused-vars
            .catch(error => { const mute = error} );
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    renderPayslip = (payslip) => {
        let {year, month, idPayslip, firstName, lastName, companyName, personalNumber, department, position, baseSalary, currency,
            grossSalary, overtimeIncreases, increases, ticketsValue, workedHours, homeOfficeHours, requiredHours, overtimeHours,
            cas, cass, iv, taxExempt, netSalary} = payslip;
        return (
            <Col xs={12} md={10} className="ml-md-5 pr-xl-5 pt-xl-5 mr-xl-5 d-flex justify-content-center">
                <Card className="text-left mb-4 ml-xl-0" style={{opacity: ".85"}} >
                    <Card.Header className="text-center text-monospace my-label bg-dark">
                        Fluturaș Salariu
                    </Card.Header>
                    <Card.Body>
                        <h4 className="payslip-title">Fluturaș Salariu <strong className="font-italic">{new Date(year, month - 1).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long'})}</strong></h4>
                        <Row>
                            <Col sm={6} className="col-sm-6 m-b-20">
                                <ul className="list-unstyled">
                                    <li><h5 className="mb-0"><strong>{lastName} {firstName}</strong></h5></li>
                                    <li><span>Departament: {department}</span></li>
                                    <li>Număr personal: {personalNumber}</li>
                                    <li>Poziție: {position}</li>
                                </ul>
                            </Col>
                            <Col sm={6} className="m-b-20">
                                <ul className="list-unstyled mb-0">
                                    <li><h5 className="mb-0"><strong>{companyName}</strong></h5></li>
                                    <li><span>ID: #{idPayslip}</span></li>
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6}>
                                <h4 className="m-b-10"><strong>Venituri</strong></h4>
                                <Table bordered>
                                    <tbody>
                                        <tr>
                                            <td><strong>Salariu de bază</strong>
                                                <span className="float-right">{baseSalary} {currency}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Plată ore suplimentare</strong>
                                                <span className="float-right">{overtimeIncreases} {currency}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Sporuri</strong> <span
                                                className="float-right">{increases} {currency}</span></td>
                                        </tr>
                                        <tr>
                                            <td><strong>Salariu Brut</strong>
                                                <span className="float-right"><strong>{grossSalary} {currency}</strong></span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Tichete de masă</strong>
                                                <span className="float-right">{ticketsValue} {currency}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Total Venituri</strong>
                                                <span className="float-right"><strong>{grossSalary + ticketsValue + overtimeIncreases + increases} {currency}</strong></span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Col>
                            <Col sm={6}>
                                <h4 className="m-b-10"><strong>Situație Ore</strong></h4>
                                <table className="table table-bordered">
                                    <tbody>
                                    <tr>
                                        <td><strong>Ore standard</strong>
                                            <span className="float-right">{workedHours}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ore Telemuncă</strong>
                                            <span className="float-right">{homeOfficeHours}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Ore suplimentare</strong> <span
                                            className="float-right">{overtimeHours}</span></td>
                                    </tr>
                                    <tr>
                                        <td>Norma lunară
                                            <span className="float-right">{requiredHours}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total ore lucrate</strong>
                                            <span className="float-right"><strong>{workedHours + homeOfficeHours + overtimeHours}</strong></span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <h4 className="m-b-10"><strong>Taxe</strong></h4>
                                <Table bordered>
                                    <tbody>
                                    <tr>
                                        <td><strong>Asigurări Sociale (CAS) 25%</strong>
                                            <span className="float-right">{cas} {currency}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Asigurări Sociale de Sănătate (CASS) 10%</strong>
                                            <span className="float-right">{cass} {currency}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Impozit pe venit (IV) 10%</strong>
                                            <span className="float-right">{taxExempt ? <FaTimes/> : iv + " " + currency} </span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Total Taxe</strong>
                                            <span className="float-right"><strong>{cas + cass + iv} {currency}</strong></span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <h5 className="m-b-10 text-center"><strong>Rest de plată</strong></h5>
                                <Table>
                                    <tbody>
                                    <tr>
                                        <td className="text-center"><strong>Salariu Net: </strong>
                                            <span>{netSalary} {currency}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="text-center"><strong>Tichete de masă: </strong>
                                            <span>{ticketsValue * 90 / 100} {currency}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        );
    }

    handleFilter = () => {
        const payload = {
            username: sessionStorage.getItem('username'),
            year : this.state.year,
            month: this.state.month
        }
        let payslipID = payload.username + payload.year + payload.month
        fetch('http://localhost:8080/payslip/' + payslipID, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({
                            payslip: json,
                            bool: false
                        });
                    });
                }
                else {
                    this.setState({
                        message: "Nu există fluturaș de salariu pentru datele introduse. Reîncercați!",
                        showAlert: true
                    });
                }
            })
    }

    render(){
        const {yearOptions, monthOptions} = this.state;
        return (
            <CardDeck className="justify-content-center d-flex align-items-center align-middle mt-3 col-auto">
                <Row>
                    <Col sm={6}>
                        <Form className="ml-2">
                            <Form.Group>
                                <Form.Label className="text-white font-weight-bold">An</Form.Label>
                                <Form.Control as="select" custom name="year" onChange={this.handleChange}>
                                    <option value="">Selectează anul...</option>
                                    {yearOptions ? yearOptions.map((year, index) => (
                                            <option key={index} value={year}>
                                                {year}
                                            </option>
                                        ))
                                        : ""}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col sm={6}>
                        <Form.Group>
                            <Form.Label className="text-white font-weight-bold">Lună</Form.Label>
                            <Form.Control as="select" custom name="month" onChange={this.handleChange}>
                                <option value="">Selectează luna...</option>
                                {monthOptions ? monthOptions.map((month, index) => (
                                        <option key={index} value={month}>
                                            {month}
                                        </option>
                                    ))
                                    : ""}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={12} className="text-center">
                        <Button className="my-btn my-2 col-sm-8" onClick={this.handleFilter}>Vizualizare</Button>
                    </Col>
                </Row>
                <Modal show={this.state.showAlert} onHide={this.closeAlert} centered>
                    <Modal.Header>Notificare</Modal.Header>
                    <Modal.Body>
                        {this.state.message}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.closeAlert}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                {this.state.bool ? null : this.renderPayslip(this.state.payslip)}
            </CardDeck>
    );
    }
}
