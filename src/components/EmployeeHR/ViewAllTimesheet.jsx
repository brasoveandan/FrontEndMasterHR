import React from "react"
import {FaLock, FaLockOpen, FaRegCalendarCheck} from "react-icons/all"
import {Button, Card, Col, Form, Modal, Row, Table} from "react-bootstrap"
import SearchBox from "../utils/searchBox"
import {paginate} from "../utils/pagination";
import ReactPaginate from 'react-paginate';
import { departmentOptions } from "../utils/select";


export default class ViewAllTimesheet extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            timesheets: [],
            originalData: [],
            currentPage: 1,
            offset: 0,
            perPage: 10,
            pageCount: 0,

            timesheetDetails: [],
            year: "",
            month: "",
            department: "",

            searchQuery: "",
            showDetailsModal: false,
            showAlert: false,
            showDataTable: false,
            message: "",
            data: {},
            errors: {},
        };

        this.handlePageClick = this.handlePageClick.bind(this)
        this.handleChange = this.handleChange.bind(this)

        this.loadData()
    }

    loadData() {
        fetch('http://localhost:8080/timesheet', {
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

                    let yearOptions = [];
                    let monthOptions = [];
                    data.forEach(payslip => {
                        yearOptions.push(payslip.year)
                        monthOptions.push(payslip.month)
                    })

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        originalData: json,
                        timesheets: slice,
                        yearOptions: yearOptions,
                        monthOptions: monthOptions
                    })
                });
            }
        }).catch( err => {
            err.text().then( errorMessage => {
                console.log(errorMessage)
            })
        })
    }

    openDetailsModal = timesheet => {
        this.setState({
            timesheetDetails: timesheet,
            showDetailsModal: true
        });
    }

    closeModal = () => {
        this.setState({
            showDetailsModal: false,
            showAlert: false
        });
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
            timesheets: slice
        })
    }

    getPageData = () => {
        const {
            originalData: allTimesheets,
            perPage,
            currentPage,
            searchQuery,
            year,
            month,
            department
        } = this.state;

        let filtered = [];

        if (year && month && department) {
            filtered = allTimesheets.filter(timesheet =>
                timesheet.year === parseInt(year) &&
                timesheet.month === parseInt(month) &&
                timesheet.department.toLowerCase() === department.toLowerCase()
            )
        }

        let filtered1 = []
        if (searchQuery)
            filtered1 = filtered.filter(timesheet =>
                timesheet.usernameEmployee.toLowerCase().startsWith(searchQuery.toLowerCase())
            );


        if (filtered1.length === 0 && searchQuery)
            filtered = filtered.filter(timesheet =>
                timesheet.personalNumber.toLowerCase().startsWith(searchQuery.toLowerCase())
            );

        const result = paginate(filtered, currentPage, perPage);
        return { timesheets : result }
    }

    handleShowData = (timesheets) => {
        const {year, month, department} = this.state
        return (
            timesheets.length > 0 && year && month && department ?
                this.setState({
                    showDataTable: true
                })
                :
                this.setState({
                    showDataTable: false,
                    showAlert: true,
                    message: "Nu există niciun pontaj înregistrat pentru datele selectate. Reîncercați!"
                })
        )
    }

    handleConfirmTimesheet = (timesheet) => {
        const payload = timesheet
        console.log(payload)
        let {workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeHours} = payload
        if (workedHours + homeOfficeHours + overtimeHours + totalOvertimeHours < requiredHours) {
            this.setState({
                showAlert: true,
                message: "Angajatul nu are destule ore."
            })
        }
        else {
            payload["status"] = "CLOSED"
            fetch('http://localhost:8080/timesheet', {
                method: 'PUT',
                headers: {
                    'Accept' : 'application/json',
                    'Content-type':'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(res => {
                    if (res.status === 200) {
                        this.setState({
                            showAlert: true,
                            message: "Pontajul a fost confirmat."
                        })
                        this.loadData()
                    }
                    else if (res.status === 417)
                    {
                        res.text().then(text => {
                            payload["status"] = "OPENED"
                            this.setState({
                                showAlert: true,
                                message: text
                            })
                        });
                    }
                    else if (res.status === 409) {
                        this.setState({
                            showAlert: true,
                            message: "Pontajul este deja confirmat."
                        })
                    }
                }).catch( err => {
                err.text().then( errorMessage => {
                    console.log(errorMessage)
                })
            })
        }
    }

    render(){
        const {timesheets} = this.getPageData()
        const {yearOptions, monthOptions} = this.state
        let {usernameEmployee, personalNumber, year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeHours, status} = this.state.timesheetDetails;
        const date = new Date(year + "-" + month).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long'})
        return (
            <Card className="my-md-4 my-2 ml-md-5 ml-xl-0 d-flex justify-content-center" style={{opacity: ".85"}}>
                <Card.Header className="my-label bg-dark text-center text-monospace">
                    <h4>Vizualizare Pontaje Angajați</h4>
                </Card.Header>
                <Row>
                   <Col sm={4}>
                       <Form className="ml-2">
                           <Form.Group>
                               <Form.Label>An</Form.Label>
                               <Form.Control as="select" custom name="year" onChange={this.handleChange}>
                                   <option value="">Selectează anul...</option>
                                   {yearOptions ? yearOptions.map((year, index) => (
                                       <option key={index} value={year}>
                                           {year}
                                       </option>
                                   ))
                                   : ""}
                               </Form.Control>
                           </Form.Group>
                       </Form>
                   </Col>
                    <Col sm={4}>
                        <Form.Group>
                            <Form.Label>Lună</Form.Label>
                            <Form.Control as="select" custom name="month" onChange={this.handleChange}>
                                <option value="">Selectează luna...</option>
                                {monthOptions ? monthOptions.map((month, index) => (
                                    <option key={index} value={month}>
                                        {month}
                                    </option>
                                ))
                                : ""}
                            </Form.Control>
                        </Form.Group>
                    </Col>
                    <Col sm={4}>
                        <Form className="mr-2">
                            <Form.Group>
                                <Form.Label>Departament</Form.Label>
                                <Form.Control as="select" custom name="department" onChange={this.handleChange}>
                                    <option value="">Selectează departament...</option>
                                    {departmentOptions ? departmentOptions.map((option, index) => (
                                        <option key={index} value={option}>
                                            {option}
                                        </option>
                                        )
                                    )
                                    : ""}
                                </Form.Control>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
                <Col sm={8} className="align-self-center mb-2">
                    <div className="text-center">
                        <Button className="my-btn" type="button" onClick={() =>this.handleShowData(timesheets)}>Vizualizare</Button>
                    </div>
                </Col>
                {this.state.showDataTable ?
                    <React.Fragment>
                        <Col sm={8} className="align-self-center">
                            <SearchBox placeholder="Caută după numele de utilizator sau numărul personal" value={this.state.searchQuery} onChange={this.handleSearch}/>
                        </Col>
                        <Table responsive hover striped borderless className="text-nowrap">
                            <thead className="bg-dark text-white">
                            <tr className="text-center">
                                <th>#</th>
                                <th>Nume de utilizator</th>
                                <th>Număr personal</th>
                                <th>Total ore lucrate</th>
                                <th>Ore necesare</th>
                                <th>Status</th>
                                <th>Acțiune</th>
                            </tr>
                            </thead>
                            <tbody>
                            {timesheets.map((timesheet, index) => (
                                <tr className="text-center">
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>
                                        {(this.state.currentPage - 1) * this.state.perPage + index + 1}
                                    </td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.usernameEmployee}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.personalNumber}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.workedHours}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.requiredHours}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.status === "CLOSED" ? <FaLock/> : <FaLockOpen/>}</td>
                                    <td>
                                        <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark" title="Confirmă pontaj" disabled={timesheet.status === "CLOSED"} onClick={(e) => this.handleConfirmTimesheet(timesheet, e)}><FaRegCalendarCheck/></Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <ReactPaginate
                            previousClassName={this.state.currentPage === 1 ? "invisible" : "visible"}
                            nextClassName={this.state.pageCount === this.state.currentPage || this.state.timesheets.length === 0 ? "invisible" : "visible"}
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
                    </React.Fragment>
                    : ""
                }
                <Modal show={this.state.showAlert} onHide={this.closeModal} centered close>
                    <Modal.Header>Notificare</Modal.Header>
                    <Modal.Body>
                        {this.state.message}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={this.closeModal}>
                            Ok
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showDetailsModal} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Vizualizare Detalii Pontaj</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Card.Body className="bg-light rounded">
                            <Row>
                                <Col sm={12}>
                                    <h4 className="m-b-10 mb-3 text-center text-dark">Pontaj
                                        <span className="text-muted ml-2">
                                            {date}
                                        </span>
                                    </h4>
                                    <h5 className="m-b-10 mb-3 text-center text-dark">
                                        Status: {status === "CLOSED" ? <FaLock/> : <FaLockOpen/>}
                                    </h5>
                                    <Table hover className="list-group-flush text-dark">
                                        <tbody>
                                        <tr>
                                            <td><strong>Nume de utilizator: </strong>
                                                <span className="float-right">{usernameEmployee}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Număr personal: </strong>
                                                <span className="float-right">{personalNumber}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore lucrate: </strong>
                                                <span className="float-right">{workedHours}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore telemuncă: </strong>
                                                <span className="float-right">{homeOfficeHours}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore necesare: </strong>
                                                <span className="float-right">{requiredHours}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore suplimentare luna curentă: </strong>
                                                <span className="float-right">{overtimeHours}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore suplimentare anterioare: </strong>
                                                <span className="float-right">{totalOvertimeHours}</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Modal.Body>
                </Modal>
            </Card>
        );
    }
}



