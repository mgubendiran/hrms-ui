import React, { useState, useEffect } from "react";
import "primereact/resources/themes/lara-light-indigo/theme.css";

// react-bootstrap components
import {
  Card,
  Container,
  Row,
  Col,
} from "react-bootstrap";

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
function EmployeeComponent() {
  const [employees, setEmployees] = useState([])
  const [years, setYears] = useState([{ key: 2024, value: 2024 }, { key: 2023, value: 2023 }])
  const [selectedYear, setSelectedYear] = useState({ key: 2024, value: 2024 })
  const [months, setMonths] = useState(monthList)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [date, setDate] = useState(null)


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

  const getEmployeeDetails = (obj) => {
    axios.get(`http://192.168.1.243:2000/employee/${obj.EmployeeId}/dashboard`)
      .then(response => {
        console.log(response.data)
        // console.log(employee)
        // let employeeData = (response.data?.employees || []).map(obj => {return {...obj, FullName: `${obj.FirstName} ${obj.LastName} - ${obj.Number}`}})
        setSelectedEmployee(response.data)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const dateHandler = (searchKey) => {
    if (searchKey?.value) {
      setSelectedMonth(searchKey?.value?.getMonth() + 1)
      setSelectedYear(searchKey?.value?.getFullYear())
      getEmployeeDetails(selectedEmployee)
    }
  }
  const getCommitedDays = (schedule) => {
    return DAYS.filter(day => schedule?.[day] == '1');
}

  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="6" sm="6">
            <Card style={{ height: "320px" }} >
              <Card.Header>
                <Card.Title as="h4">Employee-wise Report</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row><Col><h5>Employee</h5></Col></Row>
                <Row>
                  <Col><Dropdown placeholder="select employee" style={{ width: "100%" }} listStyle={{ maxHeight: '160px' }} filter value={selectedEmployee}
                    onChange={(e) => {
                      console.log(e.value)
                      if (e.value) {
                        setSelectedEmployee(e?.value)
                        getEmployeeDetails(e?.value)
                      }
                    }}
                    // onChange={(e) => dateHandler(e)}
                    // itemTemplate={employeeNameTemplate}
                    options={employees}
                    optionLabel="FullName"

                    className="w-full md:w-14rem" /></Col>
                </Row>
                <Row><Col><h5>Month</h5></Col></Row>
                <Row>
                  <Col>
                    <Calendar placeholder="select month & year" style={{ width: "100%" }} value={date}
                      onChange={(e) => dateHandler(e)}
                      view="month" dateFormat="mm/yy" /></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
         { selectedEmployee ?  <Col lg="6" sm="6">
            <Card style={{ height: "320px" }}>
              <Card.Header>
                <Card.Title as="h4">Report</Card.Title>
              </Card.Header>
              <Card.Body>
                
                {/* <ListBox listStyle={{ maxHeight: '160px' }} filter value={selectedEmployee} onChange={(e) => {
                  console.log(e.value)
                  if (e.value) {
                    setSelectedEmployee(e?.value)
                  }
                }} options={employees} optionLabel="FullName" className="w-full md:w-14rem" /> */}

              </Card.Body>
            </Card>
          </Col> : null}
        </Row>
        {selectedEmployee ? <Row>
          <Col>
            <Card style={{ height: "80px" }}>
              <Card.Header>
                <Card.Title as="h4" className="">Employee: {selectedEmployee?.FirstName} {selectedEmployee?.LastName}</Card.Title>
                <hr>
                </hr>
                {/* <p className="card-category">{selectedProject?.project_code},  {selectedProject?.client_name}</p> */}
                <Row>
                  
                  <Col md="4">
                    <Card style={{minHeight: "200px"}}>
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
                    <Card style={{minHeight: "200px"}}>
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
                    <Card style={{minHeight: "200px"}}>
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
      </Container>
    </>
  );
}

export default EmployeeComponent;
