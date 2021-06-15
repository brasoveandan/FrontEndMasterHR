import React from "react"
import {FaCheck, FaTimes, FiEdit} from "react-icons/all"
import {Button, Card, Col, Container, Form, Modal, Row, Table} from "react-bootstrap"
import SearchBox from "../../common/SearchBox"
import {paginate} from "../../utils/pagination";
import ReactPaginate from 'react-paginate';
import MyForm from "../../common/MyForm";
import * as Joi from "joi-browser";
import {
    contractTypeOptions,
    currencyOptions,
    departmentOptions,
    positionOptions,
    taxExemptOptions
} from "../../common/MySelect";


export default class ViewAllContracts extends MyForm{
    constructor(){
        super(undefined);
        this.state = {
            employees: [],
            contracts: [],
            originalData: [],
            currentPage: 1,
            offset: 0,
            perPage: 10,
            pageCount: 0,
            contractDetails: [],
            searchQuery: "",
            showDetailsModal: false,
            showAddModal: false,
            showEditModal: false,
            showAlert: false,
            message: "",
            data: {
                username: "",
                lastName: "",
                firstName: "",
                personalNumber: "",
                mail: "",
                phoneNumber: "",
                socialSecurityNumber: "",
                companyName: "",
                baseSalary: "",
                currency: "",
                hireDate: "",
                type: "",
                expirationDate: "",
                department: "",
                position: "",
                birthday: "",
                gender: "",
                bankName: "",
                bankAccountNumber: "",
                overtimeIncreasePercent: "",
                taxExempt: "",
                ticketValue: "",
                daysOff: ""
            },
            errors: {},
        };

        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.loadData()
    }

