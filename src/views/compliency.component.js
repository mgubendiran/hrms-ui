import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";

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
    Form,
    OverlayTrigger,
    Tooltip,
} from "react-bootstrap";
import { getEmployeeAttendance } from "provider/service.provider";
import axios from "axios";
import { alignPropType } from "react-bootstrap/esm/types";
import "primereact/resources/themes/lara-light-indigo/theme.css";


// const redBoxStyle = {
//     // Add padding for spacing 
//     padding: '20px',
//     // Set the text color to white 
//     color: 'white',
// };
const remoteInfoStyle = {
    padding: '20px',
    color: 'blue',
    fontSize: '20px'
}

export default function Compliency(props) {

    // const [compliency, setCompliency] = useState({presence: 0, absence: 0})
    //   const [attendance, setAttendance] = useState({presence: 0, absence: 0})

    const { compliency, attendance, title, titleName, searchKey, isRemote } = props;
    console.log(props)
    // const { title, titleName, searchKey } = props;
    let attendanceLabels = [
        `${Math.round(isNaN(attendance?.presence / (attendance?.presence + attendance?.absence) * 100) ? 0 : attendance?.presence / (attendance?.presence + attendance?.absence) * 100)}%`,
        `${Math.round(isNaN(attendance?.absence / (attendance?.presence + attendance?.absence) * 100) ? 0 : attendance?.absence / (attendance?.presence + attendance?.absence) * 100)}%`
    ]
    let compliencyLabels = [
        `${Math.round(isNaN(compliency?.presence / (compliency?.presence + compliency?.absence) * 100) ? 0 : compliency?.presence / (compliency?.presence + compliency?.absence) * 100)}%`,
        `${Math.round(isNaN(compliency?.absence / (compliency?.presence + compliency?.absence) * 100) ? 0 : compliency?.absence / (compliency?.presence + compliency?.absence)* 100)}%`
    ]

    let isCoputeError = !!((compliency?.presence + compliency?.absence) == 0) || (attendance?.presence + attendance)

    return (
        <>
            <Row>
                <Col md="12">
                    <div style={{ "alignItems": "center" }}>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4" className="">Report by {title}</Card.Title>
                                <p className="card-category">{titleName}</p>
                            </Card.Header>
                        </Card>
                    </div>
                </Col>
            </Row>
            <Row>
                <Col md="6">
                    <Card>
                        <Card.Header>
                            <Card.Title as="h4">Compliance details</Card.Title>
                            <hr></hr>
                            {/* <p className="card-category">{titleName}</p> */}
                        </Card.Header>
                        <Card.Body>
                            <div
                                className="ct-chart ct-perfect-fourth"
                                id="chartPreferences"
                            >
                                {
                                    isRemote ? <div style={remoteInfoStyle}>Working as Remote</div> : <ChartistGraph
                                        data={{
                                            labels: compliencyLabels,
                                            series: [compliency?.presence, compliency?.absence],
                                        }}
                                        type="Pie"
                                    />
                                }
                            </div>
                            <div className="legend">
                            <Row >
                                    <Col md="6"><i className="fas fa-circle text-info"></i>Present - {compliency.presence} days</Col>
                                    <Col md="6"><i className="fas fa-circle text-danger"></i>Absent - {compliency.absence} days</Col>
                                </Row>
                            </div>
                        </Card.Body>
                        {/* <Card.Footer>
                            <p as="h4" >commited Days - {}</p>
                            <p as="h4" >Present - {compliency.presence} days</p>
                            <p as="h4" >Absent  - {compliency.absence} days</p>
                            <div className="legend">
                                Compliency
                            </div>
                        </Card.Footer> */}
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <Card.Header>
                            <Card.Title as="h4"> Attendance Details</Card.Title>
                            <hr></hr>
                            {/* <p className="card-category">{titleName}</p> */}
                        </Card.Header>
                        <Card.Body>
                            <div
                                className="ct-chart ct-perfect-fourth"
                                id="chartPreferences"
                            >
                                {isRemote ? <div style={remoteInfoStyle}>Working as Remote</div> : <ChartistGraph
                                    data={{
                                        labels: attendanceLabels,
                                        series: [attendance?.presence, attendance?.absence],
                                    }}
                                    type="Pie"
                                />
                                }
                            </div>
                            <div className="legend">
                                <Row >
                                    <Col md="6"><i className="fas fa-circle text-info"></i>Present - {attendance.presence} days</Col>
                                    <Col md="6"><i className="fas fa-circle text-danger"></i>Absent - {attendance.absence} days</Col>
                                </Row>
                            </div>
                        </Card.Body>
                        {/* <Card.Footer>
                            <p as="h4" >Present - {attendance.presence} days</p>
                            <p as="h4" >Absent  - {attendance.absence} days</p>
                        </Card.Footer> */}
                    </Card>
                </Col>
            </Row>
        </>)
}