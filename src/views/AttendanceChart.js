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
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { CardBody, CardHeader } from "reactstrap";


const leftAlignStyle = {
    width: "50px",
    height: "50px",
    textAlign: "left",
    marginTop: -"4px",
    marginLeft: -"12px",
}
function AttendanceChart(props) {

    const { attendanceReport, name } = props;
    console.log("userData", attendanceReport);
    let orderReport = attendanceReport.sort((a, b) => {
        return a.date - b.date;
    });
    console.log('orderReport :', orderReport);
    const grouping = Object.groupBy(attendanceReport, ({ day }) => day);
    let firstDayOfMonth = orderReport[0].day;
    const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let index = DAYS.findIndex((d => d == firstDayOfMonth));
    let arr = DAYS.slice(0, index) // before one day
    console.log('arr: ', arr)
    if (arr.length) {
        arr.forEach(day => {
            grouping[day]?.unshift({ day, date: 0, value: 'empty' })
        })
    }
    let noOfRows = 0;
    DAYS.forEach(d => {
        noOfRows = noOfRows > grouping[d].length ? noOfRows : grouping[d].length;
    })
    console.log('noOfRows : ', noOfRows)
    console.log(grouping);
    DAYS.forEach(day => {
        let dummyRec = noOfRows - grouping[day]?.length
        for (let i = 0; i < dummyRec; i++) {
            grouping[day].push({ day, date: 0, value: 'empty' })
        }
    })
    console.log('final grouping: ', grouping)

    return (
        <>
            {orderReport ?
                <Container fluid="md">
                    <Card style={{ fontSize: "12px", padding: "5px" }}>
                    {/* <h4>Attendance Entries{name ? `: ${name}` : ''}</h4>
                    <hr></hr>
                    <Row style={{ fontSize: "14px", border: "2px solid gray", color: "blue" }} >
                                {
                                    DAYS.map(day => {
                                        return <Col style={{ border: "2px solid gray", color: "blue" }} >{day.slice(0, 3)}</Col>
                                    })
                                }
                            </Row>
                            {
                                grouping['Sunday'].map((x, i) => {
                                    return <Row>
                                        {DAYS.map(day => {
                                            let val = grouping[day][i].value;
                                            return <Col style={{ border: "1px solid gray" }} >
                                                {
                                                    val == 'empty' ? <></> :
                                                        <><div style={{
                                                            textAlign: "left",
                                                            fontSize: "10px",
                                                            marginLeft: "-10px"
                                                        }}>{grouping[day][i].date}</div><div className={val == 'A' ? 'text-danger' : ''} style={{
                                                            textAlign: "right",
                                                            marginRight: "-10px",
                                                            color: val == 'A' ? '#ff3d32' : val == 'P' ? '#06b6d4' : '#ec4899'
                                                        }}>{val}</div></>
                                                    // <div>{grouping[day][i].value}</div>
                                                }
                                            </Col>
                                        })
                                        }
                                    </Row>
                                })
                            } */}
                        <CardHeader><h4>Attendance Entries{name ? `: ${name}` : ''}</h4></CardHeader>
                        <CardBody>
                            <Row style={{ fontSize: "14px", border: "2px solid gray", color: "blue" }} >
                                {
                                    DAYS.map(day => {
                                        return <Col style={{ border: "2px solid gray", color: "blue" }} >{day.slice(0, 3)}</Col>
                                    })
                                }
                            </Row>
                            {
                                grouping['Sunday'].map((x, i) => {
                                    return <Row>
                                        {DAYS.map(day => {
                                            let val = grouping[day][i].value;
                                            return <Col style={{ border: "1px solid gray" }} >
                                                {
                                                    val == 'empty' ? <></> :
                                                        <><div style={{
                                                            textAlign: "left",
                                                            fontSize: "10px",
                                                            marginLeft: "-10px"
                                                        }}>{grouping[day][i].date}</div><div className={val == 'A' ? 'text-danger' : ''} style={{
                                                            textAlign: "right",
                                                            marginRight: "-10px",
                                                            color: val == 'A' ? '#ff3d32' : val == 'P' ? '#06b6d4' : '#ec4899'
                                                        }}>{val}</div></>
                                                    // <div>{grouping[day][i].value}</div>
                                                }
                                            </Col>
                                        })
                                        }
                                    </Row>
                                })
                            }
                        </CardBody>
                    </Card>


                </Container> : null}
        </>
    );
}

export default AttendanceChart;
