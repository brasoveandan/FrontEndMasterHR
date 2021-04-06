import React from "react";

export default class ViewHoliday extends React.Component{
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
        let {firstName, lastName, companyName, personalNumber, year, month , brutSalary, netSalary, realizedSalary, workedHours, homeOfficeHours, requiredHours} = payslip;
        return(
            <React.Fragment>
                <div className="col-sm-11 col-lg-8 ml-md-5 pr-xl-5 pt-xl-5 mr-xl-5 d-flex justify-content-center">
                    <div className="card text-center mb-4 ml-xl-0" style={{opacity: ".75"}} >
                        <div className="card-header text-monospace my-label bg-dark">
                            Vizualizare Pontaj
                        </div>
                        <div className="card-body">
                            <div className="card-text">
                                <div className="my-card-elem border-bottom">
                                    Nume: {lastName}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Prenume: {firstName}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Companie: {companyName}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Cod personal: {personalNumber}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    An: {year}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Luna: {month}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Salar Brut: {brutSalary}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Salar Net: {netSalary}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Salar realizat: {realizedSalary}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Ore lucrate: {workedHours}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Ore telemuncă: {homeOfficeHours}
                                </div>
                                <div className="my-card-elem border-bottom mt-3">
                                    Ore necesare: {requiredHours}
                                </div>
                                {/*<div className={expirationDate ? 'my-card-elem border-bottom mt-3' : 'invisible'}>*/}
                                {/*    Data expirarea: {expirationDate}*/}
                                {/*</div>*/}
                            </div>
                        </div>
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
                <input className="mr-5 my-label" type="text" placeholder="An" />
                <input className="mr-5 my-label" type="text" placeholder="Luna" />
                <button className="my-btn" onClick={this.handleFilter}>Filter</button>
                {this.renderPayslip(this.state.payslip)}
            </div>
        );
    }


}
