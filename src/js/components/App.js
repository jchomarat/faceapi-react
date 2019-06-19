import React, { Component } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
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
        <Row>
          <Col sm={2}>
            <img src={logo} className="App-logo" alt="logo" />
          </Col>
          <Col sm={10}>
            <h2>Welcome to Face API playground</h2>
          </Col>
        </Row>
        <Row>
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