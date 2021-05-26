import React from "react";
import {Button, Card, Col, Container, Form, FormGroup, Modal, Row, Table} from "react-bootstrap";
import {FaBan, FaTimes, FiEdit} from "react-icons/all";
import { Typeahead } from 'react-bootstrap-typeahead';
import SearchBox from "../components/utils/searchBox";

export default class ViewHoliday extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            holidays: [],
            summary:[],
            users: [],
            show: false,
            searchQuery: "",
            reason: "",
            fromDate: "",
            toDate: "",
            value: "",
            proxyUsername: "",
            showAlert: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this)
        this.handleAdaugaCerere = this.handleAdaugaCerere.bind(this)

        this.loadData()
    }

    loadData = () => {
        const payload = {
            username: localStorage.getItem('username')
        }

        fetch('http://localhost:8080/holiday/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    this.setState({holidays: json});
                });
            }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { console.log(error)} );

        fetch('http://localhost:8080/summaryHoliday/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    this.setState({summary: json});
                });
            }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { console.log(error)} );

        fetch('http://localhost:8080/employee', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    this.setState({users: json});
                });
            }
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => { console.log(error)} );
    }

    handleSearch = query => {
        this.setState({ searchQuery: query});
    };

    openModal = () => {
        this.setState({
            show: true
        });
    }

    closeModal = () => {
        this.setState({
            show: false,
            showAlert: false
        });
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleAdaugaCerere() {
        const payload = {
            usernameEmployee: localStorage.getItem("username"),
            description: this.state.reason,
            status: "PENDING",
            submittedDate: new Date(),
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            type: this.state.value,
            proxyUsername: this.state.proxyUsername
        }
        console.log(payload)
        fetch('http://localhost:8080/request', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.status === 417) {
                    res.json().then(json =>{
                        console.log(json)
                    });
                }
                else if (res.status === 200)
                    console.log("SUCCES")
                else {
                    console.log("error")
                }
            })
    }

    getPagedData = () => {
        const {
            searchQuery,
            holidays: allHolidays
        } = this.state;

        let filtered = allHolidays;
        if (searchQuery)
            filtered = allHolidays.filter(holiday =>
                holiday.fromDate.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        return { holidays: filtered };
    };

    render(){
        const { holidays } = this.getPagedData();
        let {daysTaken, daysAvailable, medicalLeave, otherLeave, overtimeLeave} = this.state.summary;

        return (
            <Card className="my-md-4 my-2 ml-md-5 ml-xl-0 d-flex justify-content-center" style={{opacity: ".85"}}>
                    <Card.Header className="my-label bg-dark text-center text-monospace">
                        <h4>Vizualizare Concedii</h4>
                    </Card.Header>
                    <Row>
                        <Col sm={3}>
                            <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                                <h6>Concediu Anual disponibil</h6>
                                { ({daysAvailable} - {daysTaken} > 0) ? <h4><strong>{daysAvailable - daysTaken} <small>/ {daysAvailable} zile</small></strong></h4> : <h4><FaTimes/></h4>}
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                                <h6>Total Zile Concediu Medical</h6>
                                {({medicalLeave}>0) ? <h4>{({medicalLeave}>1) ? {medicalLeave} + "zile" : "1 zi"}</h4> : <h4><FaTimes/></h4>}
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                                <h6>Concediu din Ore Suplimentare</h6>
                                {({overtimeLeave} > 0) ? <h4>{overtimeLeave}</h4> : <h4><FaTimes/></h4>}
                            </div>
                        </Col>
                        <Col sm={3}>
                            <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                                <h6>Total Alte Tipuri Concedii</h6>
                                {({otherLeave}>0) ? <h4>{({otherLeave}>1) ? {otherLeave} + "zile" : "1 zi"}</h4> : <h4><FaTimes/></h4>}
                            </div>
                        </Col>
                    </Row>
                    <Row className="align-self-center">
                        <Col sm={10}>
                            <SearchBox disable={!(holidays.length > 0)} placeholder="Caută după dată început" value={this.state.searchQuery} onChange={this.handleSearch}/>
                        </Col>
                        <Col sm={10} className="text-center">
                            <Button className="my-btn mb-3" type="button" onClick={this.openModal}>
                                Adaugă Cerere Concediu
                            </Button>
                        </Col>
                    </Row>
                    <Modal backdrop="static" keyboard={false} show={this.state.show} onHide={this.closeModal}>
                        <Modal.Header closeButton>
                            <Modal.Title>Adaugă cerere de concediu</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Container fluid className="mb-3 mt-3">
                                <Card>
                                    <Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <FormGroup>
                                                    <label>Tip cerere <span className="text-danger">*</span></label>
                                                    <select className="form-control" aria-hidden="true" value={this.state.value} name="value" onChange={this.handleChange}>
                                                        <option>Selectează tipul</option>
                                                        <option value="Concediu normal anual">Concediu anual</option>
                                                        <option value="Concediu pentru donare sange">Concediu pentru donare sange</option>
                                                        <option value="Concediu pentru pariticipare la funerali">Concendiu pentru pariticipare la funerali</option>
                                                        <option value="Concediu pentru pariticipare la nunta">Concendiu pentru pariticipare la nunta</option>
                                                        <option value="Concediu din ore suplimentare">Concendiu din ore suplimentare</option>
                                                    </select>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Form.Label>Din data<span className="text-danger">*</span></Form.Label>
                                                    <input className="form-control" type="date" name="fromDate" onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Form.Label>Pâna la data<span className="text-danger">*</span></Form.Label>
                                                    <input className="form-control" type="date" name="toDate" onChange={this.handleChange}/>
                                                </FormGroup>
                                                <FormGroup>
                                                    <Form.Label>Înlocuitor</Form.Label>
                                                    <Typeahead
                                                        id="basic-typeahead-single"
                                                        labelKey="username"
                                                        onChange={e => this.setState({proxyUsername: e[0]})}
                                                        options={this.state.users.map((el) =>
                                                            (
                                                                el.username
                                                            )
                                                        )}
                                                        placeholder="Nume de utilizator"
                                                    />
                                                </FormGroup>
                                                <FormGroup>
                                                    <Form.Label>Motiv <span className="text-danger">*</span></Form.Label>
                                                    <textarea rows="4" className="form-control" placeholder="Pe scurt..." name="reason" onChange={this.handleChange}/>
                                                </FormGroup>
                                                <div className="submit-section text-center">
                                                    <button className="my-btn" type="button" onClick={this.handleAdaugaCerere}>Trimite</button>
                                                </div>
                                            </Form>
                                        </Card.Body>
                                    </Card.Header>
                                </Card>
                            </Container>
                        </Modal.Body>
                    </Modal>
                    {holidays.length > 0 ?
                        <Table responsive hover striped borderless className="text-nowrap">
                            <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Tip Concediu</th>
                                <th>De la</th>
                                <th>Pâna la</th>
                                <th>Număr zile</th>
                                <th>Înlocuitor</th>
                                <th>Status</th>
                                <th>Acțiune</th>
                            </tr>
                            </thead>
                            <tbody>
                            {holidays.map((holiday, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{holiday.type}</td>
                                    <td>{holiday.fromDate}</td>
                                    <td>{holiday.toDate}</td>
                                    <td className="text-center">{holiday.numberOfDays}</td>
                                    <td className="text-center">{holiday.proxyUsername ? holiday.proxyUsername : <FaTimes/>}</td>
                                    <td className="font-weight-bold">{holiday.status}</td>
                                    <td className="text-center">
                                        <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează"><FiEdit/></Button>
                                        <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" data-type="confirm"><FaBan/></Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        :
                        <Modal.Header className="bg-dark text-white font-weight-bold">Nu există cereri de concediu înregistrate.</Modal.Header>
                    }
                </Card>
        );
    }
}
