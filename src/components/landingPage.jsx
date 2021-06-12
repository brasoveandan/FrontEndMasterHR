import React from "react"
import {Card} from "react-bootstrap";
import Clock from 'react-live-clock';

export const LandingPage = () => (
        <Card className="text-center mt-5" style={{opacity: ".85"}}>
            <Card.Header className="bg-dark my-label font-weight-bold">
                <h3>Salutare, {sessionStorage.getItem("name")}!</h3>
            </Card.Header>
            <Card.Body>
                <Card.Title>
                    <h4>Bine ai revenit!</h4>
                </Card.Title>
                <h4>
                    <Clock
                        format={"DD-MM-YYYY, HH:mm:ss"}
                        ticking={true}
                        timezone={"Europe/Bucharest"}
                    />
                </h4>
            </Card.Body>
        </Card>
    )
