import React from "react";

export default class ViewContract extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            contract: []
        };

        this.renderContract = this.renderContract.bind(this);

        const payload = {
            username: localStorage.getItem('username')
        }

        fetch('http://localhost:8080/contract/' + payload.username, {
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

    renderContract = (contract) => {
        let {firstName, lastName, companyName, personalNumber, socialSecurityNumber, phoneNumber , mail, department, position, grossSalary, type, hireDate, expirationDate} = contract;
        if(expirationDate == null){
            expirationDate= false
        }
        return(
            <div className="col-sm-11 col-lg-8 ml-md-5 pr-xl-5 pt-xl-5 mr-xl-5 d-flex justify-content-center">
                <div className="card text-center mb-4 ml-xl-0" style={{opacity: ".75"}} >
                    <div className="card-header text-monospace my-label bg-dark">
                        Detalii contract
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
                                E-mail: {mail}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                Numar telefon: {phoneNumber}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                CNP: {socialSecurityNumber}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                Departament: {department}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                Functie: {position}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                Salar: {grossSalary}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                Data angajare: {hireDate}
                            </div>
                            <div className="my-card-elem border-bottom mt-3">
                                Tip: {type}
                            </div>
                            <div className={expirationDate ? 'my-card-elem border-bottom mt-3' : 'invisible'}>
                                Data expirarea: {expirationDate}
                            </div>
                        </div>
                </div>
                </div>
            </div>
        )
    }

    render(){
        return (
            <div className="card-deck justify-content-center d-flex align-items-center align-middle mt-5 col-auto">
                {this.renderContract(this.state.contract)}
            </div>
        );
    }
}
