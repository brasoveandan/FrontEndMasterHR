import React from "react";
import {Button, Card, Col, Container, Form, FormGroup, Modal, Row, Table} from "react-bootstrap";
import {FaBan, FaCheck, FaHourglassStart, FaTimes, FaTrash} from "react-icons/all";
import SearchBox from "../common/SearchBox";
import * as Joi from "joi-browser";
import MyForm from "../common/MyForm";
import {requestOptions} from "../common/MySelect";
import {Typeahead} from "react-bootstrap-typeahead";
import {paginate} from "../utils/pagination";
import ReactPaginate from "react-paginate";

export default class ViewHoliday extends MyForm{
    constructor(props){
        super(props);
        this.state = {
            holidays: [],
            holidayDetails: [],
            requestDetails: [],
            summary:[],
            users: [],
            originalData: [],
            currentPage: 1,
            offset: 0,
            perPage: 5,
            pageCount: 0,

            searchQuery: "",
            proxyUsername: "",
            data: {
                reason: "",
                fromDate: "",
                toDate: "",
                type: ""
            },
            errors: {},

            show: false,
            showDetailsModal: false,
            showDeleteModal: false,
            showAlert: false,
            message: ""
        };

        this.handleChange = this.handleChange.bind(this)
        this.loadData()
    }

    schema = {
        reason: Joi.string().optional().allow(""),
        fromDate: Joi.date().iso().required().error(() => {return {message: "Data de început este obligatorie."}}),
        toDate: Joi.date().iso().required().error(() => {return {message: "Data de sfârșit este obligatorie."}}),
        type: Joi.string().required().error(() => {return {message: "Trebuie selectat tipul cererii."}})
    }

