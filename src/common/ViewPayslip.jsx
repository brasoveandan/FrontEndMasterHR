import React from "react";
import {Form} from "react-bootstrap";

export default class ViewPayslip extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            payslip: []
        };

        this.renderPayslip = this.renderPayslip.bind(this);

        const payload = {
            username: localStorage.getItem('username')
        }

        fetch('http://localhost:8080/payslip/' + payload.username, {
            method: 'GET',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    res.json().then(json =>{
                        this.setState({contract: json});
                    });
                    // LOGIN PERSISTANCE
                }
                else {
                    console.log("error")
                    console.log(payload.username)
                }
            })
    }

    renderPayslip = (payslip) => {
        let {firstName, taxExempt, lastName, companyName, personalNumber, year, ticketsValue , brutSalary, netSalary, increases, workedHours, homeOfficeHours, requiredHours, overtimeHours} = payslip;
        // if (taxExempt)
        //     let procentImpozit = 10%
        return(
            <React.Fragment>
                <div className="col-sm-11 col-lg-8 ml-md-5 pr-xl-5 pt-xl-5 mr-xl-5 d-flex justify-content-lef">
                    <div className="card text-left mb-4 ml-xl-0" style={{opacity: ".75"}} >
                        <div className="card-header text-center text-monospace my-label bg-dark">
                            Fluturaș Salariu
                        </div>
                        <div className="card-body"><h4 className="payslip-title">Payslip for the month of Feb 2019</h4>
                            <div className="row">
                                <div className="col-sm-6 m-b-20">
                                    <ul className="list-unstyled mb-0">
                                        <li>Dreamguy's Technologies</li>
                                        <li>3864 Quiet Valley Lane,</li>
                                        <li>Sherman Oaks, CA, 91403</li>
                                    </ul>
                                </div>
                                <div className="col-sm-6 m-b-20">
                                    <div className="invoice-details"><h3 className="text-uppercase">Payslip #49029</h3>
                                        <ul className="list-unstyled">
                                            <li>Salary Month: <span>March, 2019</span></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-12 m-b-20">
                                    <ul className="list-unstyled">
                                        <li><h5 className="mb-0"><strong>John Doe</strong></h5></li>
                                        <li><span>Web Designer</span></li>
                                        <li>Employee ID: FT-0009</li>
                                        <li>Joining Date: 1 Jan 2013</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <div><h4 className="m-b-10"><strong>Earnings</strong></h4>
                                        <table className="table table-bordered">
                                            <tbody>
                                            <tr>
                                                <td><strong>Basic Salary</strong> <span
                                                    className="float-right">$6500</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>House Rent Allowance (H.R.A.)</strong> <span
                                                    className="float-right">$55</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Conveyance</strong> <span className="float-right">$55</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td><strong>Other Allowance</strong> <span
                                                    className="float-right">$55</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total Earnings</strong> <span
                                                    className="float-right"><strong>$55</strong></span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-sm-6">
                                    <div><h4 className="m-b-10"><strong>Deductions</strong></h4>
                                        <table className="table table-bordered">
                                            <tbody>
                                            <tr>
                                                <td><strong>Tax Deducted at Source (T.D.S.)</strong> <span
                                                    className="float-right">$0</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Provident Fund</strong> <span
                                                    className="float-right">$0</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>ESI</strong> <span className="float-right">$0</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Loan</strong> <span className="float-right">$300</span></td>
                                            </tr>
                                            <tr>
                                                <td><strong>Total Deductions</strong> <span
                                                    className="float-right"><strong>$59698</strong></span></td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-sm-12"><p><strong>Net Salary: $59698</strong> (Fifty nine thousand
                                    six hundred and ninety eight only.)</p></div>
                            </div>
                        </div>
                        {/*<div className="card-body">*/}
                        {/*    <div className="card-text">*/}
                        {/*        <div className="border-bottom">*/}
                        {/*            Nume: {lastName}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Prenume: {firstName}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Companie: {companyName}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom border-info mt-3">*/}
                        {/*            Cod personal: {personalNumber}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem text-uppercase border-bottom mt-4">*/}
                        {/*            Salariu de bază: {year}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Ore lucrate: {workedHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Ore telemuncă: {homeOfficeHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Ore necesare: {requiredHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Ore suplimentare: {overtimeHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Sporuri: {increases}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem text-uppercase border-bottom mt-4">*/}
                        {/*            Salariu Brut: {brutSalary}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Tichete de masă: {ticketsValue}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem text-uppercase border-bottom mt-3">*/}
                        {/*            Total venituri: {ticketsValue}*/}
                        {/*        </div>*/}

                        {/*        <div className="my-card-elem border-bottom mt-4">*/}
                        {/*            Asigurări Sociale (CAS) 25%: {workedHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Asigurări Sociale de Sănătate (CASS) 10%: {homeOfficeHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Impozit pe venit (IV): {requiredHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem text-uppercase border-bottom mt-4">*/}
                        {/*            Total Taxe: {requiredHours}*/}
                        {/*        </div>*/}
                        {/*        <div className="my-card-elem border-bottom mt-3">*/}
                        {/*            Salariu Net: {netSalary}*/}
                        {/*        </div>*/}

                        {/*        <div className="my-card-elem text-uppercase border-bottom mt-4">*/}
                        {/*            Rest de plată: {netSalary}*/}
                        {/*        </div>*/}
                        {/*        /!*<div className={expirationDate ? 'my-card-elem border-bottom mt-3' : 'invisible'}>*!/*/}
                        {/*        /!*    Data expirarea: {expirationDate}*!/*/}
                        {/*        /!*</div>*!/*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                    </div>
                </div>
            </React.Fragment>
        )
    }

    handleFilter() {

    }

    render(){
        return (
            <div className="card-deck justify-content-center d-flex align-items-center align-middle mt-5 col-auto">
                <input className="col-sm-2 mr-5 my-label rounded border" type="text" placeholder="An" />
                <input className="col-sm-2 mr-5 my-label rounded border" type="text" placeholder="Luna" />
                <button className="my-btn" onClick={this.handleFilter}>Caută</button>
                {this.renderPayslip(this.state.payslip)}
            </div>
        );
    }


}
