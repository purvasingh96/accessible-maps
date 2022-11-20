import {Container} from 'react-bootstrap';
import * as React from 'react';

type AudiomProps ={
    iframeUrl: string
}

export default function Audiom(props:AudiomProps) {
    return (
        <Container fluid>
            <iframe name="Audio Map 4" src={props.iframeUrl} width="1000" height="800"></iframe> 
        </Container>
    )
}

