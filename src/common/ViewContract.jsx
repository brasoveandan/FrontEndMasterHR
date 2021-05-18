import React from "react";
import {FaCheck, FaTimes} from "react-icons/all";
import {Card, CardDeck, Col, Row, Table} from "react-bootstrap";

export default class ViewContract extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            contract: []
        };

        this.renderContract = this.renderContract.bind(this);

        const payload = {
            username: localStorage.getItem('username')
        }

        fetch('http://localhost:8080/contract/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({contract: json});
                    });
                    // LOGIN PERSISTANCE
                }
                else {
                    console.log("error")
                    console.log(payload.username)
                }
            })
    }

    renderContract = (contract) => {
        let {firstName, lastName, companyName, personalNumber, socialSecurityNumber, phoneNumber , mail, birthday, gender, bankName, bankAccountNumber, department, position, baseSalary, currency, type, hireDate, expirationDate, overtimeIncreasePercent, taxExempt} = contract;
        if(expirationDate == null){
            expirationDate = false
        }
        return(
            <Col xs={12} sm={12} className="col-xs-12 col-sm-12 d-flex justify-content-md-center">
                <Card className="text-left mb-md-4 mt-md-4 ml-xl-0" style={{opacity: ".85"}} >
                    <Card.Header className="text-center text-monospace my-label bg-dark">
                       <h4>Detalii Contract</h4>
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col sm={6} className="m-b-20">
                                <ul className="list-unstyled">
                                    <li><h5 className="mb-2"><strong>{lastName} {firstName}</strong></h5></li>
                                    <li><h6>Număr personal: {personalNumber}</h6></li>
                                    <li><h6>Departament: {department}</h6></li>
                                    <li><h6>Poziție: {position}</h6></li>
                                </ul>
                            </Col>
                            <Col sm={6} className="m-b-20">
                                <ul className="list-unstyled">
                                    <li><h5 className="mb-2"><strong>{companyName}</strong></h5></li>
                                </ul>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <h4 className="m-b-10 mb-3"><strong>Informații Personale</strong></h4>
                                <Table hover className="list-group-item-dark">
                                    <tbody>
                                    <tr>
                                        <td><strong>E-mail: </strong>
                                            <span className="float-right">{mail}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Număr de telefon: </strong>
                                            <span className="float-right">{phoneNumber}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cod numeric personal: </strong>
                                            <span className="float-right">{socialSecurityNumber}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Zi de naștere: </strong>
                                            <span className="float-right">{birthday}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Gen: </strong>
                                            <span className="float-right">{gender}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={12}>
                                <h5 className=" m-b-10 mb-3"><strong>Informații Contractuale</strong></h5>
                                <Table hover className="list-group-item-dark">
                                    <tbody>
                                    <tr>
                                        <td><strong>Dată angajare: </strong>
                                            <span className="float-right">{hireDate}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Salar de bază: </strong>
                                            <span className="float-right">{baseSalary}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Valută: </strong>
                                            <span className="float-right">{currency}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Tip contract: </strong>
                                            <span className="float-right">{type}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Procent spor ore suplimentare: </strong>
                                            <span className="float-right">{overtimeIncreasePercent} %</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Scutit impozit: </strong>
                                            <span className="float-right">{taxExempt ? <FaCheck/> : <FaTimes/>}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Dată expirare contract: </strong>
                                            <span className="float-right">{expirationDate ? expirationDate : <FaTimes/>}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                                </Col>
                            </Row>
                        <Row>
                            <Col sm={12}>
                                <h5 className="m-b-10 mb-3"><strong>Informații Bancare</strong></h5>
                                <Table hover className="list-group-item-dark">
                                    <tbody>
                                    <tr>
                                        <td><strong>Nume Bancă: </strong>
                                            <span className="float-right">{bankName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><strong>Cont bancar: </strong>
                                            <span className="float-right">{bankAccountNumber}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    render(){
        return (
            <CardDeck className="justify-content-center d-flex align-items-center align-middle mt-3">
                {this.renderContract(this.state.contract)}
            </CardDeck>
        );
    }
}
