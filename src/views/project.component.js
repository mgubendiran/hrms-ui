import React, { useState, useEffect } from "react";
import ChartistGraph from "react-chartist";

import "primereact/resources/themes/lara-light-indigo/theme.css";

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
  Modal
} from "react-bootstrap";

import axios from 'axios'
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';

import { ListBox } from 'primereact/listbox';
import ProjectEmployeeTable from "./project.employee.table";

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
function ProjectComponent() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [years, setYears] = useState([{ key: 2024, value: 2024 }, { key: 2023, value: 2023 }])
  const [selectedYear, setSelectedYear] = useState({ key: 2024, value: 2024 })
  const [months, setMonths] = useState(monthList)
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [date, setDate] = useState(null)


  useEffect(() => {
    axios.get('http://192.168.1.243:2000/project')
      .then(response => {
        setProjects(response.data?.map(p => {
          return {
            ...p,
            name: `${p?.project_code} - ${p?.project_name}`
          }
        }))
        // setProjects(response.data.map(team => { return { label: team, code: team } }));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const getProjectEmployees = (obj) => {
    axios.get(`http://192.168.1.243:2000/employee/project/${obj.project_id}`)
      .then(response => {
        console.log(response.data)
        console.log(employees)
        let employeeData = (response.data?.employees || []).map(obj => {return {...obj, FullName: `${obj.FirstName} ${obj.LastName} - ${obj.Number}`}})
        setEmployees(employeeData)
      })
      .catch(error => {
        console.error(error);
      });
  };

  const dateHandler = (searchKey) => {
    if (searchKey?.value) {
      // getProjectEmployees()()
      // getProjectEmployees(selectedProject)
      setSelectedMonth(searchKey?.value?.getMonth()+1)
      setSelectedYear(searchKey?.value?.getFullYear())
      getProjectEmployees(selectedProject)

    }
  }
  const exportHandler = (searchKey) => {
    axios.get(`http://192.168.1.243:2000/attendance_log/project/${selectedProject?.project_id}/year/${selectedYear}/month/${selectedMonth}/export`, { responseType: 'blob' })
      .then((data) => {
        // console.log(data)
        const url = window.URL.createObjectURL(new Blob([data.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
      });
  }

  
  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="6" sm="6">
            <Card style={{height: "320px"}} >
              <Card.Header>
                <Card.Title as="h4">Project-wise Report</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row><Col><h5>Project</h5></Col></Row>
                <Row>
                  <Col><Dropdown placeholder="select project" style={{width: "100%"}}  listStyle={{ maxHeight: '160px' }} filter value={selectedProject} 
                  onChange={(e) => {
                    console.log(e.value)
                    if (e.value) {
                      setSelectedProject(e?.value)
                      getProjectEmployees(e?.value)
                    }
                  }} 
                  // onChange={(e) => dateHandler(e)}
                  options={projects} optionLabel="name" className="w-full md:w-14rem" /></Col>
                </Row>
                <Row><Col><h5>Month</h5></Col></Row>
                <Row>
                  <Col>
                  <Calendar placeholder="select month & year" style={{width: "100%"}} value={date} 
                   onChange={(e) => dateHandler(e)}

                  // onChange={(e) => {console.log(e.value); setSelectedYear(e.value.getFullYear()); setSelectedMonth(e.value.getMonth()+1)}} 
                  view="month" dateFormat="mm/yy" /></Col>
                </Row>
                {/* <Row><Col></Col></Row>
                <Row>
                  <Col>
                    <Dropdown style={{width: "100%"}} filter listStyle={{ maxHeight: '160px' }} value={selectedYear} onChange={(e) => {
                      if (e.value) {
                        setSelectedYear(e?.value)
                        // commonHandler(e)
                      }
                    }} options={years} optionLabel="value"  className="w-full md:w-14rem" />
                  </Col>
                </Row>
                <Row><Col></Col></Row>

                <Row>
                  <Col>
                    <Dropdown style={{width: "100%"}} filter listStyle={{ maxHeight: '160px' }} value={selectedMonth} onChange={(e) => {
                      if (e.value) {
                        setSelectedMonth(e?.value.split('-')[0])
                        // commonHandler(e)
                      }
                    }} options={months} optionLabel="value" className="w-full md:w-14rem" />
                  </Col>
                </Row> */}
                
                
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" sm="6">
            <Card style={{height: "320px"}}>
              <Card.Header>
                <Card.Title as="h4">Employees</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListBox listStyle={{ maxHeight: '160px' }} filter value={selectedEmployee} onChange={(e) => {
                  console.log(e.value)
                  if (e.value) {
                    setSelectedEmployee(e?.value)
                  }
                }} options={employees} optionLabel="FullName" className="w-full md:w-14rem" />

              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col>
          <Card style={{height: "80px"}}>
                            <Card.Header>
                                <Card.Title as="h4" className="">Project: {selectedProject?.project_name}</Card.Title>
                                <Row>
                                  <Col md="10"><p className="card-category">{selectedProject?.project_code},  {selectedProject?.client_name}</p></Col>
                                  <Col md="2">{selectedProject && selectedYear && selectedMonth ? <Button onClick={exportHandler}>Export</Button>: null}</Col>
                                </Row>
                                 
                                
                            </Card.Header>
                        </Card>
          </Col>
        </Row>
        <Row>
          {selectedProject && selectedYear && selectedMonth ? <ProjectEmployeeTable projectId={selectedProject.project_id} month={selectedMonth} year={selectedYear}></ProjectEmployeeTable>: null}
        </Row>
      </Container>
    </>
  );
}

export default ProjectComponent;
