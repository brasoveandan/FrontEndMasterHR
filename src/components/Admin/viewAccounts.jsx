import React from "react"
import {FaBan, FaTimes, FiEdit} from "react-icons/all"
import {Button, Card, Col, Form, Modal, Row, Table} from "react-bootstrap"
import SearchBox from "../../common/SearchBox"
import {paginate} from "../../utils/pagination";
import ReactPaginate from 'react-paginate';
import MyForm from "../../common/MyForm";
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
            showAlert: false,
            message: ""
        };

        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.loadData()
    }

    loadData = () => {
        fetch('http://localhost:8080/employee', {
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
                    let slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        originalData: json,
                        accounts: slice
                    })
                });
            }
        })
    }

    schema = {
        username: Joi.string().min(3).required().error(() => {return {message: "Numele de utilizator este prea scurt."}}),
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

    closeModal = () => {
        this.setState({
            showDetailsModal: false,
            showEditModal: false,
            showDeleteModal: false
        });
    }

    closeAlert = () => {
        this.setState({
            showAlert: false
        })
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
    }

    handleDeleteAccount = () => {
        fetch('http://localhost:8080/employee/' + this.state.accountDetails.username, {
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
                        message: "Contul a fost șters!"
                    })
                    this.closeModal()
                    this.loadData()
                }
                else if(res.status === 417){
                    res.text().then(text =>{
                        this.setState({
                            showAlert: true,
                            message: text + " Contul nu a fost șters!"
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

    doSubmit = () => {
        fetch('http://localhost:8080/employeeAccount', {
            method: 'PUT',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json',
                'Authorization' : 'Bearer ' + sessionStorage.getItem("jwt")
            },
            body: JSON.stringify(this.state.data)
        })
        .then(res => {
            if (res.status === 200) {
                this.setState({
                    showAlert: true,
                    message: "Contul a fost modificat!"
                })
                this.closeModal()
                this.loadData()
            }
            else if(res.status === 417){
                res.text().then(text =>{
                    console.log(text);
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

        const pageCount = Math.ceil(filtered.length / this.state.perPage)
        const result = paginate(filtered, currentPage, perPage)

        return { accounts: result, pageCount };
    }

    render(){
        const { accounts, pageCount } = this.getPagedData();
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
                <Modal show={this.state.showDetailsModal} onHide={this.closeModal}>
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
                {accounts.length > 0 ?
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
                            <tr key={index} className="text-center">
                                <td onClick={(e) => this.openDetailsModal(account, e)}>
                                    {(this.state.currentPage - 1) * this.state.perPage + index + 1}
                                </td>
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.username}</td>
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.personalNumber}</td>
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.mail}</td>
                                <td>
                                    <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează" onClick={(e) => this.openEditModal(account, e)}><FiEdit/></Button>
                                    <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Șterge" onClick={(e) => this.openDeleteModal(account, e)}><FaBan/></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                :
                    <Modal.Header className="text-white bg-dark font-weight-bold">Nu este salvat niciun cont.</Modal.Header>
                }
                <ReactPaginate
                    previousClassName={this.state.currentPage === 1 ? "invisible" : "visible"}
                    nextClassName={pageCount === this.state.currentPage || accounts.length < this.state.perPage ? "invisible" : "visible"}
                    containerClassName={accounts.length > 0 && pageCount > 1 ? "pagination visible" : "invisible"}
                    previousLabel={"← Înapoi"}
                    nextLabel={"Mai Departe →"}
                    pageCount={pageCount}
                    onPageChange={this.handlePageClick}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />
                <Modal backdrop="static" keyboard={false} show={this.state.showDeleteModal} onHide={this.closeModal} centered>
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
                        <Button className="btn-danger" onClick={this.closeModal}>Nu</Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showEditModal} onHide={this.closeModal}>
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
                                <div className="text-center" onClick={(e) => this.handleSubmit("", e)}>
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



