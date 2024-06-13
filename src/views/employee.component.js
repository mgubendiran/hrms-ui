import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";

// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";
import ChartistGraph from "react-chartist";

import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import { ListBox } from 'primereact/listbox';
import ProjectEmployeeTable from "./project.employee.table";

let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const monthList = [
  { key: 1, value: "1-January" },
  { key: 2, value: "2-February" },
  { key: 3, value: "3-March" },
  { key: 4, value: "4-April" },
  { key: 5, value: "5-May" },
  { key: 6, value: "6-June" },
  { key: 7, value: "7-July" },
  { key: 8, value: "8-Augest" },
  { key: 9, value: "9-September" },
  { key: 10, value: "10-October" },
  { key: 11, value: "11-November" },
  { key: 12, value: "12-December" },

]

const remoteInfoStyle = {
  padding: '20px',
  color: 'blue',
  fontSize: '20px'
}

function EmployeeComponent() {
  const [employees, setEmployees] = useState([])
  const [years, setYears] = useState([{ key: 2024, value: 2024 }, { key: 2023, value: 2023 }])
  const [selectedYear, setSelectedYear] = useState({ key: 2024, value: 2024 })
  const [months, setMonths] = useState(monthList)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [date, setDate] = useState(null)
  const [attendanceData, setAttendanceData] = useState(null)
  const [complianceData, setComplianceData] = useState(null)
  const [logs, setLogs] = useState([])
  const [isRemote, setIsRemote] = useState(true)



  useEffect(() => {
    axios.get('http://192.168.1.243:2000/employee')
      .then(response => {
        let employeeData = (response.data || []).map(obj => { return { ...obj, FullName: `${obj.FirstName} ${obj.LastName} - ${obj.Number}` } })
        setEmployees(employeeData)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);


  const employeeNameTemplate = (employee) => {
    return <div>{employee?.FirstName} {employee.LastName} - {employee.Number}</div>
  };

  // valueTemplate={employeeNameTemplate} itemTemplate={employeeNameTemplate}
  const updateData = (selectedDate) => {
    let logs = selectedEmployee?.attendance_logs || []
    let currentMonthLog = logs.filter(log => {
      let d = new Date(log.AttendanceDate)
      // console.log(d?.getMonth(), date?.getMonth(), d?.getFullYear(), date?.getFullYear())
      return selectedDate && d.getMonth() == selectedDate.getMonth() && d.getFullYear() == selectedDate.getFullYear()
    })
    setLogs(currentMonthLog)

    let commitedDays = getCommitedDays(selectedEmployee?.schedule);
    console.log(commitedDays)
    if (commitedDays.length > 0) setIsRemote(false)
    let present = currentMonthLog.filter((obj) => obj.StatusCode == "P");
    let half = currentMonthLog.filter((obj) => obj.StatusCode == "½P");
    let absent = currentMonthLog.filter((obj) => obj.StatusCode == "A")
    console.log(present, absent, half)
    let apc = present.length + (half.length / 2);
    let aac = absent.length + (half.length / 2)
    let ac = present.length + absent.length + half.length;
    let cPresent = [...present, ...half].filter(obj => {
      let d = new Date(obj.AttendanceDate).getDay();
      return commitedDays.indexOf(DAYS[d]) > -1
    })
    let cAbsent = absent.filter(obj => {
      let d = new Date(obj.AttendanceDate).getDay();
      return commitedDays.indexOf(DAYS[d]) > -1
    })
    let cpc = cPresent.length;
    let cac = cAbsent.length
    let cc = cpc + cac;
    console.log("currentMonthLog: ", currentMonthLog)
    console.log("compliance : ", cpc, cac, cc)
    console.log("attendance : ", apc, aac, ac)

    setComplianceData({
      labels: [
        Math.round((cpc / cc) * 100) + "%",
        Math.round((cac / cc) * 100) + "%"
      ],
      series: [
        Math.round((cpc / cc) * 100),
        Math.round((cac / cc) * 100)
      ],
      present: cpc,
      absent: cac
    })

    setAttendanceData({
      labels: [
        Math.round((apc / ac) * 100) + "%",
        Math.round((aac / ac) * 100) + "%"
      ],
      series: [
        Math.round((apc / ac) * 100),
        Math.round((aac / ac) * 100)
      ],
      present: apc,
      absent: aac
    })
  }

  const getEmployeeDetails = (obj) => {
    axios.get(`http://192.168.1.243:2000/employee/${obj.EmployeeId}/dashboard`)
      .then(response => {
        setSelectedEmployee(response.data);
        updateData();
      })
      .catch(error => {
        console.error(error);
      });
  };

  const dateHandler = (searchKey) => {
    if (searchKey?.value) {
      setDate(searchKey?.value);
      updateData(searchKey?.value)
      // setSelectedMonth(searchKey?.value?.getMonth() + 1)
      // setSelectedYear(searchKey?.value?.getFullYear())
      //  getEmployeeDetails(selectedEmployee)
    }
  }
  const getCommitedDays = (schedule) => {
    return DAYS.filter(day => schedule?.[day] == '1');
  }

  return (
    <>
      <Container fluid>
        <Row md="12">
          <Col>
            <Card >
              <Card.Header>
                <Card.Title as="h4">Employee-wise Report</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* <Col md="1">Employee</Col> */}
                  <Col md="8"><Dropdown placeholder="select employee" style={{ width: "100%" }} listStyle={{ maxHeight: '160px' }} filter value={selectedEmployee}
                    onChange={(e) => {
                      console.log(e.value)
                      if (e.value) {
                        getEmployeeDetails(e?.value)
                        // setSelectedEmployee(e?.value)
                        if(date) {
                          updateData(date)
                        }
                      }
                    }}
                    options={employees}
                    optionLabel="FullName"
                    className="w-full md:w-14rem" /></Col>
                  {/* <Col md = "1">Month</Col> */}
                  <Col md = "4"><Calendar placeholder="select month & year" style={{ width: "100%" }} value={date}
                    onChange={(e) => dateHandler(e)}
                    view="month" dateFormat="mm/yy" /></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
          {selectedEmployee ? <Row>
            <Col>
              <Card >
                <Card.Header>
                  <Card.Title as="h4" className="">Employee: {selectedEmployee?.FirstName} {selectedEmployee?.LastName}</Card.Title>
                  <hr>
                  </hr>
                  {/* <p className="card-category">{selectedProject?.project_code},  {selectedProject?.client_name}</p> */}
                  <Row>

                    <Col md="4">
                      <Card style={{ minHeight: "200px" }}>
                        <Card.Header>
                          <Card.Title as="h4">Employee Details</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md="4">EmpID</Col>
                            <Col>{selectedEmployee?.Number}</Col>
                          </Row>
                          <Row>
                            <Col md="4">Location</Col>
                            <Col>{selectedEmployee?.WorkLocation}</Col>
                          </Row>
                          <Row>
                            <Col md="4">Scheduled Days</Col>
                            <Col>{selectedEmployee?.schedule ? getCommitedDays(selectedEmployee?.schedule).join(', ') : '-'}</Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card style={{ minHeight: "200px" }}>
                        <Card.Header>
                          <Card.Title as="h4">Reporting Manager</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md="4">EmpID</Col>
                            <Col>{selectedEmployee?.manager?.Number || '-'}</Col>
                          </Row>
                          <Row>
                            <Col md="4">Name</Col>
                            <Col>{selectedEmployee?.manager?.FirstName || ''} {selectedEmployee?.manager?.LastName || "-"}</Col>
                          </Row>
                          <Row>
                            <Col md="4">Location</Col>
                            <Col>{selectedEmployee?.manager?.WorkLocation || '-'}</Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md="4">
                      <Card style={{ minHeight: "200px" }}>
                        <Card.Header>
                          <Card.Title as="h4">Project Details</Card.Title>
                        </Card.Header>
                        <Card.Body>
                          <Row>
                            <Col md="4">Code</Col>
                            <Col>{selectedEmployee?.project?.project_code || '-'}</Col>
                          </Row>
                          <Row>
                            <Col md="4">Name</Col>
                            <Col>{selectedEmployee?.project?.project_name || '-'}</Col>
                          </Row>
                          <Row>
                            <Col md="4">Client</Col>
                            <Col>{selectedEmployee?.project?.client_name || '-'}</Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Header>
              </Card>
            </Col>
          </Row> : null}
          {selectedEmployee && date ? 
          <Row>
            <Col lg="12" sm="12">
            <Card >
              <Card.Header>
                <Card.Title as="h4">Report {date ? '- ' + date?.toLocaleString('default', { month: 'long' }) : null}</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row style={{ "maxHeight": "300px !important" }}>
                  <Col >
                    {
                      isRemote ? <div style={remoteInfoStyle}>Working as Remote</div> :
                        <Card >
                          <Card.Header>Compliance</Card.Header>
                          <Card.Body>
                            <ChartistGraph
                              data={complianceData}
                              type="Pie"
                            />
                            <div className="legend">
                              <Row >
                                <Col md="6"><i className="fas fa-circle text-info"></i>Present - {complianceData?.present} days</Col>
                                <Col md="6"><i className="fas fa-circle text-danger"></i>Absent - {complianceData?.absent} days</Col>
                              </Row>
                            </div>
                          </Card.Body>
                        </Card>
                    }
                  </Col>

                  <Col >
                    {
                      isRemote ? <div style={remoteInfoStyle}>Working as Remote</div> :
                        <Card>
                          <Card.Header>Attendance</Card.Header>
                          <Card.Body>
                            <ChartistGraph
                              data={attendanceData}
                              type="Pie"
                            />
                            <div className="legend">
                              <Row >
                                <Col md="6"><i className="fas fa-circle text-info"></i>Present - {attendanceData?.present} days</Col>
                                <Col md="6"><i className="fas fa-circle text-danger"></i>Absent - {attendanceData?.absent} days</Col>
                              </Row>
                            </div>
                          </Card.Body>
                        </Card>
                    }
                  </Col>

                </Row>
              </Card.Body>
            </Card>
          </Col>
          </Row> : null}
      </Container>
    </>
  );
}

export default EmployeeComponent;
