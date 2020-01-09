import React, { Component, Fragment } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import '../../css/App.css';
import ApiCalls from "../helpers/ApiCalls";
import Fetchino from 'react-fetchino';
import { Loader } from 'react-overlay-loader';
import 'react-overlay-loader/styles.css';

class GroupPersonDelete extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modalOpen: false,
            showLoadingOverlay: false, 
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

    delete = e => {
        this.setState({ modalOpen: false, showLoadingOverlay: true }, () => {
            var api = new ApiCalls();
            api.Delete(api.personGroupsEndPoint(this.props.group.personGroupId))
            .then(rest => {
                this.props.onChanged();
            });
        });
    }
    
    render() {
        return (
            <Fragment>
                <img    width={16}
                        height={16}
                        onClick={this.openModal}
                        src="img/delete.png" alt="delete" /> 
                
                <Modal show={this.state.modalOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete the group '{this.props.group.name}'
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.delete}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Loader fullPage loading={this.state.showLoadingOverlay} containerStyle={{background: "rgba(255, 255, 255, 0.9)"}}/>
                
            </Fragment>
        )
    }
}

class GroupPersonEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showLoadingOverlay: false, 
            modalOpen: false,
            newGroupName: "",
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

    setNewGroupName = e => {
        this.setState({ newGroupName: e.target.value })
    }

    edit = e => {
        this.setState({ modalOpen: false, showLoadingOverlay: true }, () => {
            let body = {
                name: this.state.newGroupName, 
                userData: ""
            };
    
            var api = new ApiCalls();
            api.Patch(api.personGroupsEndPoint(this.props.group.personGroupId), body)
                .then(rest => {
                    // Tell the parent we've updated a new item
                    this.setState({ showLoadingOverlay: false }, () => {
                        this.closeModal();
                        this.props.onChanged();
                    });
                });
        });
    }
    
    render() {
        return (
            <Fragment>
                <img    width={16}
                        height={16}
                        onClick={this.openModal}
                        src="img/edit.png" alt="delete" /> 
                
                <Modal show={this.state.modalOpen} onHide={this.closeModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Group name</Form.Label>
                                <Form.Control type="text" defaultValue={this.props.group.name} readOnly={false} onChange={this.setNewGroupName} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.edit}>
                            Save
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Loader fullPage loading={this.state.showLoadingOverlay} containerStyle={{background: "rgba(255, 255, 255, 0.9)"}}/>
                
            </Fragment>
        )
    }
}

class GroupPersonsItems extends Component {
    onSelect = (e, personGroupId) => {
        this.props.onSelect(personGroupId);
    }

    onChanged = () => {
        // Item has been deleted, tell the parent to refresh
        this.props.onChanged();
    }

    render() {
        const groups = this.props.groups
        return (
            groups.map((group) => 
              <Container key={group.personGroupId} className="group-list">
                  <Row>
                      <Col sm={10} onClick={(e) => this.onSelect(e, group.personGroupId)}>
                        <img
                            width={44}
                            height={44}
                            src="img/groupPerson.png"
                            alt="Group"
                        />
                        <h5>{group.name}</h5>
                      </Col>
                      <Col sm={2} className="group-actions-button">
                            <GroupPersonDelete onChanged={this.onChanged} group={group}  />
                            <GroupPersonEdit onChanged={this.onChanged} group={group}  />
                      </Col>
                  </Row>
              </Container>
            )
        )
    }
}

class GroupPersons extends Component {
    constructor(props) {
        super(props)
        this.state = { }
    }

    handleSelection = (personGroupId) => {
        this.props.onSelect(personGroupId);
    }

    onChanged = () => {
        // Item has been added/removed/updated, relead the component
        this.forceUpdate(() => {});
    }

    render() {
        var api = new ApiCalls();
        const url = api.personGroupsEndPoint();
        const headers = api.getCommonHeaders();
        const options = {
            headers
        };

        return (  
            <Fragment>
                <fieldset className="col-header">
                    <legend><AddGRoupPerson onChanged={this.onChanged} /> Groups</legend>
                    <Fragment>
                        <Fetchino
                            url={url}
                            options={options}
                            render={({ loading, error, data }) => (
                            <Fragment>
                                {loading && <Loader loading containerStyle={{background: "rgba(255, 255, 255, 0.9)"}}/>}
                                {error && <div>{error}</div>}
                                {data && <GroupPersonsItems groups={data} 
                                            onSelect={this.handleSelection} 
                                            onChanged={this.onChanged}/>
                                }
                            </Fragment>
                            )}
                        />
                    </Fragment>
                </fieldset>
            </Fragment>
        );
    }
}

class AddGRoupPerson extends Component {
    
    constructor(props) {
        super(props)
        this.state = { 
            modalOpen: false, 
            newGroupName: "",
            newGroupID: "", 
            showLoadingOverlay: false
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

    setNewGroupName = e => {
        this.setState({ newGroupName: e.target.value })
    }

    setNewGroupID = e => {
        this.setState({ newGroupID: e.target.value })
    }

    submit = e => {
        this.setState({ modalOpen: false, showLoadingOverlay: true }, () => {
            let body = {
                name: this.state.newGroupName, 
                userData: "",
                recognitionModel: ""
            };
    
            var api = new ApiCalls();
            api.Put(api.personGroupsEndPoint(this.state.newGroupID), body)
                .then(rest => {
                    // Tell the parent we've added a new item
                    this.setState({ showLoadingOverlay: false }, () => {
                        this.closeModal();
                        this.props.onChanged();
                    });
                });
        });
    }

    render () {
        return (
            <Fragment>
                <img 
                    src="img/add.png" 
                    width={22}
                    height={22}
                    className="add-button"
                    alt="Add group"
                    onClick={this.openModal}   />
                
                <Modal show={this.state.modalOpen} onHide={this.closeModal} >
                    <Modal.Header closeButton>
                        <Modal.Title>Add a new group</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group controlId="formGroupName">
                                <Form.Label>Group name</Form.Label>
                                <Form.Control type="text" placeholder="Enter the group name" onChange={this.setNewGroupName} />
                            </Form.Group>

                            <Form.Group controlId="formGroupId">
                                <Form.Label>Group id</Form.Label>
                                <Form.Control type="text" placeholder="Enter the group id" onChange={this.setNewGroupID} />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.submit}>
                            Save Changes
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Loader fullPage loading={this.state.showLoadingOverlay} containerStyle={{background: "rgba(255, 255, 255, 0.9)"}}/>
            </Fragment>
        );
    }
}

export default GroupPersons