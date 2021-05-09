import React from "react"
import {FaBan, FaTimes, FiEdit} from "react-icons/all"
import {Button, Card, Col, Form, Modal, Row, Table} from "react-bootstrap"
import SearchBox from "../utils/searchBox"
import {paginate} from "../utils/pagination";
import ReactPaginate from 'react-paginate';
import MyForm from "../utils/MyForm";
import * as Joi from "joi-browser";


export default class ViewAccounts extends MyForm{
    constructor(){
        super(undefined);
        this.state = {
            accounts: [],
            originalData: [],
            currentPage: 1,
            offset: 0,
            perPage: 5,
            pageCount: 0,
            accountDetails: [],
            searchQuery: "",
            showDetailsModal: false,
            showEditModal: false,
            showDeleteModal: false,
            data: {
                username: "",
                password: "",
                personalNumber: "",
                adminRole: "",
                mail: ""
            },
            errors: {},
        };

        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        fetch('http://localhost:8080/employee', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
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
                            accounts: slice
                        })
                    });
                }
                else {
                    console.log("error")
                }
            })
    }

    refreshData() {
        fetch('http://localhost:8080/employee', {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
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
                            accounts: slice
                        })
                    });
                }
                else {
                    console.log("error")
                }
            })
    }

    schema = {
        username: Joi.string().min(8).required().error(() => {return {message: "Numele de utilizator este obligatoriu."}}),
        password: Joi.string().min(8).required().error(() => {return {message: "Parola trebuie să conțină cel puțin 8 caractere."}}),
        personalNumber: Joi.string().min(6).required().error(() => {return {message: "Numărul personal nu poate fi vid și trebuie să conțină cel puțin 6 cifre."}}),
        adminRole: Joi.string().required().error(() => {return {message: "Trebuie setate permisiunile contului."}}),
        mail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['ro', 'com', 'net'] } }).min(13).required().error(() => {return {message: "E-mail invalid."}}),
    }

    openDetailsModal = account => {
        this.setState({
            accountDetails: account,
            showDetailsModal: true
        });
    }

    openEditModal = account => {
        const payload = {
            username: account.username,
            password: account.password,
            personalNumber: account.personalNumber,
            adminRole: account.adminRole,
            mail: account.mail,
        }
        this.setState({
            data: payload,
            showEditModal: true
        });
    }

    openDeleteModal = account => {
        this.setState({
            accountDetails: account,
            showDeleteModal: true
        });
    }

    closeDetailsModal = () => {
        this.setState({
            showDetailsModal: false
        });
    }

    closeEditModal = () => {
        this.setState({
            showEditModal: false
        });
    }

    closeDeleteModal = () => {
        this.setState({
            showDeleteModal: false
        });
    }

    handleSearch = query => {
        this.setState({ searchQuery: query, currentPage: 1});
    }

    handleClearSearch = () => {
        this.setState({ searchQuery: "", currentPage: 1})
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleDeleteAccount = () => {
        fetch('http://localhost:8080/employee/' + this.state.accountDetails.username, {
            method: 'DELETE',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
        })
            .then(res => {
                if (res.status === 200) {
                    alert("Cont-ul a fost sters");
                    this.closeDeleteModal()
                    this.refreshData()
                }
                else if(res.status === 417){
                    res.text().then(text =>{
                        console.log(text);
                    });
                }
            })
    }

    doSubmit = () => {
        fetch('http://localhost:8080/employeeAccount', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify(this.state.data)
        })
        .then(res => {
            if (res.status === 200) {
                alert("Cont modificat cu succes!")
                this.closeEditModal()
                this.refreshData()
            }
            else if(res.status === 417){
                res.text().then(text =>{
                    console.log(text);
                });
            }
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
            accounts: slice
        })
    }

    getPagedData = () => {
        const {
            originalData: allAccounts,
            perPage,
            currentPage,
            searchQuery
        } = this.state;

        let filtered = allAccounts;
        if (searchQuery)
            filtered = allAccounts.filter(account =>
                account.username.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
        
        if (filtered.length === 0)
            filtered = allAccounts.filter(account =>
                account.personalNumber.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        const result = paginate(filtered, currentPage, perPage);
        return { accounts: result };
    }

    render(){
        const { accounts} = this.getPagedData();
        const {username, password, personalNumber, adminRole, firstName, lastName, mail, phoneNumber, socialSecurityNumber, birthday, gender} = this.state.accountDetails
        const birthdayDate = new Date(birthday)
        return (
            <Card className="my-md-4 my-2 ml-md-5 ml-xl-0 d-flex justify-content-center" style={{opacity: ".85"}}>
                <Card.Header className="my-label bg-dark text-center text-monospace">
                    <h4>Vizualizare Conturi Angajați</h4>
                </Card.Header>
                <Col sm={8} className="align-self-center">
                    <SearchBox placeholder="Caută după numele de utilizator sau numărul personal" value={this.state.searchQuery} onChange={this.handleSearch}/>
                    <div className="text-center">
                        <Button className="my-btn mb-3" type="button" onClick={this.handleClearSearch}>Golește căutarea</Button>
                    </div>
                </Col>
                <Modal show={this.state.showDetailsModal} onHide={this.closeDetailsModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vizualizare detalii angajat</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body className="bg-light rounded">
                            <Row>
                                <Col sm={12}>
                                    <h4 className="m-b-10 mb-3 text-center text-dark">Detalii cont</h4>
                                    <Table hover className="list-group-flush text-dark">
                                        <tbody>
                                        <tr>
                                            <td><strong>Nume de utilizator: </strong>
                                                <span className="float-right">{username}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Parola: </strong>
                                                <span className="float-right">{password}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Permisiuni: </strong>
                                                <span className="float-right">{adminRole ? adminRole : <FaTimes/>}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Număr personal: </strong>
                                                <span className="float-right">{personalNumber}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>E-mail: </strong>
                                                <span className="float-right">{mail}</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <h4 className="m-b-10 mb-3 text-center text-dark">Informații Personale</h4>
                                    <Table hover className="list-group-flush text-dark">
                                        <tbody>
                                        <tr>
                                            <td><strong>Nume: </strong>
                                                <span className="float-right">{lastName}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Prenume: </strong>
                                                <span className="float-right">{firstName}</span>
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
                                            <td><strong>Data nașterii: </strong>
                                                <span className="float-right">{birthdayDate.toLocaleDateString("ro-RO", {day: "2-digit", month:"long", year: "numeric"})}</span>
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
                        </Card.Body>
                    </Modal.Body>
                </Modal>
                <Table responsive hover striped borderless className="text-nowrap">
                    <thead className="bg-dark text-white">
                    <tr className="text-center">
                        <th>#</th>
                        <th>Nume de utilizator</th>
                        <th>Număr personal</th>
                        <th>E-mail</th>
                        <th>Acțiune</th>
                    </tr>
                    </thead>
                    <tbody>
                    {accounts.map((account, index) => (
                        <tr className="text-center">
                            <td onClick={(e) => this.openDetailsModal(account, e)}>
                                {(this.state.currentPage - 1) * this.state.perPage + index + 1}
                            </td>
                            <td onClick={(e) => this.openDetailsModal(account, e)}>{account.username}</td>
                            <td onClick={(e) => this.openDetailsModal(account, e)}>{account.personalNumber}</td>
                            <td onClick={(e) => this.openDetailsModal(account, e)}>{account.mail}</td>
                            <td className="text-center">
                                <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează" onClick={(e) => this.openEditModal(account, e)}><FiEdit/></Button>
                                <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" onClick={(e) => this.openDeleteModal(account, e)}><FaBan/></Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <ReactPaginate
                    previousClassName={this.state.currentPage === 1 ? "invisible" : "visible"}
                    nextClassName={this.state.pageCount === this.state.currentPage ? "invisible" : "visible"}
                    containerClassName={this.state.pageCount > 0 ? "pagination visibile" : "invisible"}
                    previousLabel={"← Înapoi"}
                    nextLabel={"Mai Departe →"}
                    pageCount={this.state.pageCount}
                    onPageChange={this.handlePageClick}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />
                <Modal backdrop="static" keyboard={false} show={this.state.showDeleteModal} onHide={this.closeDeleteModal} centered>
                    <Modal.Header>
                        <Modal.Title>
                            Șterge cont - {username}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Doriți să continuați?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button className="btn-success" onClick={this.handleDeleteAccount}>Da</Button>
                        <Button className="btn-danger" onClick={this.closeDeleteModal}>Nu</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditModal} onHide={this.closeEditModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editare cont angajat - {this.state.data.username}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body className="bg-light rounded">
                            <Form>
                                {this.renderInput("form-control", "username", "Nume de utilizator:", "Nume de utilizator", "text", true)}
                                {this.renderInput("form-control", "password", "Parola:", "Parola", "password")}
                                {this.renderSelect("form-control", "adminRole", "Permisiune cont:", Array.of("DEFAULT", "ADMIN", "GROUP_LEADER", "HR_EMPLOYEE", "HR_DEPARTMENT_RESPONSIVE"), "text")}
                                {this.renderInput("form-control", "mail", "E-mail:", "E-mail", "mail")}
                                <div className="text-center" onClick={this.handleSubmit}>
                                    {this.renderButton("my-btn", "SALVEAZĂ", "button")}
                                </div>
                            </Form>
                        </Card.Body>
                    </Modal.Body>
                </Modal>
            </Card>
        );
    }
}



