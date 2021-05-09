import React from "react";
import {Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import {FaTimes, MdEdit} from "react-icons/all";

export default class ViewRequest extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            requests: []
        };

        const payload = {
            username: localStorage.getItem('username')
        }

        fetch('http://localhost:8080/request/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type': 'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({requests: json});
                    });
                }
                else {
                    console.log("error")
                    console.log(payload.username)
                }
            })
    }

    handleFilter() {

    }

    render(){
        return (
            <Container fluid>
                <Row className="mt-4 mb-4 ml-md-5 ml-xl-0 justify-content-center" style={{opacity: ".85"}}>
                    <Card>
                        <Card.Header className="my-label bg-dark text-center text-monospace">
                            <h4>Vizualizare Cereri - {localStorage.getItem('username')}</h4>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col>
                                    <Button type="button" className="my-btn mb-4 mt-2">
                                        Adaugă Cerere Nouă
                                    </Button>
                                </Col>
                                <Col sm={4}>
                                    <input className="form-control mb-4 mt-2" type="search" placeholder="Caută..." onChange={this.handleFilter}/>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <Table responsive hover striped borderless className="text-nowrap">
                                        <thead className="bg-dark text-white">
                                        <tr>
                                            <th>#</th>
                                            <th>Tip Cerere</th>
                                            <th>Dată</th>
                                            <th>Descriere</th>
                                            <th>Status</th>
                                            <th>Acțiune</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {this.state.requests.map((elem, index) => (
                                            <tr>
                                                <td>{index + 1}</td>
                                                {/*{Array.from({ length: 4 }).map((_, index) => (*/}
                                                {/*    <td key={index}>Table cell {index}</td>*/}
                                                {/*))}*/}
                                                <td>{elem.type}</td>
                                                <td>{elem.submittedDate}</td>
                                                <td>{elem.description}</td>
                                                <td className="font-weight-bold">{elem.status}</td>
                                                <td className="text-center">
                                                    <Button type="button" size={"sm"} className=" mr-2 btn-success" title="Editează"><MdEdit/></Button>
                                                    <Button type="button" size={"sm"} className="mr-2 btn-danger" title="Șterge" data-type="confirm"><FaTimes/></Button>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Row>
            </Container>
        );
    }
}
