import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import Alert from 'react-bootstrap/Alert'
import CustomHeader from './common';
import { Loader } from 'react-overlay-loader';
import ApiCalls from "../helpers/ApiCalls";
import IdentificationHelper from "../helpers/IdentificationHelper";
import 'react-overlay-loader/styles.css';
import '../../css/App.css';

class Actions extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            show: false,
            personGroupId: "",
        }
    }
    
    showActions(personGroupId) {
        this.setState({ personGroupId: personGroupId, show: true });
    }

    render() {
        return (
            !this.state.show ? (
                <Fragment></Fragment>
            ) : (
                <Container>
                    <Row>
                        <Col>
                            <CustomHeader title="Actions" />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <TrainGroup personGroupId={this.state.personGroupId} />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Identify personGroupId={this.state.personGroupId} />
                        </Col>
                    </Row>
                </Container>
            )
        )
    }
}

class Identify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false, 
            picture: null,
            showLoadingOverlay: false,
            results: null,
            showResults: false
        }
        this.openModal = this.openModal.bind(this)
        this.closeModal = this.closeModal.bind(this)
    }

    openModal() {
        this.setState({ modalOpen: true })
    }

    closeModal() {
        this.setState({ modalOpen: false })
    }

    setPicture = e => {
        this.setState({ picture: e.target.files[0] })
    }

    identificationCompleteted(output) {
        this.setState({results: output, showResults: true, showLoadingOverlay: false});
    }

    identify = e => { 
        if (this.state.picture !== null) {
            this.setState({ modalOpen: false, showLoadingOverlay: true }, () => {
                // Post photo to detect face first
                var reader = new FileReader();
                reader.onload = () => {
                    let idHelper = new IdentificationHelper();
                    idHelper.Detect(reader.result)
                        .then (facesDetected => {
                            if (facesDetected.length > 0) {
                                // Now that we got the face(s) on the picture, let's identify them against our personGroup
                                idHelper.Identify(this.props.personGroupId, facesDetected)
                                    .then (facesIdentified => {
                                        // We do not have the candidate name in the return json, so ask for it ...
                                        facesIdentified.forEach(face => {
                                            //For each faceId found in the picture
                                            if (face.candidates.length > 0) {
                                                // For each candidates, get the name
                                                var allCalls = []
                                                face.candidates.forEach((c) => {
                                                    const candidate = idHelper.Authentify(this.props.personGroupId, c.personId, c.confidence);
                                                    allCalls.push(candidate);
                                                });
                                                // Wait for all the async calls before sending the results
                                                Promise.all(allCalls)
                                                    .then(value => {
                                                        this.identificationCompleteted(
                                                            {
                                                                ok: true,
                                                                message: "I have found the following candidates: ",
                                                                candidates: value
                                                            }
                                                        );
                                                    })
                                            }
                                            else {
                                                this.identificationCompleteted(
                                                    {
                                                        ok: false,
                                                        message: "No matching candidates were found in the picture."
                                                    }
                                                );
                                            }
                                            return;
                                        });
                                        
                                    });
                            }
                            else {
                                this.identificationCompleteted(
                                    {
                                        ok: false,
                                        message: "This picture does not contain any face."
                                    }
                                );
                            }
                        }); 
                };
                reader.readAsArrayBuffer(this.state.picture);
            });
        }
    }

    render() {
        let modalClose = () => this.setState({ showResults: false });

        return (
            <Fragment>
                <Button variant="primary" onClick={this.openModal}>Identify</Button>
                <Modal show={this.state.modalOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload a picture</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formPersonPicture">
                                <Form.Label>Pick a local picture</Form.Label>
                                <Form.Control type="file" accept='image/*' placeholder="Local picture" onChange={this.setPicture} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.identify}>
                            Identify
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Loader fullPage loading={this.state.showLoadingOverlay} text="Identification ..." 
                    containerStyle={{background: "rgba(255, 255, 255, 0.9)"}}/>
                <IdentficationResults show={this.state.showResults} onHide={modalClose} results={this.state.results}/>
            </Fragment>
        );
    }
}

class IdentficationResults extends Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    render() {
        return (
            <Modal {...this.props}>
                <Modal.Header closeButton>
                    <Modal.Title>Results of the identification</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {
                        this.props.results !== null &&
                            <Alert variant={this.props.results.ok ? "success" : "danger"}>
                                {this.props.results.ok === false &&
                                    <Fragment>{this.props.results.message}</Fragment>
                                }
                                {this.props.results.ok === true &&
                                    <Fragment>
                                        {this.props.results.message}
                                        {this.props.results.candidates.map((c) => {return `${c.name} with a confidence of ${c.confidence}`}).join(",")}
                                    </Fragment>
                                }
                            </Alert> 
                    }  
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        );
    }
}

class TrainGroup extends Component {

    constructor(props) {
        super(props)
        this.state = {
            showLoadingOverlay: false
        }
    }

    startTraining = e => {
        this.setState({ showLoadingOverlay: true }, () => {
            var api = new ApiCalls();
            api.Post(api.personGroupTrainEndPoint(this.props.personGroupId))
                .then(rest => {
                    this.timer = setInterval(() => this.checkTraining(), 5000);
                });
        }); 
    }

    checkTraining() {
        var api = new ApiCalls();
        api.Get(api.personGroupTrainingCheckEndPoint(this.props.personGroupId))
            .then(response => response.json())
            .then(data => {
                if (data.status === "succeeded") {
                    // Done!
                    clearInterval(this.timer);
                    this.timer = null;
                    this.setState({ showLoadingOverlay: false });
                }
            });
    }

    render() {
        return (
            <Fragment>
                <Button variant="primary" onClick={this.startTraining}>Train group</Button>
                <Loader fullPage loading={this.state.showLoadingOverlay} text="Training in progress ..." 
                    containerStyle={{background: "rgba(255, 255, 255, 0.9)"}}/>
            </Fragment>
        );
    }
}

export default Actions;