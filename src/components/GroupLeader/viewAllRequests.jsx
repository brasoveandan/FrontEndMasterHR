import React from "react";
import {Button, Card, Col, Modal, Row, Table} from "react-bootstrap";
import {FaBan, FaCheck, FaHourglassStart, FaTimes} from "react-icons/all";
import ReactPaginate from "react-paginate";
import {paginate} from "../../utils/pagination";
import SearchBox from "../../common/SearchBox";

export default class ViewAllRequests extends React.Component {
    constructor(){
        super(undefined);
        this.state = {
            requests: [],
            originalData: [],
            currentPage: 1,
            offset: 0,
            perPage: 10,
            pageCount: 0,
            requestDetails: "",
            searchQuery: "",
            showAlert: false,
            showDetailsModal: false,
            showModifyRequestModal: false,
            modifyRequestModalTitle: "",
            modifyRequestModalContent: "",
            modifyRequestPayload: {},
            message: ""
        };

        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.loadData()
    }

    loadData = () => {
        fetch('http://localhost:8080/holidayRequest/' + sessionStorage.getItem("username"), {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type': 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            }
        })
        .then(res => {
            if (res.status === 200) {
                res.json().then(json =>{
                    let array = []
                    let yourData = [];
                    for (const element of json) {
                        if (element.user === sessionStorage.getItem("username")) {
                            yourData = element
                            break
                        }
                    }
                    json.forEach(elem => {
                        if (elem.user !== yourData.user)
                            array.push(elem)
                    })
                    const data = array;
                    let slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        originalData: array,
                        requests: slice
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

    openDetailsModal = request => {
        this.setState({
            showDetailsModal: true,
            requestDetails: request
        })
    }

    closeModal = () => {
        this.setState({
            showModifyRequestModal: false,
            showDetailsModal: false
        })
    }

    closeAlert = () => {
        this.setState({showAlert: false})
    }

    handleSearch = query => {
        this.setState({ searchQuery: query, currentPage: 1});
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
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

    loadMoreData = () => {
        const data = this.state.originalData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            accounts: slice
        })
    }

    getPagedData = () => {
        const {
            originalData: allRequests,
            perPage,
            currentPage,
            searchQuery
        } = this.state;

        let filtered = allRequests;
        if (searchQuery)
            filtered = allRequests.filter(request =>
                request.user.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        const pageCount = Math.ceil(filtered.length / this.state.perPage)
        const result = paginate(filtered, currentPage, perPage);
        return { requests: result, pageCount };
    }

    handleModifyRequest = payload => {
        fetch('http://localhost:8080/request', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type': 'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(payload)
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    showAlert: true,
                    message: "Statusul cererii a fost modificat cu succes."
                })
                this.closeModal()
                this.loadData()
            }
            else if(res.status === 417) {
                res.text().then(text =>{
                    this.setState({
                        showAlert: true,
                        message: text + " Statusul cererii rămâne nemodificat."
                    })
                });
            }
            else if (res.status === 409) {
                this.setState({
                    showAlert: true,
                    message: "Cererea a fost deja revizuită."
                })
                this.closeModal()
            }
            else {
                this.setState({
                    showAlert: true,
                    message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                        "masterhr.contact@gmail.com. Mulțumim!"
                })
                this.closeModal()
            }
        })
    }

    handleAccept = request => {
        const payload = {
            idRequest: request.idRequest,
            status: "ACCEPTED",

        }
        this.setState({
            showModifyRequestModal: true,
            modifyRequestModalTitle: "Confirmare cerere",
            modifyRequestModalContent: "Doriți să acceptați cererea de concediu?",
            modifyRequestPayload: payload
        })
    }

    handleDecline = request => {
        const payload = {
            idRequest: request.idRequest,
            status: "DECLINED",

        }
        this.setState({
            showModifyRequestModal: true,
            modifyRequestModalTitle: "Respinge cerere",
            modifyRequestModalContent: "Doriți să respingeți cererea de concediu?",
            modifyRequestPayload: payload
        })
    }

    render(){
        const { requests, pageCount } = this.getPagedData();
        let {user, idRequest, fromDate, toDate, numberOfDays, proxyUsername, type, status, reason} = this.state.requestDetails;
        return (
            <Card className="mt-4 mb-4 ml-md-5 ml-xl-0 justify-content-center" style={{opacity: ".85"}}>
                <Card.Header className="my-label bg-dark text-center text-monospace">
                    <h4>Vizualizare Cereri Angajați</h4>
                </Card.Header>
                <Card.Body>
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
                    <SearchBox placeholder="Caută după nume de utilizator..." value={this.state.searchQuery} onChange={this.handleSearch}/>
                    {requests.length > 0 ?
                        <Table responsive hover striped borderless className="text-nowrap">
                            <thead className="bg-dark text-white">
                            <tr>
                                <th>#</th>
                                <th>Utilizator</th>
                                <th>Tip Cerere</th>
                                <th>De la</th>
                                <th>Până la</th>
                                <th>Status</th>
                                <th>Acțiune</th>
                            </tr>
                            </thead>
                            <tbody>
                            {requests.map((request, index) => (
                                <tr key={index}>
                                    <td onClick={(e) => this.openDetailsModal(request, e)}>{(this.state.currentPage - 1) * this.state.perPage + index + 1}</td>
                                    <td onClick={(e) => this.openDetailsModal(request, e)}>{request.user}</td>
                                    <td onClick={(e) => this.openDetailsModal(request, e)}>{request.type}</td>
                                    <td onClick={(e) => this.openDetailsModal(request, e)}>{request.fromDate}</td>
                                    <td onClick={(e) => this.openDetailsModal(request, e)}>{request.toDate}</td>
                                    <td className="font-weight-bold" onClick={(e) => this.openDetailsModal(request, e)}>{request.status}</td>
                                    <td>
                                        <Button type="button" size={"sm"} className=" mr-2 btn-success" title="Confirmă" disabled={request.status !== "IN ASTEPTARE"}
                                                onClick={(e) => this.handleAccept(request, e)}><FaCheck/></Button>
                                        <Button type="button" size={"sm"} className="mr-2 btn-danger" title="Respinge" disabled={request.status !== "IN ASTEPTARE"}
                                                onClick={(e) => this.handleDecline(request, e)}><FaTimes/></Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    :
                        <Modal.Header className="bg-dark text-white font-weight-bold">Nu există nicio cerere înregistrată.</Modal.Header>
                    }
                    <ReactPaginate
                        previousClassName={this.state.currentPage === 1 ? "invisible" : "visible"}
                        nextClassName={pageCount === this.state.currentPage || requests.length < this.state.perPage ? "invisible" : "visible"}
                        containerClassName={requests.length > 0 && pageCount > 1 ? "pagination visible" : "invisible"}
                        previousLabel={"← Înapoi"}
                        nextLabel={"Mai Departe →"}
                        pageCount={pageCount}
                        onPageChange={this.handlePageClick}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </Card.Body>
                <Modal show={this.state.showDetailsModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vizualizare Detalii Cerere Concediu</Modal.Title>
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
                                                <span className="float-right">{proxyUsername}</span>
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
                <Modal show={this.state.showModifyRequestModal} onHide={this.closeModal} centered>
                    <Modal.Header>
                        <Modal.Title>
                            {this.state.modifyRequestModalTitle}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.modifyRequestModalContent}
                    </Modal.Body>
                    <Modal.Footer>
                            <Button className="btn-success" onClick={() => this.handleModifyRequest(this.state.modifyRequestPayload)}>Da</Button>
                            <Button className="btn-danger" onClick={this.closeModal}>Nu</Button>
                    </Modal.Footer>
                </Modal>
            </Card>
        );
    }
}