    loadData = () => {
        const payload = {
            username: sessionStorage.getItem('username'),
            jwt: sessionStorage.getItem("jwt")
        }

        fetch('http://localhost:8080/holiday/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.jwt
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    const data = json;
                    let slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        originalData: json,
                        holidays: slice
                    })
                });
            }
            else
                this.setState({
                    holidays: []
                })
        })

        fetch('http://localhost:8080/summaryHoliday/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.jwt
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    this.setState({summary: json});
                });
            }
            else
                this.setState({
                    summary: []
                })
        })

        fetch('http://localhost:8080/contract', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + payload.jwt
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    let arrayUser = []
                    let yourData = [];
                    for (const element of json) {
                        if (element.username === payload.username) {
                            yourData = element
                            break
                        }
                    }
                    json.forEach(elem => {
                        if (elem.username !== yourData.username && elem.department === yourData.department)
                            arrayUser.push(elem)
                    })
                    this.setState({users: arrayUser});
                });
            }
        })
    }

    handleSearch = query => {
        this.setState({ searchQuery: query});
    };

    openDetailsModal = holiday => {
        fetch('http://localhost:8080/getRequest/' + holiday.idRequest, {
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
                            holidayDetails: holiday,
                            requestDetails: json,
                            showDetailsModal: true
                        })
                    });
                }
                else
                    this.setState({
                        holidayDetails: holiday,
                        requestDetails: [],
                        showDetailsModal: true
                    })
            })
    }

    openModal = () => {
        const payload = {
            reason: "",
            fromDate: "",
            toDate: "",
            type: ""
        }
        this.setState({
            show: true,
            data: payload,
            proxyUsername: ""
        });
    }

    openDeleteModal = holiday => {
        this.setState({
            holidayDetails: holiday,
            showDeleteModal: true
        });
    }

    closeModal = () => {
        this.setState({
            show: false,
            showDetailsModal: false,
            showDeleteModal: false,
        });
    };

    closeAlert = () => {
        this.setState({
            showAlert: false
        });
    };

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    doSubmit = () => {
        const payload = {
            usernameEmployee : sessionStorage.getItem("username"),
            status : "PENDING",
            submittedDate : new Date(),
            proxyUsername : this.state.proxyUsername,
            description: this.state.data.reason,
            fromDate: this.state.data.fromDate,
            toDate: this.state.data.toDate,
            type: this.state.data.type
        }

        fetch('http://localhost:8080/request', {
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
                    showAlert: true,
                    message: "Cererea a fost adăugată cu succes!"
                })
                this.closeModal()
                this.loadData()
            }
            else
                if (res.status === 417) {
                    res.text().then(text =>{
                        this.setState({
                            showAlert: true,
                            message: text + "Cererea nu a fost adăugată."
                        })
                });
            }
            else
                if (res.status === 409) {
                    res.text().then(text =>{
                        this.setState({
                            showAlert: true,
                            message: "Există deja o cerere de concediu pentru datele introduse."
                        })
                    });
                }
            else
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
        })
    }

    handleDeleteRequest = () => {
        const {user, fromDate, toDate} = this.state.holidayDetails
        const payload = {
            idHoliday: user + fromDate + toDate
        }
        fetch('http://localhost:8080/holiday/' + payload.idHoliday, {
            method: 'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
        })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        showAlert: true,
                        message: "Cererea a fost ștearsă!"
                    })
                    this.closeModal()
                    this.loadData()
                }
                else if(res.status === 417){
                    res.text().then(text =>{
                        this.setState({
                            showAlert: true,
                            message: text + " Cererea nu a fost ștearsă!"
                        })
                    });
                }
                else
                    this.setState({
                        showAlert: true,
                        message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                            "masterhr.contact@gmail.com. Mulțumim!"
                    })
            })
    }

    handlePageClick = (e) => {
        const selectedPage = e.selected + 1;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData()
        });
    };

    loadMoreData() {
        const data = this.state.originalData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            holidays: slice
        })
    }

    getPagedData = () => {
        const {
            holidays: allHolidays,
            perPage,
            currentPage,
            searchQuery
        } = this.state;

        let filtered = allHolidays;
        if (searchQuery)
            filtered = allHolidays.filter(holiday =>
                holiday.fromDate.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        const pageCount = Math.ceil(filtered.length / this.state.perPage)
        const result = paginate(filtered, currentPage, perPage)

        return { holidays: result, pageCount };
    };

    render(){
        const { holidays, pageCount } = this.getPagedData();
        let {daysTaken, daysAvailable, medicalLeave, otherLeave, overtimeLeave} = this.state.summary;
        let {user, idRequest, fromDate, toDate, numberOfDays, proxyUsername, type, status, reason} = this.state.requestDetails;
        const today = new Date();
        return (
            <Card className="mt-4 mb-4 ml-md-5 ml-xl-0 justify-content-center" style={{opacity: ".85"}}>
                <Card.Header className="my-label bg-dark text-center text-monospace">
                    <h4>Vizualizare Concedii</h4>
                </Card.Header>
                <Row>
                    <Col sm={3}>
                        <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                            <h6>Concediu Anual disponibil</h6>
                            <h4><strong>{daysAvailable - daysTaken} <small>/ {daysAvailable} zile</small></strong></h4>
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                            <h6>Total Zile Concediu Medical</h6>
                            {(Number(medicalLeave) > 0) ? <h4>{(Number(medicalLeave) > 1) ? medicalLeave + " zile" : "1 zi"}</h4> : <h4><FaTimes/></h4>}
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                            <h6>Concediu din Ore Suplimentare</h6>
                            {(Number(overtimeLeave) > 0) ? <h4>{(Number(overtimeLeave) > 1) ? overtimeLeave + " ore" : "1 oră"}</h4> : <h4><FaTimes/></h4>}
                        </div>
                    </Col>
                    <Col sm={3}>
                        <div className="stats-info m-2 rounded h-100 bg-dark text-white">
                            <h6>Total Alte Tipuri Concedii</h6>
                            {(Number(otherLeave) > 0) ? <h4>{(Number(otherLeave) > 1) ? otherLeave + " zile" : "1 zi"}</h4> : <h4><FaTimes/></h4>}
                        </div>
                    </Col>
                </Row>
                <Row className="align-self-center">
                    <Col sm={10}>
                        <SearchBox placeholder="Caută după dată început" value={this.state.searchQuery} onChange={this.handleSearch}/>
                    </Col>
                    <Col sm={10} className="text-center">
                        <Button className="my-btn mb-3" type="button" onClick={this.openModal}>
                            Adaugă Cerere Concediu
                        </Button>
                    </Col>
                </Row>
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
                                <td onClick={(e) => this.openDetailsModal(holiday, e)}>
                                    {(this.state.currentPage - 1) * this.state.perPage + index + 1}
                                </td>
                                <td onClick={(e) => this.openDetailsModal(holiday, e)}>{holiday.type}</td>
                                <td onClick={(e) => this.openDetailsModal(holiday, e)}>{holiday.fromDate}</td>
                                <td onClick={(e) => this.openDetailsModal(holiday, e)}>{holiday.toDate}</td>
                                <td onClick={(e) => this.openDetailsModal(holiday, e)} className="text-center">{holiday.numberOfDays}</td>
                                <td onClick={(e) => this.openDetailsModal(holiday, e)} className="text-center">{holiday.proxyUsername ? holiday.proxyUsername : <FaTimes/>}</td>
                                <td onClick={(e) => this.openDetailsModal(holiday, e)} className="font-weight-bold">{holiday.status}</td>
                                <td className="text-center">
                                    <Button disabled={holiday.type === "Concediu medical" || new Date(holiday.toDate).getMonth() != today.getMonth()} type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" onClick={(e) => this.openDeleteModal(holiday, e)}><FaTrash/></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    :
                    <Modal.Header className="bg-dark text-white font-weight-bold">Nu există cereri de concediu înregistrate.</Modal.Header>
                }
                <ReactPaginate
                    previousClassName={this.state.currentPage === 1 ? "invisible" : "visible"}
                    nextClassName={pageCount === this.state.currentPage || holidays.length < this.state.perPage ? "invisible" : "visible"}
                    containerClassName={holidays.length > 0 && pageCount > 1 ? "pagination visible" : "invisible"}
                    previousLabel={"← Înapoi"}
                    nextLabel={"Mai Departe →"}
                    pageCount={pageCount}
                    onPageChange={this.handlePageClick}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />
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
                                            {this.renderSelect("form-control", "type", "Tip cerere", requestOptions)}
                                            {this.renderInput("form-control", "fromDate", "Din data", "data", "date")}
                                            {this.renderInput("form-control", "toDate", "Pâna la data", "data", "date")}
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
                                            {this.renderTextarea("form-control", "reason", "Motiv", "Pe scurt...", "4")}
                                            <div className="text-center" onClick={(e) => this.handleSubmit("", e)}>
                                                {this.renderButton("my-btn", "Trimite", "button")}
                                            </div>
                                        </Form>
                                    </Card.Body>
                                </Card.Header>
                            </Card>
                        </Container>
                    </Modal.Body>
                </Modal>
                <Modal backdrop="static" keyboard={false} show={this.state.showDetailsModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detalii cerere de concediu</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body className="bg-light rounded">
                            <Row>
                                <Col sm={12}>
                                    <h4 className="m-b-10 mb-3 text-center text-dark">Cerere Concediu
                                        <span className="text-muted ml-2">
                                            #{idRequest}
                                        </span>
                                    </h4>
                                    <h5 className="m-b-10 mb-3 text-center text-dark">
                                        Status:
                                        {status === "RESPINS" ? <FaTimes className="align-middle"/> : ""}
                                        {status === "ACCEPTAT" ? <FaCheck className="align-middle"/> : ""}
                                        {status === "IN ASTEPTARE" ? <FaHourglassStart className="align-middle"/> : ""}
                                    </h5>
                                    <Table hover className="list-group-flush text-dark">
                                        <tbody>
                                        <tr>
                                            <td><strong>Nume de utilizator: </strong>
                                                <span className="float-right">{user}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Tip: </strong>
                                                <span className="float-right">{type}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>De la: </strong>
                                                <span className="float-right">{fromDate}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Până la: </strong>
                                                <span className="float-right">{toDate}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Număr zile: </strong>
                                                <span className="float-right">{numberOfDays}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Înlocuitor: </strong>
                                                {proxyUsername ?
                                                    <span className="float-right">{proxyUsername}</span>
                                                    :
                                                    <span className="float-right"><FaBan/></span>
                                                }
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Motiv: </strong>
                                                {reason ?
                                                    <span className="float-right">{reason}</span>
                                                    :
                                                    <span className="float-right"><FaBan/></span>
                                                }
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Modal.Body>
                </Modal>
                <Modal backdrop="static" keyboard={false} show={this.state.showDeleteModal} onHide={this.closeModal} centered>
                    <Modal.Header>
                        <Modal.Title>
                            Șterge cerere
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Doriți să continuați?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-success" onClick={this.handleDeleteRequest}>Da</Button>
                        <Button className="btn-danger" onClick={this.closeModal}>Nu</Button>
                    </Modal.Footer>
                </Modal>
            </Card>
        );
    }
}
