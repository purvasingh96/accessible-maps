import * as React from 'react';
import {Navbar, Nav, Container, NavDropdown} from 'react-bootstrap';
import {LinkContainer} from 'react-router-bootstrap';



const Navbarcustom = () => {
  return (
      <Navbar bg="light" expand="lg">
        <Container fluid>
          <LinkContainer to="/">
          <Navbar.Brand>Accessible Maps</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
                <NavDropdown title="Maps" id="navbarScrollingDropdown">
                      <LinkContainer to="/maps/playground">
                        <Nav.Link>Playground Map</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/maps/heatmap">
                        <Nav.Link>Heat Map</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/maps/map1">
                        <Nav.Link>Map - 1</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/maps/map2">
                        <Nav.Link>Map - 2</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/maps/map3">
                        <Nav.Link>Map - 3</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/maps/map4">
                        <Nav.Link>Map - 4</Nav.Link>
                      </LinkContainer>
                </NavDropdown>
                <NavDropdown title="Tables" id="navbarScrollingDropdown">
                      <LinkContainer to="/tables/table1">
                        <Nav.Link>Table 1</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/tables/table2">
                        <Nav.Link>Table 2</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/tables/table3">
                        <Nav.Link>Table 3</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/tables/table4">
                        <Nav.Link>Table 4</Nav.Link>
                      </LinkContainer>
                </NavDropdown>
                <NavDropdown title="Audiom Maps" id="navbarScrollingDropdown">
                      <LinkContainer to="/audiom/map1">
                        <Nav.Link>Audiom Map 1</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/audiom/map2">
                        <Nav.Link>Audiom Map 2</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/audiom/map3">
                        <Nav.Link>Audiom Map 3</Nav.Link>
                      </LinkContainer>
                      <LinkContainer to="/audiom/map4">
                        <Nav.Link>Audiom Map 4</Nav.Link>
                      </LinkContainer>
                </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          </Container>
      </Navbar>
    )
}

export default Navbarcustom;