    loadData() {
        fetch('http://localhost:8080/contract', {
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
                    let array = []
                    let yourData = [];
                    for (const element of json) {
                        if (element.username === sessionStorage.getItem("username")) {
                            yourData = element
                            break
                        }
                    }
                    json.forEach(elem => {
                        if (elem.username !== yourData.username)
                            array.push(elem)
                    })
                    const data = array;
                    let slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        originalData: array,
                        contracts: slice
                    })
                });
            }
        })

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
                res.json().then(json => {
                    this.setState({
                        employees: json
                    })
                });
            }
            else {
                this.setState({
                    showAlert: true,
                    message: "Nu s-au găsit date."
                })
            }
        })
    }

    schema = {
        username: Joi.string().min(3).required().error(() => {return {message: "Numele de utilizator este obligatoriu."}}),
        lastName: Joi.string().required().error(() => {return {message: "Numele este obligatoriu."}}),
        firstName: Joi.string().required().error(() => {return {message: "Prenumele este obligatoriu."}}),
        personalNumber: Joi.string().min(10).required().error(() => {return {message: "Numărul personal nu poate fi vid și trebuie să conțină cel puțin 10 cifre."}}),
        mail: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['ro', 'com', 'net'] } }).min(13).required().error(() => {return {message: "E-mail invalid."}}),
        phoneNumber: Joi.string().length(10).regex(/^[0-9]+$/).required().error(() => {return {message: "Numărul de telefon este obligatoriu și trebuie să conțină 10 cifre."}}),
        socialSecurityNumber: Joi.string().length(13).regex(/^[0-9]+$/).error(() => {return {message: "Codul numeric personal este obligatoriu și trebuie să conțină 13 cifre."}}),
        companyName: Joi.string().required().error(() => {return {message: "Trebuie completată denumirea firmei."}}),
        baseSalary: Joi.number().required().error(() => {return {message: "Salariul trebuie completat."}}),
        currency: Joi.string().required().error(() => {return {message: "Trebuie selectată valuta."}}),
        hireDate: Joi.date().iso().required().error(() => {return {message: "Data de angajare este obligatorie."}}),
        type: Joi.string().required().error(() => {return {message: "Trebuie selectat tipul."}}),
        expirationDate: Joi.date().allow(null).allow(""),
        department: Joi.string().required().error(() => {return {message: "Trebuie selectat departamentul."}}),
        position: Joi.string().required().error(() => {return {message: "Trebuie selectată poziția."}}),
        birthday: Joi.date().allow(null).allow(""),
        gender: Joi.string().valid("Masculin", "Feminin").required().error(() => {return {message: "Genul trebuie sa fie Masculin sau Feminin."}}),
        bankName: Joi.string().required().error(() => {return {message: "Trebuie completat numele băncii."}}),
        bankAccountNumber: Joi.string().min(24).required().error(() => {return {message: "IBAN invalid."}}),
        overtimeIncreasePercent: Joi.number().integer().min(75).max(300).required().error(() => {return {message: "Procentul trebuie să fie minim 75 și mai mic decât 300."}}),
        taxExempt: Joi.string().required().error(() => {return {message: "Câmp obligatoriu."}}),
        ticketValue: Joi.number().integer().min(10).max(30).required().error(() => {return {message: "Valoarea tichetului trebuie să fie de minim 10 și mai mic decât 30."}}),
        daysOff: Joi.number().integer().required().error(() => {return {message: "Câmpul este obligatoriu un întreg"}}),
    }

    openDetailsModal = contract => {
        this.setState({
            contractDetails: contract,
            showDetailsModal: true
        });
    }

    openAddModal = () => {
        const payload = {
            username: "",
            lastName: "",
            firstName: "",
            personalNumber: "",
            mail: "",
            phoneNumber: "",
            socialSecurityNumber: "",
            companyName: "",
            baseSalary: "",
            currency: "",
            hireDate: "",
            type: "",
            expirationDate: "",
            department: "",
            position: "",
            birthday: "",
            gender: "",
            bankName: "",
            bankAccountNumber: "",
            overtimeIncreasePercent: "",
            taxExempt: "",
            ticketValue: "",
            daysOff: ""
        }
        this.setState({
            data: payload,
            showAddModal: true

        });
    }

    openEditModal = contract => {
        const payload = {
            username: contract.username,
            lastName: contract.lastName,
            firstName: contract.firstName,
            personalNumber: contract.personalNumber,
            mail: contract.mail,
            phoneNumber: contract.phoneNumber,
            socialSecurityNumber: contract.socialSecurityNumber,
            companyName: contract.companyName,
            baseSalary: contract.baseSalary,
            currency: contract.currency,
            hireDate: contract.hireDate,
            type: contract.type,
            expirationDate: contract.expirationDate ? contract.expirationDate : "",
            department: contract.department,
            position: contract.position,
            birthday: contract.birthday,
            gender: contract.gender,
            bankName: contract.bankName,
            bankAccountNumber: contract.bankAccountNumber,
            overtimeIncreasePercent: contract.overtimeIncreasePercent,
            taxExempt: contract.taxExempt ? "Da" : "Nu",
            ticketValue: contract.ticketValue,
            daysOff: contract.daysOff
        }
        this.setState({
            data: payload,
            showEditModal: true
        });
    }

    closeModal = () => {
        this.setState({
            showDetailsModal: false,
            showAddModal: false,
            showEditModal: false,
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

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    }

    handleUpdateData = () => {
        this.state.employees.forEach(employee => {
            if (this.state.data.username === employee.username){
                const payload = this.state.data
                payload["mail"] = employee.mail
                payload["personalNumber"] = employee.personalNumber
                payload["firstName"] = employee.firstName
                payload["lastName"] = employee.lastName
            }
        })
    };

    doSubmit = (action) => {
        const payload = this.state.data
        payload.taxExempt === "Da" ? payload["taxExempt"] = true : payload["taxExempt"] = false
        if (action === "add") {
            fetch('http://localhost:8080/contract', {
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
                        message: "Contractul a fost adăugat cu succes!"
                    })
                    this.closeModal()
                    this.loadData()
                }
                else if(res.status === 417) {
                    res.text().then(text => {
                        this.setState({
                            showAlert: true,
                            message: text + " Contractul nu a fost adăugat!"
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
        if (action === "edit") {
            fetch('http://localhost:8080/contract', {
                method: 'PUT',
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
                        message: "Contractul a fost modificat cu succes!"
                    })
                    this.closeModal()
                    this.loadData()
                }
                else if(res.status === 417){
                    res.text().then(text => {
                        this.setState({
                            showAlert: true,
                            message: text + " Contractul nu a fost modificat!"
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
            contracts: slice
        })
    }

    getPagedData = () => {
        const {
            originalData: allContracts,
            perPage,
            currentPage,
            searchQuery
        } = this.state;

        let filtered = allContracts;
        if (searchQuery)
            filtered = allContracts.filter(contract =>
                contract.username.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        if (filtered.length === 0)
            filtered = allContracts.filter(contract =>
                contract.personalNumber.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        const pageCount = Math.ceil(filtered.length / this.state.perPage)
        const result = paginate(filtered, currentPage, perPage);
        return { contracts: result, pageCount };
    }

    render(){
        const { contracts, pageCount } = this.getPagedData();
        let {firstName, lastName, personalNumber, socialSecurityNumber, phoneNumber , mail, birthday, gender, bankName, bankAccountNumber, department, position, baseSalary, currency, type, hireDate, expirationDate, overtimeIncreasePercent, taxExempt, ticketValue, daysOff} = this.state.contractDetails;
        const birthdayDate = new Date(birthday).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long', day: 'numeric'})
        const hireDateFormat = new Date(hireDate).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long', day: 'numeric'})
        const expirationDateFormat = new Date(expirationDate).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long', day: 'numeric'})
        let usernameWithoutContract = []
        this.state.employees.forEach(employee => {
            let ok = false;
            this.state.originalData.forEach(contract => {
                if (contract.username === employee.username)
                    ok = true
            })
            if (!ok && sessionStorage.getItem("username") !== employee.username)
                usernameWithoutContract.push(employee.username)
        })
        return (
            <Card className="my-md-4 my-2 ml-md-5 ml-xl-0 d-flex justify-content-center" style={{opacity: ".85"}}>
                <Card.Header className="my-label bg-dark text-center text-monospace">
                    <h4>Vizualizare Contracte Angajați</h4>
                </Card.Header>
                <Col sm={8} className="align-self-center">
                    <SearchBox placeholder="Caută după numele de utilizator sau numărul personal" value={this.state.searchQuery} onChange={this.handleSearch}/>
                    <div className="text-center">
                        <Button className="my-btn mb-3" type="button" onClick={this.openAddModal}>Adaugă contract nou</Button>
                    </div>
                </Col>
                {contracts.length > 0 ?
                    <Table responsive hover striped borderless>
                        <thead className="bg-dark text-white">
                        <tr className="text-center">
                            <th>#</th>
                            <th>Nume de utilizator</th>
                            <th>Nume complet</th>
                            <th>Număr personal</th>
                            <th>E-mail</th>
                            <th>Acțiune</th>
                        </tr>
                        </thead>
                        <tbody>
                        {contracts.map((account, index) => (
                            <tr key={index} className="text-center">
                                <td onClick={(e) => this.openDetailsModal(account, e)}>
                                    {(this.state.currentPage - 1) * this.state.perPage + index + 1}
                                </td>
                                {console.log(account.username === sessionStorage.getItem("username"))}
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.username}</td>
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.lastName} {account.firstName}</td>
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.personalNumber}</td>
                                <td onClick={(e) => this.openDetailsModal(account, e)}>{account.mail}</td>
                                <td>
                                    <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Editează" onClick={(e) => this.openEditModal(account, e)}><FiEdit/></Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                :
                <Modal.Header className="bg-white font-weight-bold">Nu există niciun contract înregistrat.</Modal.Header>
                }
                <ReactPaginate
                    previousClassName={this.state.currentPage === 1 ? "invisible" : "visible"}
                    nextClassName={pageCount === this.state.currentPage || contracts.length < this.state.perPage ? "invisible" : "visible"}
                    containerClassName={contracts.length > 0 && pageCount > 1 ? "pagination visible" : "invisible"}
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
                <Modal show={this.state.showDetailsModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vizualizare Contract</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body className="bg-light rounded">
                            <Row>
                                <Col sm={12}>
                                    <h4 className="m-b-10 mb-3"><strong>Informații Personale</strong></h4>
                                    <Table hover className="list-group-item-dark">
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
                                                <span className="float-right">{birthdayDate}</span>
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
                                    <h4 className="m-b-10 mb-3"><strong>Informații Generale</strong></h4>
                                    <Table hover className="list-group-item-dark">
                                        <tbody>
                                        <tr>
                                            <td><strong>Departament:  </strong>
                                                <span className="float-right">{department}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Poziție: </strong>
                                                <span className="float-right">{position}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Număr personal: </strong>
                                                <span className="float-right">{personalNumber}</span>
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
                                                <span className="float-right">{hireDateFormat}</span>
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
                                            <td><strong>Valoare tichet de masă: </strong>
                                                <span className="float-right">{ticketValue} {currency}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Tip contract: </strong>
                                                <span className="float-right">{type}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Număr zile concediu anual: </strong>
                                                <span className="float-right">{daysOff}</span>
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
                                                <span className="float-right">{expirationDate ? expirationDateFormat : <FaTimes/>}</span>
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
                    </Modal.Body>
                </Modal>
                <Modal backdrop="static" keyboard={false} show={this.state.showAddModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Adaugă contract nou</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Container fluid className="mb-3 mt-3">
                            <Card>
                                <Card.Body  className="rounded">
                                    <Form>
                                        {this.state.data.username && this.state.showAddModal ? this.handleUpdateData() : ""}
                                        {this.renderSelect("form-control", "username", "Utilizator:", usernameWithoutContract)}
                                        {this.renderInput("form-control", "lastName", "Nume:", "Nume", "text")}
                                        {this.renderInput("form-control", "firstName", "Prenume:", "Prenume", "text")}
                                        {this.renderInput("form-control", "personalNumber", "Număr personal:", "Număr personal", "text")}
                                        {this.renderInput("form-control", "mail", "E-mail:", "E-mail", "mail")}
                                        {this.renderInput("form-control", "phoneNumber", "Număr de telefon:", "Număr de telefon", "text")}
                                        {this.renderInput("form-control", "socialSecurityNumber", "Cod numeric personal:", "Cod numeric personal", "text")}
                                        {this.renderInput("form-control", "companyName", "Companie:", "Companie", "text")}
                                        {this.renderInput("form-control", "baseSalary", "Salariu:", "ex: 5000", "float")}
                                        {this.renderSelect("form-control", "currency", "Valută:",  currencyOptions)}
                                        {this.renderInput("form-control", "hireDate", "Dată angajare:", "MM/dd/yyyy",  "date")}
                                        {this.renderSelect("form-control", "type", "Tip contract:", contractTypeOptions)}
                                        {this.renderInput("form-control", "expirationDate", "Dată expirare:", "MM/dd/yyyy", "date")}
                                        {this.renderSelect("form-control", "department", "Departament:",  departmentOptions)}
                                        {this.renderSelect("form-control", "position", "Poziție:",  positionOptions)}
                                        {this.renderInput("form-control", "birthday", "Data nașterii:", "MM/dd/yyyy", "date")}
                                        {this.renderInput("form-control", "gender", "Gen", "ex: Masculin", "text")}
                                        {this.renderInput("form-control", "bankName", "Nume bancă:", "Nume bancă", "text")}
                                        {this.renderInput("form-control", "bankAccountNumber", "Cont bancar:", "ex: RO49 AAAA 1B31 0075 9384 0000",  "text")}
                                        {this.renderInput("form-control", "overtimeIncreasePercent", "Procent plată ore suplimentare:", "ex:75",  "int")}
                                        {this.renderSelect("form-control", "taxExempt", "Scutit impozit:",  taxExemptOptions)}
                                        {this.renderInput("form-control", "ticketValue", "Valoare tichet masă:", "ex: 15",  "int")}
                                        {this.renderInput("form-control", "daysOff", "Număr zile concediu anual:", "ex: 24",  "int")}
                                        <div className="text-center" onClick={(e) => this.handleSubmit("add", e)}>
                                            {this.renderButton("my-btn", "SALVEAZĂ", "button")}
                                        </div>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Container>
                    </Modal.Body>
                </Modal>
                <Modal backdrop="static" keyboard={false} show={this.state.showEditModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Editare contract - {this.state.data.lastName}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body className="bg-light rounded">
                            <Form>
                                {this.renderInput("form-control", "username", "Nume de utilizator:", "Nume de utilizator", "text", true)}
                                {this.renderInput("form-control", "lastName", "Nume:", "Nume", "text")}
                                {this.renderInput("form-control", "firstName", "Prenume:", "Prenume", "text")}
                                {this.renderInput("form-control", "personalNumber", "Număr personal:", "Număr personal", "text")}
                                {this.renderInput("form-control", "mail", "E-mail:", "E-mail", "mail")}
                                {this.renderInput("form-control", "phoneNumber", "Număr de telefon:", "Număr de telefon", "text")}
                                {this.renderInput("form-control", "socialSecurityNumber", "Cod numeric personal:", "Cod numeric personal", "text")}
                                {this.renderInput("form-control", "companyName", "Companie:", "Companie", "text")}
                                {this.renderInput("form-control", "baseSalary", "Salariu:", "ex: 5000", "float")}
                                {this.renderSelect("form-control", "currency", "Valută:",  currencyOptions)}
                                {this.renderInput("form-control", "hireDate", "Dată angajare:", "MM/dd/yyyy",  "date")}
                                {this.renderSelect("form-control", "type", "Tip contract:",  contractTypeOptions)}
                                {this.renderInput("form-control", "expirationDate", "Dată expirare:", "MM/dd/yyyy", "date")}
                                {this.renderSelect("form-control", "department", "Departament:",  departmentOptions)}
                                {this.renderSelect("form-control", "position", "Poziție:",  positionOptions)}
                                {this.renderInput("form-control", "birthday", "Data nașterii:", "MM/dd/yyyy", "date")}
                                {this.renderInput("form-control", "gender", "Gen", "ex: Masculin", "text")}
                                {this.renderInput("form-control", "bankName", "Nume bancă:", "Nume bancă", "text")}
                                {this.renderInput("form-control", "bankAccountNumber", "Cont bancar:", "IBAN",  "text")}
                                {this.renderInput("form-control", "overtimeIncreasePercent", "Procent plată ore suplimentare:", "ex:75",  "int")}
                                {this.renderSelect("form-control", "taxExempt", "Scutit impozit:",  ["Da", "Nu"])}
                                {this.renderInput("form-control", "ticketValue", "Valoare tichet masă:", "ex: 15", "int")}
                                {this.renderInput("form-control", "daysOff", "Număr zile concediu anual:", "ex: 24", "int")}
                                <div className="text-center" onClick={(e)=>this.handleSubmit("edit", e)}>
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



