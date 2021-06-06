import React from "react"
import {Card} from "react-bootstrap";

export default class LandingPage extends React.Component{

    renderPage(text){
        return (
            <Card className="text-center mt-5" style={{opacity: ".85"}}>
                <Card.Header className="bg-dark my-label font-weight-bold">
                    <h4>Salutare, {sessionStorage.getItem("name")}!</h4>
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
        )
    }
}
