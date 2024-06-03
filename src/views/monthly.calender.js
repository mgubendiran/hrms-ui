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

let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


function MonthlyCalendar(props) {

    const { data } = props;
    let logsByDate = Object.groupBy(data
        ?.logs || [], ({ day }) => day);
    let firstDay = data.firstDay || 0;
    let lastDay = data.lastDay || 6;
    //temp fix for day mismatching 
    if(logsByDate?.Thurday) {
        logsByDate['Thursday'] = logsByDate.Thurday;
        delete logsByDate.Thurday;
    }
    for (let i = 0; i < firstDay; i++) {
        if (!logsByDate[DAYS[i]]) logsByDate[DAYS[i]] = []
        logsByDate[DAYS[i]].unshift({ day: DAYS[i], status: '', date: '' })
    }
    for (let i = 6; i > lastDay; i--) {
        if (!logsByDate[DAYS[i]]) logsByDate[DAYS[i]] = []
        logsByDate[DAYS[i]].push({ day: DAYS[i], status: '', date: '' })
    }
    let logArr = logsByDate['Monday'] || []

    return (
        <>
            <Card style={{ width: "100%" }}>
                <Card.Header>
                    <h4>Attendance entries</h4>
                    <hr></hr>
                </Card.Header>
                <Card.Body>
                    <Row style={{ fontSize: "14px", border: "2px solid gray", color: "blue" }}>{
                        DAYS.map(ele => {
                            return <Col style={{ border: "1px solid gray" }}>{ele.slice(0, 3)}</Col>
                        })
                    }</Row>
                    {
                        logArr.map((ele, i) => {
                            return <Row>
                                {
                                    DAYS.map(day => {
                                        let val = logsByDate?.[day]?.[i]?.status;
                                        let bg = val == 'A' ? 'red' : val?.indexOf('P')>-1 ? 'green' : null;
                                        return <Col style={{ border: "grey solid 1px", backgroundColor: bg }} >
                                            {/* {logsByDate?.[day]?.[i]?.status} -{logsByDate?.[day]?.[i]?.date} */}
                                            <><div style={{
                                                textAlign: "left",
                                                fontSize: "10px",
                                                marginLeft: "-10px",
                                                color: "black"
                                            }}>{logsByDate?.[day]?.[i]?.date}</div>
                                            {/* //bg == "green" */}
                                                <div style={{
                                                    textAlign: "right",
                                                    marginRight: "-10px",
                                                    color: bg == "red" || bg == "green" ? "black" : '#ec4899'
                                                    // color: val == 'A' ? '#ff3d32' : val == 'P' ? '#06b6d4' : '#ec4899'
                                                }}>{val}</div></>
                                        </Col>
                                    }
                                    )
                                }
                            </Row>
                        })
                    }
                </Card.Body>
            </Card>
        </>
    );
}

export default MonthlyCalendar;
