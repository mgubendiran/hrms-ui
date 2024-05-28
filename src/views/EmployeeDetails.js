import React from "react";

// react-bootstrap components
import {
    Badge,
    Button,
    Card,
    Navbar,
    Nav,
    Table,
    Container,
    Row,
    Col,
} from "react-bootstrap";

import { ProgressBar } from 'primereact/progressbar';
import AttendanceChart from "./AttendanceChart";
import { CardBody } from "reactstrap";


function EmployeeDetails(props) {

    const { userData } = props;
    console.log("userData", userData)

    return (
        <>
            {userData ? <Container fluid>
                <Row>
                    <Col md="12">
                        <Card className="strpied-tabled-with-hover">
                            <Card.Header>
                                <Card.Title as="h4">Employee details</Card.Title>
                                <hr></hr>
                            </Card.Header>
                            <Card.Body className="table-full-width table-responsive px-0">
                                <Container fluid>
                                    <Row>
                                            <Col md="6">
                                            <Row>
                                                <Col md="3">ID:</Col>
                                                <Col md="9">{userData.empId}</Col>
                                            </Row>
                                            <Row>
                                                <Col md="3">Name:</Col>
                                                <Col md="9">{userData.emp_name}</Col>
                                            </Row>
                                            <Row>
                                                <Col md="3">Location:</Col>
                                                <Col md="9">{userData.location}</Col>
                                            </Row>
                                            <Row>
                                                <Col md="3">Team:</Col>
                                                <Col md="9">{userData.team}</Col>
                                            </Row>
                                            <Row>
                                                <Col md="3">Manager:</Col>
                                                <Col md="9">{userData.reporting_manager}</Col>
                                            </Row>
                                            <Row>
                                                <Col md="3">Commited Days:</Col>
                                                <Col md="9">{(userData.commitedDays || [])?.join(' ,') || " -"}</Col>
                                            </Row>
                                        </Col>
                                        <Col md="6">
                                            {userData?.attendanceReport ? 
                                            <AttendanceChart attendanceReport = {userData?.attendanceReport} ></AttendanceChart> : null
                                            }
                                        </Col>
                                    </Row>
                                </Container>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container> : null}
        </>
    );
}

export default EmployeeDetails;
