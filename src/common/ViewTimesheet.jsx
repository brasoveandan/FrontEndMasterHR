import React from "react";
import {Modal} from "react-bootstrap";

export default class ViewTimesheet extends React.Component{
    constructor(){
        super(undefined);
        this.state = {
            payslip: [],
            show: false
        };

        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)

        const payload = {
            username: localStorage.getItem('username')
        }

        // fetch('http://localhost:8080/timesheet/' + payload.username, {
        //     method: 'GET',
        //     headers: {
        //         'Accept' : 'application/json',
        //         'Content-type':'application/json'
        //     }
        // })
        //     .then(res => {
        //         if (res.status === 200) {
        //             res.json().then(json =>{
        //                 this.setState({contract: json});
        //             });
        //             // LOGIN PERSISTANCE
        //         }
        //         else {
        //             console.log("error")
        //             console.log(payload.username)
        //         }
        //     })
    }

    openModal() {
        this.setState({
            show: true
        });
    }

    closeModal = e => {
        this.setState({
            show: false
        });

    };

    render(){
        return (
            <div className="content container-fluid">
                <div className="row mt-4 mb-4 ml-sm-5 ml-md-0" style={{opacity: ".85"}}>
                    <div className="col-sm-12">
                        <div className="card bg-dark">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-6 mb-3">
                                        <div className="card punch-status">
                                            <div className="card-body">
                                                <h5 className="card-title">Pontaj
                                                    <span className="text-muted"> 11 Mar 2019</span>
                                                </h5>
                                                <div className="punch-det text-white bg-dark">
                                                    <h6>Pontat la</h6>
                                                    <p>Wed, 11th Mar 2019 10.00 AM</p>
                                                </div>
                                                <div className="text-center">
                                                    <button className="my-btn punch-btn" type="button">Depontare</button>
                                                </div>
                                            </div>
                                            <div className="card-footer bg-white border-top border-dark text-center">
                                                <button className="my-btn" type="button" onClick={this.openModal}>Adaugă pontaj manual</button>
                                            </div>
                                            <Modal show={this.state.show} onHide={this.closeModal}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Adaugă pontaj</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <div className="container container-fluid mt-5 mb-5">
                                                        <div className="card">
                                                            <div className="card-header">
                                                                <div className="card-body">
                                                                    <form>
                                                                        <div className="form-group">
                                                                            <label>Tip<span className="text-danger">*</span></label>
                                                                            <select className="select select2-hidden-accessible" data-select2-id="7" tabIndex="-1" aria-hidden="true">
                                                                                <option data-select2-id="9">Selectează Tip</option>
                                                                                <option data-select2-id="18">Telemuncă</option>
                                                                                <option data-select2-id="19">Normal</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Oră intrare <span className="text-danger">*</span></label>
                                                                            <div className="cal-icon">
                                                                                <input className="form-control" placeholder="Ora intrare" type="datetime-local"/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Oră ieșire <span className="text-danger">*</span></label>
                                                                            <div className="cal-icon">
                                                                                <input className="form-control" placeholder="Ora iesire" type="datetime-local"/>
                                                                            </div>
                                                                        </div>
                                                                        <div className="form-group">
                                                                            <label>Motiv <span className="text-danger">*</span></label>
                                                                            <textarea rows="3" className="form-control"/>
                                                                        </div>
                                                                        <div className="submit-section text-center">
                                                                            <button className="my-btn">Trimite</button>
                                                                        </div>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Modal.Body>
                                            </Modal>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 mb-3">
                                        <div className="card att-statistics rounded">
                                            <div className="card-body">
                                                <h5 className="card-title">Statistici ore</h5>
                                                <div className="stats-list">
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Luna curentă <strong>90 <small>/ 160 ore</small></strong></span>
                                                        <div className="progress">
                                                            <div className="progress-bar" role="progressbar" aria-valuenow={3.45/8*100} aria-valuemin="0" aria-valuemax="100" style={{width: "35%"}}/>
                                                        </div>
                                                    </div>
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Ore telemuncă <strong>28 <small>/ 40</small></strong></span>
                                                        <div className="progress">
                                                            <div className="progress-bar" role="progressbar" aria-valuenow="31" aria-valuemin="0" aria-valuemax="100"/>
                                                        </div>
                                                    </div>
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Ore necesare <strong>90 <small>/ 160</small></strong></span>
                                                        <div className="progress">
                                                            <div className="progress-bar" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style={{width: "35%"}}/>
                                                        </div>
                                                    </div>
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Ore suplimentare luna curentă <strong>90</strong></span>
                                                        <div className="progress">
                                                            <div className="progress-bar" role="progressbar" aria-valuenow="62" aria-valuemin="0" aria-valuemax="100" style={{width: "35%"}}/>
                                                        </div>
                                                    </div>
                                                    <div className="stats-info bg-dark text-white">
                                                        <span>Total ore suplimentare <strong>4</strong></span>
                                                        <div className="progress">
                                                            <div className="progress-bar" role="progressbar" aria-valuenow="22" aria-valuemin="0" aria-valuemax="100" style={{width: "35%"}}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-12 text-center mb-3">
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="an" type="text" placeholder="An" onChange={this.handleChange}/>
                                        <input className="col-sm-3 ml-md-3 mt-md-4 mb-2 rounded mr-4" name="luna" type="text" placeholder="Luna" onChange={this.handleChange}/>
                                        <button className="col-sm-3 ml-md-3 btn-success btn text-uppercase font-weight-bold" type="submit" onClick={this.handleFilter}>Caută</button>
                                    </div>
                                    <div className="col-sm-12">
                                        <div className="table-responsive rounded">
                                            <table className="table bg-white table-striped table-hover">
                                                <thead className="text-center">
                                                <tr>
                                                    <th>Ziua</th>
                                                    <th>Oră intrare</th>
                                                    <th>Oră ieșire</th>
                                                    <th>Ore lucrate</th>
                                                    <th>Ore suplimentare</th>
                                                </tr>
                                                </thead>
                                                <tbody className="text-center">
                                                <tr>
                                                    <td>19</td>
                                                    <td>10:00</td>
                                                    <td>19:00</td>
                                                    <td>9 ore</td>
                                                    <td>0</td>
                                                </tr>
                                                <tr>
                                                    <td>20</td>
                                                    <td>10:00</td>
                                                    <td>19:00</td>
                                                    <td>9 ore</td>
                                                    <td>0</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
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
