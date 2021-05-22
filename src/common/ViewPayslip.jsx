import React from "react";
import {FaTimes} from "react-icons/all";
import {Button, Card, CardDeck, Col, Modal, Row, Table} from "react-bootstrap";
import MyForm from "../components/utils/MyForm";
import * as Joi from "joi-browser";

export default class ViewPayslip extends MyForm{
    constructor(){
        super(undefined);
        this.state = {
            payslip: [],
            data: {
                year: "",
                month: ""
            },
            errors: {},
            bool: true,
            showAlert: false
        };

        this.renderPayslip = this.renderPayslip.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    schema = {
        year: Joi.string().required().error(() => {return {message: "Anul trebuie selectat."}}),
        month: Joi.string().required().error(() => {return {message: "Luna trebuie selectată."}}),
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
        let {year, month, idPayslip, firstName, lastName, companyName, personalNumber, department, position, baseSalary, currency, grossSalary, overtimeIncreases, increases, ticketsValue, workedHours, homeOfficeHours, requiredHours, overtimeHours, cas, cass, iv, taxExempt, netSalary} = payslip;
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
                                    <li><span>{department}</span></li>
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
                                                <span className="float-right"><strong>{baseSalary + ticketsValue + overtimeIncreases + increases} {currency}</strong></span>
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

    doSubmit = (action) => {
        const payload = {
            username: localStorage.getItem('username'),
            year : this.state.data.year,
            month: this.state.data.month
        }
        let payslipID = payload.username + payload.year + payload.month
        fetch('http://localhost:8080/payslip/' + payslipID, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
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
                        msg: "Nu există fluturaș de salariu pentru anul și luna introduse. Reîncercați!",
                        showAlert: true
                    });
                }
            })
    }

    render(){
        return (
            <CardDeck className="justify-content-center d-flex align-items-center align-middle mt-3 col-auto">
                {/*<input className="col-sm-2 mt-md-4 mb-2 ml-5 ml-lg-0 mr-5 rounded border" name="an" type="text" placeholder="An" onChange={this.handleChange}/>*/}
                {/*<input className="col-sm-2 mt-md-4 mb-2 ml-5 ml-md-0 mr-5 rounded border" name="luna" type="text" placeholder="Luna" onChange={this.handleChange}/>*/}
                {/*<Button className="my-btn mt-md-4 mb-2" onClick={this.handleFilter}>Vizualizare</Button>*/}
                {this.renderSelect("form-control ml-5 ml-md-0 mr-5", "year", "", ["2021"])}
                {this.renderSelect("form-control ml-5 ml-md-0 mr-5", "month", "", ["1", "2", "3"])}
                <div className="text-center" onClick={(e) => this.handleSubmit(null, e)}>
                    {this.renderButton("my-btn mt-md-4 mb-2", "VIZUALIZARE", "button")}
                </div>
                <Modal show={this.state.showAlert} onHide={this.closeAlert} centered close>
                    <Modal.Header>Notificare</Modal.Header>
                    <Modal.Body>
                        {this.state.msg}
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
