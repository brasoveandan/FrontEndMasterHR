import React from "react"
import {FaLock, FaLockOpen, FaRegCalendarCheck} from "react-icons/all"
import {Button, Card, Col, Form, Modal, Row, Table} from "react-bootstrap"
import SearchBox from "../../common/SearchBox"
import {paginate} from "../../utils/pagination";
import ReactPaginate from 'react-paginate';
import { departmentOptions } from "../../common/MySelect";


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
            holidayPerMonth: 0,
            holidaySummary: [],

            timesheetDetails: [],
            year: "",
            month: "",
            department: "",

            searchQuery: "",
            showDetailsModal: false,
            showConfirmModal: false,
            showAlert: false,
            showDataTable: false,
            message: "",
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
                        if (element.usernameEmployee === sessionStorage.getItem("username")) {
                            yourData = element
                            break
                        }
                    }
                    json.forEach(elem => {
                        if (elem.usernameEmployee !== yourData.usernameEmployee)
                            array.push(elem)
                    })
                    const data = array;
                    let slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)

                    let yearOptions = [];
                    let monthOptions = [];
                    data.forEach(payslip => {
                        yearOptions.push(payslip.year)
                        monthOptions.push(payslip.month)
                    })
                    yearOptions = yearOptions.filter((value, index) => yearOptions.indexOf(value) === index)
                    monthOptions = monthOptions.filter((value, index) => monthOptions.indexOf(value) === index)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        originalData: array,
                        timesheets: slice,
                        yearOptions: yearOptions,
                        monthOptions: monthOptions
                    })
                });
            }
        })
    }

    loadHolidayUser = timesheet => {
        const payload = {
            username: timesheet.usernameEmployee,
            year: this.state.year,
            month: this.state.month
        }
        fetch('http://localhost:8080/holiday/' + payload.username + "/" + payload.year + "/" + payload.month, {
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
                          holidayPerMonth: json
                      })
                    });
                }
                else
                    this.setState({
                        holidayPerMonth: 0
                    })
            })

        fetch('http://localhost:8080/summaryHoliday/' + payload.username + "/" + payload.year + "/" + payload.month, {
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
                        this.setState({holidaySummary: json});
                    });
                }
                else
                    this.setState({
                        holidaySummary: []
                    })
            })
    }

    openDetailsModal = timesheet => {
        this.setState({
            timesheetDetails: timesheet,
            showDetailsModal: true
        });
        this.loadHolidayUser(timesheet)
    }

    openConfirmModal = timesheet => {
        this.setState({
            timesheetDetails: timesheet,
            showConfirmModal: true
        });
        this.loadHolidayUser(timesheet)
    }

    closeModal = () => {
        this.setState({
            showDetailsModal: false,
            showConfirmModal: false
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
            [event.target.name]: event.target.value,
            showDataTable: false
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

    handleConfirmTimesheet = () => {
        const payload = this.state.timesheetDetails
        payload["status"] = "CLOSED"
        fetch('http://localhost:8080/timesheet', {
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
                        message: "Pontajul a fost confirmat. Luna este închisă!"
                    })
                    this.closeModal()
                    this.loadData()
                }
                else if (res.status === 417)
                {
                    res.text().then(text => {
                        payload["status"] = "OPENED"
                        this.setState({
                            showAlert: true,
                            message: text + "Pontajul nu a fost confirmat. Luna rămâne deschisă."
                        })
                    });
                }
                else if (res.status === 409) {
                    this.setState({
                        showAlert: true,
                        message: "Luna este deja închisă."
                    })
                }
                else
                    this.setState({
                        showAlert: true,
                        message: "A apărut o eroare. Dacă persistă, vă rugăm să ne semnalați eroarea la adresa de email " +
                            "masterhr.contact@gmail.com. Mulțumim!"
                    })
            })
    }

    render(){
        const {timesheets} = this.getPageData()
        const {yearOptions, monthOptions} = this.state
        let {usernameEmployee, personalNumber, year, month, workedHours, homeOfficeHours, requiredHours, overtimeHours, totalOvertimeHours, status, numberOfHoursContract} = this.state.timesheetDetails;
        let {daysTaken, medicalLeave, otherLeave, overtimeLeave} = this.state.holidaySummary;
        const date = new Date(year + "-" + month).toLocaleDateString("ro-RO", {year: 'numeric', month: 'long'})
        const totalWorkedHours = homeOfficeHours + workedHours
        const totalHolidayDays = daysTaken + otherLeave + medicalLeave
        const workerHoursWithHoliday = totalWorkedHours + overtimeLeave + totalHolidayDays * numberOfHoursContract
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
                                   {yearOptions ? yearOptions.map((elem, index) => (
                                       <option key={index} value={elem}>
                                           {elem}
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
                                {monthOptions ? monthOptions.map((elem, index) => (
                                    <option key={index} value={elem}>
                                        {elem}
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
                                <tr key={index} className="text-center">
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>
                                        {(this.state.currentPage - 1) * this.state.perPage + index + 1}
                                    </td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.usernameEmployee}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.personalNumber}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.workedHours + timesheet.homeOfficeHours}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.requiredHours}</td>
                                    <td onClick={(e) => this.openDetailsModal(timesheet, e)}>{timesheet.status === "CLOSED" ? <FaLock/> : <FaLockOpen/>}</td>
                                    <td>
                                        <Button type="button" size={"sm"} className="my-btn-table mr-2 btn-outline-dark"
                                                title="Confirmă pontaj" disabled={timesheet.status === "CLOSED"}
                                                onClick={(e) => this.openConfirmModal(timesheet, e)}><FaRegCalendarCheck/></Button>
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
                                    <h5 className=" m-b-10 mb-3"><strong>Informații angajat</strong></h5>
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
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <h5 className=" m-b-10 mb-3"><strong>Statistici ore</strong></h5>
                                    <Table hover className="list-group-flush text-dark">
                                        <tbody>
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
                                            <td><strong>Total ore lucrate: </strong>
                                                <span className="float-right">{workedHours + homeOfficeHours}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore suplimentare: </strong>
                                                <span className="float-right">{overtimeHours + totalOvertimeHours}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Ore necesare: </strong>
                                                <span className="float-right">{requiredHours}</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={12}>
                                    <h5 className=" m-b-10 mb-3"><strong>Statistici concedii</strong></h5>
                                    <Table hover className="list-group-flush text-dark">
                                        <tbody>
                                        <tr>
                                            <td><strong>Număr zile concediu normal: </strong>
                                                <span className="float-right">{daysTaken}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Concediu din ore suplimentare: </strong>
                                                <span className="float-right">{overtimeLeave} ore</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Număr zile concediu medical: </strong>
                                                <span className="float-right">{medicalLeave}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td><strong>Alte tipuri de concedii: </strong>
                                                <span className="float-right">{otherLeave}</span>
                                            </td>
                                        </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Modal.Body>
                </Modal>
                <Modal show={this.state.showConfirmModal} onHide={this.closeModal} centered>
                    <Modal.Header>
                        <Modal.Title>
                            Confirmare pontaj - {usernameEmployee}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.state.holidayPerMonth <= 0 ?
                            <React.Fragment>
                                <h5 className="text-center"><strong>{date}</strong></h5>
                                <Row>
                                    <Col sm={12}>
                                        <h5 className=" m-b-10 mb-3"><strong>Statistici ore</strong></h5>
                                        <Table hover className="list-group-item-dark">
                                            <tbody>
                                            <tr>
                                                <td>Ore lucrate:
                                                    <strong><span className="float-right">{workedHours}</span></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Ore telemuncă:
                                                    <strong><span className="float-right">{homeOfficeHours}</span></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Ore suplimentare:
                                                    <strong><span className="float-right">{overtimeHours + totalOvertimeHours}</span></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Total ore lucrate:
                                                    <strong><span className="float-right">{totalWorkedHours}</span></strong>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <h5 className=" m-b-10 mb-3"><strong>Statistici concedii</strong></h5>
                                        <Table hover className="list-group-item-dark">
                                            <tbody>
                                            <tr>
                                                <td>Număr zile concediu anual:
                                                    <strong><span className="float-right">{daysTaken}</span></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Număr zile concediu medical:
                                                    <strong><span className="float-right">{medicalLeave}</span></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Concediu din ore suplimentare:
                                                    <strong><span className="float-right">{overtimeLeave} ore</span></strong>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Alte tipuri de concedii:
                                                    <strong><span className="float-right">{otherLeave}</span></strong>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col sm={12}>
                                        <h5 className=" m-b-10 mb-3 text-center"><strong>Sumar</strong></h5>
                                        <Table>
                                            <tbody>
                                            <tr>
                                                <td className={workerHoursWithHoliday >= requiredHours ? "text-center text-success" : "text-center text-danger"}><strong>Total ore: </strong>
                                                    <span>{workerHoursWithHoliday}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-center"><strong>Ore necesare: </strong>
                                                    <span>{requiredHours}</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </Table>
                                    </Col>
                                </Row>
                                {workerHoursWithHoliday >= requiredHours ?
                                    "" :
                                    <div>
                                        <strong><span className="text-danger">Angajatul nu a îndeplinit numărul de ore necesare.</span></strong>
                                        <br/>
                                    </div>
                                }
                                Doriți să confirmați pontajul și să închideți luna?
                            </React.Fragment>
                            :
                            <strong><span>Pontajul nu poate fi confirmat deoarece angajatul are cereri de concediu pentru {date} în așteptare. Contactați superiorul!</span></strong>
                        }
                    </Modal.Body>
                    <Modal.Footer>
                        {this.state.holidayPerMonth <= 0 ?
                            <React.Fragment>
                                <Button className="btn-success" onClick={this.handleConfirmTimesheet}>Da</Button>
                                <Button className="btn-danger" onClick={this.closeModal}>Nu</Button>
                            </React.Fragment>
                            :
                            <Button variant="primary" onClick={this.closeModal}>Ok</Button>
                        }
                    </Modal.Footer>
                </Modal>
            </Card>
        );
    }
}



