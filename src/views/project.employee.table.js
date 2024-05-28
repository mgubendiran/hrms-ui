
import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios';
import { ProgressBar } from 'primereact/progressbar';
import {
    Col,
    Container,
    Card,
    Row,

} from 'react-bootstrap';
import ChartistGraph from "react-chartist";
import { Button } from 'primereact/button';

import { Dialog } from 'primereact/dialog';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Dashboard from './Dashboard copy';
import MonthlyCalendar from './monthly.calender';

const remoteInfoStyle = {
    padding: '20px',
    color: 'blue',
    fontSize: '20px'
}
let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const lastDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDay();
}
const firstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
}

const lastDateOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export default function ProjectEmployeeTable({ projectId, year, month }) {
    const [employees, setEmployees] = useState([]);
    const [isRemote, setIsRemote] = useState(true);
    const [employee, setEmployee] = useState({});
    const [complienceData, setComplienceData] = useState({});
    const [attendanceData, setAttendanceData] = useState({});
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:2000/attendance_log/project/${projectId}/year/${year}/month/${month}`)
            .then((data) => {
                console.log(data)
                let employeeLogData = data.data.map((obj, i) => {
                    const getCommitedDays = (schedule) => {
                        return DAYS.filter(day => schedule?.[day] == '1');
                    }
                    return {
                        sno: i + 1,
                        name: `${obj.FirstName} ${obj.LastName}`,
                        number: obj.Number,
                        location: obj.WorkLocation,
                        manager: obj.ManagerId,
                        complience: obj.complience,
                        attendance: {
                            present: obj.present,
                            absent: obj.absent,
                            half: obj.half
                        },
                        schedule: {
                            days: getCommitedDays(obj.schedule),
                            ...(obj?.schedule)
                        },
                        isRemote: obj.complience?.count == 0,
                        logs: obj.logs?.map(log => {
                            return {
                                date: new Date(log.AttendanceDate).getDate(),
                                day: log.day,
                                status: log?.StatusCode
                            }
                        }),
                        firstDay: firstDayOfMonth(new Date(obj?.logs?.[0]?.['AttendanceDate'])),
                        lastDay: lastDayOfMonth(new Date(obj?.logs?.[0]?.['AttendanceDate'])),
                        lastDay: lastDateOfMonth(new Date(obj?.logs?.[0]?.['AttendanceDate']))
                    }
                })
                console.log("data: ", employeeLogData)
                setEmployees(employeeLogData)
                let WFH = employeeLogData.filter(obj => !obj.isRemote);

                if (WFH.length) {
                    setIsRemote(false)
                    let complience = { count: 0, present: 0, absent: 0 };
                    let attendance = { count: 0, present: 0, absent: 0 };
                    WFH.forEach(element => {
                        complience.count += element.complience?.count;
                        complience.present += element.complience?.present;
                        attendance.count += element.attendance?.absent + element.attendance?.present + element.attendance?.half;
                        attendance.present += element.attendance?.present + (element.attendance?.half / 2);
                    });
                    complience.absent = complience.count - complience.present;
                    attendance.absent = attendance.count - attendance.present;
                    console.log(complience, attendance)
                    setComplienceData({
                        labels: [
                            Math.round((complience.present / complience.count) * 100) + "%",
                            Math.round((complience.absent / complience.count) * 100) + "%"
                        ],
                        series: [
                            Math.round((complience.present / complience.count) * 100),
                            Math.round((complience.absent / complience.count) * 100)
                        ],
                        present: complience.present,
                        absent: complience.absent
                    })
                    setAttendanceData({
                        labels: [
                            Math.round((attendance.present / attendance.count) * 100) + "%",
                            Math.round((attendance.absent / attendance.count) * 100) + "%"
                        ],
                        series: [
                            Math.round((attendance.present / attendance.count) * 100),
                            Math.round((attendance.absent / attendance.count) * 100)
                        ],
                        present: attendance.present,
                        absent: attendance.absent
                    })
                }
                else if (isRemote == false) {
                    setIsRemote(true)
                }
            });
    }, [projectId, year, month]);

    const getAttendanceLogByProject = (projectId, year, month) => {
        axios.get(`http://localhost:2000/attendance_log/project/${projectId}/year/${year}/month/${month}`)
            .then((data) => {
                console.log(data)
                let employeeLogData = data.data.map((obj, i) => {
                    return {
                        sno: i + 1,
                        name: `${obj.FirstName} ${obj.LastName}`,
                        number: obj.Number,
                        location: obj.WorkLocation,
                        manager: obj.ManagerId,
                        complience: obj.complience,
                        attendance: {
                            present: obj.present,
                            absent: obj.absent,
                            half: obj.half
                        },
                        isRemote: obj.complience?.count == 0

                    }
                })
                setEmployees(employeeLogData)
                let WFH = employeeLogData.filter(obj => !obj.isRemote);
                if (WFH.length) {
                    setIsRemote(false)
                    let complience = { count: 0, present: 0, absent: 0 };
                    let attendance = { count: 0, present: 0, absent: 0 };
                    WFH.forEach(element => {
                        complience.count += element.complience?.count;
                        complience.present += element.complience?.present;
                        attendance.count += element.attendance?.absent + element.attendance?.present + element.attendance?.half;
                        attendance.present += element.attendance?.present + (element.attendance?.half / 2);
                    });
                    complience.absent = complience.count - complience.present;
                    attendance.absent = attendance.count - attendance.present;
                    console.log(complience, attendance)
                    setComplienceData({
                        labels: [
                            Math.round((complience.present / complience.count) * 100) + "%",
                            Math.round((complience.absent / complience.count) * 100) + "%"
                        ],
                        series: [
                            Math.round((complience.present / complience.count) * 100),
                            Math.round((complience.absent / complience.count) * 100)
                        ],
                        present: complience.present,
                        absent: complience.absent
                    })
                    setAttendanceData({
                        labels: [
                            Math.round((attendance.present / attendance.count) * 100) + "%",
                            Math.round((attendance.absent / attendance.count) * 100) + "%"
                        ],
                        series: [
                            Math.round((attendance.present / attendance.count) * 100),
                            Math.round((attendance.absent / attendance.count) * 100)
                        ],
                        present: attendance.present,
                        absent: attendance.absent
                    })
                }
            });
    }

    const complienceTemplate = (employee) => {
        console.log((employee?.complience?.present / employee.complience.count) * 100)
        return <div>{employee?.complience?.count ? <ProgressBar value={Math.round((employee?.complience?.present / employee.complience.count) * 100)}></ProgressBar> : 'Remote'}</div>
    };

    const attendanceTemplate = (employee) => {
        let count = employee.attendance?.present + employee.attendance?.absent + employee.attendance?.half;
        let present = employee.attendance?.present + (employee.attendance?.half / 2)
        console.log(count, present)
        return <div>{employee?.complience?.count ? <ProgressBar value={Math.round((present / count) * 100)}></ProgressBar> : 'Remote'}</div>
    };

    const employeeLogTemplate = (empObj) => {
        return (<>
            <Button
                label="Show"
                icon="pi pi-external-link"
                onClick={() => {
                    console.log(empObj)
                    setEmployee(empObj)
                    setVisible(true)
                }}
                size="small" />
        </>)
    }

    const getCalenderData = () => {
        let logsByDate = Object.groupBy(employee?.logs || [], ({ day }) => day);
        let firstDay = employee.firstDay || 0;
        let lastDay = employee.lastDay || 6;
        for (let i = 0; i < firstDay; i++) {
            if(!logsByDate[DAYS[i]]) logsByDate[DAYS[i]] = []
            logsByDate[DAYS[i]].unshift({ day: DAYS[i], status: '', date: '' })
        }
        for (let i = 6; i > lastDay; i--) {
            if(!logsByDate[DAYS[i]]) logsByDate[DAYS[i]] = []
            logsByDate[DAYS[i]].push({ day: DAYS[i], status: '', date: '' })
        }
        let arr = logsByDate['Sunday'] || []
    
        return (<>
            <Row>{
                DAYS.forEach(ele => {
                    <Col>{ele}</Col>
                })
            }</Row>
            {arr.forEach((ele, i) => {
                <Row>
                    {
                        DAYS.forEach(day => {
                            <Col>{logsByDate?.[day]?.[i]}</Col>
                        })
                    }
                </Row>
            })}
        </>);
    }

    return (

        <>
            <Container fluid>
                <Row>
                    <Col md="6">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Compliance details</Card.Title>
                                <hr></hr>
                            </Card.Header>
                            <Card.Body>
                                <div
                                    className="ct-chart ct-perfect-fourth"
                                    id="chartPreferences"
                                >
                                    {
                                        isRemote ? <div style={remoteInfoStyle}>Working as Remote</div> : <ChartistGraph
                                            data={complienceData}
                                            type="Pie"
                                        />
                                    }
                                </div>
                                <div className="legend">
                                    {!isRemote ? <Row >
                                        <Col md="6"><i className="fas fa-circle text-info"></i>Present - {complienceData.present} days</Col>
                                        <Col md="6"><i className="fas fa-circle text-danger"></i>Absent - {complienceData.absent} days</Col>
                                    </Row> : null}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4"> Attendance Details</Card.Title>
                                <hr></hr>
                            </Card.Header>
                            <Card.Body>
                                <div
                                    className="ct-chart ct-perfect-fourth"
                                    id="chartPreferences"
                                >
                                    {isRemote ? <div style={remoteInfoStyle}>Working as Remote</div> : <ChartistGraph
                                        data={attendanceData}
                                        type="Pie"
                                    />
                                    }
                                </div>
                                <div className="legend">
                                    {!isRemote ? <Row >
                                        <Col md="6"><i className="fas fa-circle text-info"></i>Present - {attendanceData.present} days</Col>
                                        <Col md="6"><i className="fas fa-circle text-danger"></i>Absent - {attendanceData.absent} days</Col>
                                    </Row> : null}
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Employee Details</Card.Title>
                                <hr></hr>
                            </Card.Header>
                            <Card.Body>
                                <DataTable stripedRows value={employees} paginator rows={10} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                                    <Column field="sno" header="S.no" style={{ width: '5%' }}></Column>
                                    <Column field="number" header="Number" style={{ width: '10%' }}></Column>
                                    <Column field="name" header="Name" style={{ width: '20%' }}></Column>
                                    <Column field="location" header="Location" style={{ width: '20%' }}></Column>
                                    <Column field="complience" body={complienceTemplate} header="complience" style={{ width: '20%' }}></Column>
                                    <Column body={attendanceTemplate} header="Attendance" style={{ width: '20%' }}></Column>
                                    <Column body={employeeLogTemplate} header="Entries" style={{ width: '5%' }}></Column>
                                </DataTable>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <div className="card flex justify-content-center">
                    <Dialog visible={visible} header={`${employee.name} - ${employee.number}`} style={{ width: '50vw' }} onHide={() => setVisible(false)} >
                        <Card>
                            <Card.Body>
                                <Row>
                                    <Col md={3}>Scheduled</Col>
                                    <Col md={9}>{employee.schedule?.days?.join(', ')}</Col>
                                </Row>
                                <Row>
                                    <Col md={3}>Comments</Col>
                                    <Col md={9}>{employee.schedule?.Comments}</Col>
                                </Row>
                                <Row>
                                    <Col md={3}>Complience</Col>
                                    <Col md={3}>{employee.complience?.present} / {employee.complience?.count} days</Col>
                                    <Col md={3}>Attendance</Col>
                                    <Col md={3}>{employee.attendance?.present} / {employee.attendance?.present + employee.attendance?.absent} days</Col>
                                </Row>
<br></br>                                <Row>
                                    {/* <Col>{JSON.stringify(getCalenderData(employee))}</Col> */}
                                    {/* {
                                        getCalenderData()
                                    } */}

                                    <MonthlyCalendar data={employee}></MonthlyCalendar>

                                </Row>

                            </Card.Body>
                        </Card>
                    </Dialog>
                </div>

            </Container>
        </>
    );
}
