import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Image from 'react-bootstrap/Image'
import Badge from 'react-bootstrap/Badge'
import logo from '../../svg/logo.svg';
import '../../css/App.css';
import GroupPersons from './Groups';
import Persons from './Persons';
import Actions from './Actions';

class App extends Component {
  personsRef = React.createRef();
  actionsRef = React.createRef();

  constructor(props) {
    super(props)
    this.state = { 
      selectedGroupId: "" 
    }
  }

  onPersonGroupSelect = (personGroupId) => {
      // Cascade that to the Persons & actions element for loading
      this.personsRef.current.loadPersons(personGroupId);
      this.actionsRef.current.showActions(personGroupId);
  }

  render() {
    return (
      <Container>
        <Row className="app-header-title">
          <Col sm={1}>
              <img className="app-logo" src={logo} />
          </Col>
          <Col sm={11}>
            <h1 className="app-title">
              Welcome to Face API <Badge variant="primary" pill>playground</Badge>
            </h1>
          </Col>
        </Row>
        <Row className="app-header-body">
          <Col>
            <GroupPersons onSelect={this.onPersonGroupSelect} />
          </Col>
          <Col>
            <Persons ref={this.personsRef} /> 
          </Col>
          <Col>
            <Actions ref={this.actionsRef} />
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;