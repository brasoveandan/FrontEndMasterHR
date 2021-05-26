import React from "react";
import { Button, Card, Modal, Table} from "react-bootstrap";
import {FaCheck, FaTimes} from "react-icons/all";
import ReactPaginate from "react-paginate";
import {paginate} from "../utils/pagination";
import SearchBox from "../utils/searchBox";

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
            searchQuery: "",
            message: "",
            showAlert: false
        };

        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.loadData()
    }

    loadData() {
        fetch('http://localhost:8080/holidayRequest/' + localStorage.getItem("username"), {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type': 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
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
                        requests: slice
                    })
                });
            }
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
    };

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

        const result = paginate(filtered, currentPage, perPage);
        return { requests: result };
    }

    handleModifyRequest = payload => {
        fetch('http://localhost:8080/request', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type': 'application/json',
                'Authorization' : 'Bearer ' + localStorage.getItem("jwt")
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.status === 200) {
                    this.setState({
                        showAlert: true,
                        message: "Statusul cererii a fost modificat cu succes."
                    })
                    this.loadData()
                }
                else if(res.status === 417){
                    res.text().then(text =>{
                        this.setState({
                            showAlert: true,
                            message: text
                        })
                    });
                }
                else if (res.status === 409)
                    this.setState({
                        showAlert: true,
                        message: "Cererea este deja revizuită"
                    })
            })
    }

    handleAccept = request => {
        const payload = {
            idRequest: request.idRequest,
            status: "ACCEPTED"
        }
        this.handleModifyRequest(payload)
    }

    handleDecline = request => {
        const payload = {
            idRequest: request.idRequest,
            status: "DECLINED"
        }
        this.handleModifyRequest(payload)
    }

    render(){
        const { requests } = this.getPagedData();
        return (
            <Card className="mt-4 mb-4 ml-md-5 ml-xl-0 justify-content-center" style={{opacity: ".85"}}>
                <Card.Header className="my-label bg-dark text-center text-monospace">
                    <h4>Vizualizare Cereri Angajați</h4>
                </Card.Header>
                <Card.Body>
                    <Modal show={this.state.showAlert} onHide={this.closeAlert} centered close>
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
                            {requests.map((elem, index) => (
                                <tr>
                                    <td>{(this.state.currentPage - 1) * this.state.perPage + index + 1}</td>
                                    <td>{elem.user}</td>
                                    <td>{elem.type}</td>
                                    <td>{elem.fromDate}</td>
                                    <td>{elem.toDate}</td>
                                    <td className="font-weight-bold">{elem.status}</td>
                                    <td>
                                        <Button type="button" size={"sm"} className=" mr-2 btn-success" title="Confirmă" disabled={elem.status !== "IN ASTEPTARE"} onClick={(e) => this.handleAccept(elem, e)}><FaCheck/></Button>
                                        <Button type="button" size={"sm"} className="mr-2 btn-danger" title="Respinge" disabled={elem.status !== "IN ASTEPTARE"} onClick={(e) => this.handleDecline(elem, e)}><FaTimes/></Button>
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
                        nextClassName={this.state.pageCount === this.state.currentPage || requests.length === 0 ? "invisible" : "visible"}
                        containerClassName={this.state.pageCount > 0 ? "pagination invisible" : "visible"}
                        previousLabel={"← Înapoi"}
                        nextLabel={"Mai Departe →"}
                        pageCount={this.state.pageCount}
                        onPageChange={this.handlePageClick}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"}
                    />
                </Card.Body>
            </Card>
        );
    }
}
