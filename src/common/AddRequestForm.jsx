import React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class AddRequestForm extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            description: "",
            requestStatus: "PENDING",
            type         : "",
            date         : "",//data curenta
            fromDate     : "", //from si to sa alegem noi
            toDate       : "",
            proxyName    : ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.doSubmit = this.doSubmit.bind(this);
    }

    doSubmit = () => {
        const payload = {
            usernameEmployee: localStorage.getItem('username'),
            description: this.state.description,
            requestStatus: this.state.requestStatus,
            type: this.state.type,
            date: this.state.date,
            fromDate: this.state.fromDate,
            toDate: this.state.toDate,
            proxyName: this.state.proxyName
        }
        //console.log(payload);
        fetch('http://localhost:8080/hr/saveRequest', {
            method: 'POST',
            headers: {
                'Accept' : 'application/json',
                'Content-type':'application/json'
            },
            body: JSON.stringify(payload)
        })
            .then(res => {
                if (res.status === 200) {
                    alert("Cererea s-a inregistrat cu succes!");
                    this.state = {
                        description: "",
                        requestStatus: "PENDING",
                        type         : "",
                        date         : "",//data curenta
                        fromDate     : "", //from si to sa alegem noi
                        toDate       : "",
                        proxyName    : ""
                    };
                }
                else if(res.status === 417){
                    res.text().then(text =>{

                        console.log(text);

                    });
                }
            })
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        })
    };

    render() {
        return (
            <div className="container container-fluid mt-5 mb-5">
                <div className="card">
                    <div className="card-header">
                        <div className="modal-header text-monospace">
                            <h5 className="modal-title">Adaugă cerere</h5>
                        </div>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label>Tip cerere <span className="text-danger">*</span></label>
                                    <select className="select select2-hidden-accessible" data-select2-id="7" tabIndex="-1" aria-hidden="true">
                                        <option data-select2-id="9">Select Leave Type</option>
                                        <option data-select2-id="18">Casual Leave 12 Days</option>
                                        <option data-select2-id="19">Medical Leave</option>
                                        <option data-select2-id="20">Loss of Pay</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Din <span className="text-danger">*</span></label>
                                    <div className="cal-icon">
                                        <input className="form-control" type="date"></input>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Pâna la <span className="text-danger">*</span></label>
                                    <div className="cal-icon">
                                        <input className="form-control" type="date"/>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Number of days <span className="text-danger">*</span></label>
                                    <input className="form-control" readOnly="" type="text"/>
                                </div>
                                <div className="form-group">
                                    <label>Remaining Leaves <span className="text-danger">*</span></label>
                                    <input className="form-control" readOnly="" type="text" />
                                </div>
                                <div className="form-group">
                                    <label>Motiv <span className="text-danger">*</span></label>
                                    <textarea rows="4" className="form-control"/>
                                </div>
                                <div className="submit-section text-center">
                                    <button className="my-btn">Trimite</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};
