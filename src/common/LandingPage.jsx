import React from "react"
import {Card} from "react-bootstrap";

export default class LandingPage extends React.Component{

    renderPage(text){
        return (
            <div className="d-flex justify-content-center mr-xl-5 pr-xl-5">
                <Card className="text-center w-100" style={{opacity: ".85"}}>
                    <Card.Header className="bg-dark my-label font-weight-bold">
                        <h4>Salutare, {localStorage.getItem("name")}!</h4>
                    </Card.Header>
                    <Card.Body>
                        <Card.Title>
                            <h5>Bine ai revenit!</h5>
                        </Card.Title>
                        <span className="card-text">
                            {text}
                        </span>
                    </Card.Body>
                </Card>
                <br/>
            </div>
        )
    }
}
