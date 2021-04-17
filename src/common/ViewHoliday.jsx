import React from "react";

export default class ViewHoliday extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            payslip: []
        };

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

    render(){
        return (
            <div className="content container-fluid">
                <div className="row mt-4 mb-4 ml-sm-5 ml-md-0" style={{opacity: ".85"}}>
                    <div className="col-sm-12">
                        <div className="card">
                            <div className="card-header my-label bg-dark text-center text-monospace">
                                <h4>Vizualizare Concedii</h4>
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-3">
                                       <div className="stats-info bg-dark text-white"><h6>Annual Leave</h6><h4>12</h4></div>
                                    </div>
                                    <div className="col-sm-3">
                                       <div className="stats-info bg-dark text-white"><h6>Medical Leave</h6><h4>3</h4></div>
                                    </div>
                                    <div className="col-sm-3">
                                       <div className="stats-info bg-dark text-white"><h6>Other Leave</h6><h4>4</h4></div>
                                    </div>
                                    <div className="col-sm-3">
                                       <div className="stats-info bg-dark text-white"><h6>Remaining Leave</h6><h4>5</h4></div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}
