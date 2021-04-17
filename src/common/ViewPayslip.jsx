import React from "react";
import {FaTimes} from "react-icons/all";

export default class ViewPayslip extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            payslip: [],
            an: "",
            luna: "",
            bool: true
        };

        this.renderPayslip = this.renderPayslip.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

     renderPayslip = (payslip) => {
        let {year, month, idPayslip, firstName, lastName, companyName, personalNumber, department, position, baseSalary, grossSalary, overtimeIncreases, increases, ticketsValue, workedHours, homeOfficeHours, requiredHours, overtimeHours, cas, cass, iv, taxExempt, netSalary} = payslip;
        return (
            <React.Fragment>
                <div className="col-xs-12 col-md-10 ml-md-5 pr-xl-5 pt-xl-5 mr-xl-5 d-flex justify-content-center">
                    <div className="card text-left mb-4 ml-xl-0" style={{opacity: ".85"}} >
                        <div className="card-header text-center text-monospace my-label bg-dark">
                            Fluturaș Salariu
                        </div>
                        <div className="card-body"><h4 className="payslip-title">Fluturaș Salariu {month}-{year}</h4>
                            <div className="row">
                                <div className="col-sm-6 m-b-20">
                                    <ul className="list-unstyled">
                                        <li><h5 className="mb-0"><strong>{lastName} {firstName}</strong></h5></li>
                                        <li><span>{department}</span></li>
                                        <li>Număr personal: {personalNumber}</li>
                                        <li>Poziție: {position}</li>
                                    </ul>
                                </div>
                                <div className="col-sm-6 m-b-20">
                                    <ul className="list-unstyled mb-0">
                                        <li><h5 className="mb-0"><strong>{companyName}</strong></h5></li>
                                        <li><span>ID: #{idPayslip}</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div><h4 className="m-b-10"><strong>Venituri</strong></h4>
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td><strong>Salariu de bază</strong>
                                                        <span className="float-right">{baseSalary} Ron</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Plată ore suplimentare</strong>
                                                        <span className="float-right">{overtimeIncreases} Ron</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Sporuri</strong> <span
                                                        className="float-right">{increases} Ron</span></td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Salariu Brut</strong>
                                                        <span className="float-right"><strong>{grossSalary} Ron</strong></span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Tichete de masă</strong>
                                                        <span className="float-right">{ticketsValue} Ron</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td><strong>Total Venituri</strong>
                                                        <span className="float-right"><strong>{baseSalary + ticketsValue + overtimeIncreases + increases} Ron</strong></span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div><h4 className="m-b-10"><strong>Situație Ore</strong></h4>
                                        <table className="table table-bordered">
                                            <tbody>
                                            <tr>
                                                <td><strong>Ore standard</strong>
                                                    <span className="float-right">{workedHours}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Ore Telemuncă</strong>
                                                    <span className="float-right">{homeOfficeHours}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Ore suplimentare</strong> <span
                                                    className="float-right">{overtimeHours}</span></td>
                                            </tr>
                                            <tr>
                                                <td>Norma lunară
                                                    <span className="float-right">{requiredHours}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total ore lucrate</strong>
                                                    <span className="float-right"><strong>{workedHours + homeOfficeHours + overtimeHours}</strong></span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div><h4 className="m-b-10"><strong>Taxe</strong></h4>
                                        <table className="table table-bordered">
                                            <tbody>
                                            <tr>
                                                <td><strong>Asigurări Sociale (CAS) 25%</strong>
                                                    <span className="float-right">{cas} Ron</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Asigurări Sociale de Sănătate (CASS) 10%</strong>
                                                    <span className="float-right">{cass} Ron</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Impozit pe venit (IV) 10%</strong>
                                                    <span className="float-right">{taxExempt ? <FaTimes/> : iv + " Ron"} </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total Taxe</strong>
                                                    <span className="float-right"><strong>{cas + cass + iv} Ron</strong></span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div><h5 className="m-b-10 text-center"><strong>Rest de plată</strong></h5>
                                        <table className="table">
                                            <tbody>
                                            <tr>
                                                <td className="text-center"><strong>Salariu Net: </strong>
                                                    <span>{netSalary} Ron</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="text-center"><strong>Tichete de masă: </strong>
                                                    <span>{ticketsValue * 90 / 100} Ron</span>
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    handleFilter = () => {
        const payload = {
            username: localStorage.getItem('username'),
            an : this.state.an,
            luna: this.state.luna
        }
        let payslipID = payload.username + payload.an + payload.luna
        fetch('http://localhost:8080/payslip/' + payslipID, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({payslip: json});
                        this.setState({bool: false});
                    });
                    // LOGIN PERSISTANCE
                }
                else {
                    console.log("error")
                    console.log(payload.username)
                }
            })
    }

    render(){
        return (
            <div className="card-deck justify-content-center d-flex align-items-center align-middle mt-3 col-auto">
                <input className="col-sm-2 mt-md-4 mb-2 ml-5 ml-lg-0 mr-5 rounded border" name="an" type="text" placeholder="An" onChange={this.handleChange}/>
                <input className="col-sm-2 mt-md-4 mb-2 ml-5 ml-md-0 mr-5 rounded border" name="luna" type="text" placeholder="Luna" onChange={this.handleChange}/>
                <button className="my-btn mt-md-4 mb-2" onClick={this.handleFilter}>Caută</button>
                {this.state.bool ? null : this.renderPayslip(this.state.payslip)}
            </div>
        );
    }
}
