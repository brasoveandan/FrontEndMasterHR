import React from "react";
import {Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import {FaBan, FaCheck, FaTimes, FiEdit} from "react-icons/all";

export default class ViewHoliday extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            payslip: []
        };

        const payload = {
            username: localStorage.getItem('username')
        }

        fetch('http://localhost:8080/payslip/' + payload.username, {
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

    render(){
        const zile = 3
        return (
            <Container fluid>
                <Row className="mt-md-4 mt-2 mb-md-4 ml-md-5 ml-xl-0" style={{opacity: ".85"}}>
                    <Card>
                        <Card.Header className="my-label bg-dark text-center text-monospace">
                            <h4>Vizualizare Concedii</h4>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col sm={3}>
                                    <div className="stats-info rounded-circle bg-dark text-white">
                                        <h6>Concediu Anual</h6>
                                        <h4><strong>10 <small>/ 24 zile</small></strong></h4>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="stats-info rounded-circle bg-dark text-white">
                                        <h6>Concediu Medical</h6>
                                        {(1>0) ? <h4>{(1>1) ? "3 zile" : "1 zi"}</h4> : <h4><FaTimes/></h4>}
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    <div className="stats-info rounded-circle bg-dark text-white">
                                        <h6>Ore Suplimentare</h6>
                                        <h4><strong>5 <small>/ 20 ore</small></strong></h4>
                                    </div>
                                </Col>
                                <Col sm={3}>
                                    {console.log(zile)}
                                    <div className="stats-info rounded-circle bg-dark text-white">
                                        <h6>Alte Concedii</h6>
                                        {({zile}>0) ? <h4>{({zile}>1) ? {zile} + "zile" : "1 zi"}</h4> : <h4><FaTimes/></h4>}
                                    </div>
                                </Col>
                            </Row>
                            <Row>
                               <Col className="text-center">
                                   <Button type="button" className="my-btn mb-4 mt-2">
                                       Adaugă Cerere Concediu
                                   </Button>
                               </Col>
                            </Row>
                            <Row>
                                <Table responsive hover striped borderless className="">
                                    <thead className="bg-dark text-white">
                                    <tr>
                                        <th>#</th>
                                        {/*{Array.from({ length: 12 }).map((_, index) => (*/}
                                        {/*    <th key={index}>Table heading</th>*/}
                                        {/*))}*/}
                                        <th>Tip Concediu</th>
                                        <th>De la</th>
                                        <th>Pâna la</th>
                                        <th>Număr zile</th>
                                        <th>Înlocuitor</th>
                                        <th>Motiv</th>
                                        <th>Status</th>
                                        <th>Acțiune</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td>1</td>
                                        {Array.from({ length: 7 }).map((_, index) => (
                                            <td key={index}>Table cell {index}</td>
                                        ))}
                                        <td className="text-center">
                                            <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează"><FiEdit/></Button>
                                            <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" data-type="confirm"><FaBan/></Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>2</td>
                                        {Array.from({ length: 7 }).map((_, index) => (
                                            <td key={index}>Table cell {index}</td>
                                        ))}
                                        <td className="text-center">
                                            <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează"><FiEdit/></Button>
                                            <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" data-type="confirm"><FaBan/></Button>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>3</td>
                                        {Array.from({ length: 7 }).map((_, index) => (
                                            <td key={index}>Table cell {index}</td>
                                        ))}
                                        <td className="text-center">
                                            <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează"><FiEdit/></Button>
                                            <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" data-type="confirm"><FaBan/></Button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </Table>
                            </Row>
                        </Card.Body>
                        </Card>
                </Row>
            </Container>
        );
    }
}
