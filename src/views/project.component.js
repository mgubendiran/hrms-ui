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
import { Label } from "reactstrap";

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
  const [clientProjects, setClientProjects] = useState([])
  const [selectedClientProject, setSelectedClientProject] = useState(null)
  const [date, setDate] = useState(null)


  useEffect(() => {
    axios.get('http://192.168.1.243:2000/client')
      .then(response => {
        setProjects(response.data?.map(p => {
          return {
            ...p,
            // name: `${p?.project_code} - ${p?.project_name}`
            name: p.client_name
          }
        }))
        // setProjects(response.data.map(team => { return { label: team, code: team } }));
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const getProjectEmployees = (obj) => {
    axios.get(`http://192.168.1.243:2000/employee/client/${obj.client_name}`)
      .then(response => {
        console.log(response.data)
        console.log(employees)
        let employeeData = (response.data?.employees || []).map(obj => {return {...obj, FullName: `${obj.FirstName} ${obj.LastName} - ${obj.Number}`}})
        setEmployees(employeeData)
        setClientProjects((response.data?.project || [])?.map(p => {
          return {
            ...p,
            name: `${p.project_code} - ${p.project_name}`
          }
        }))
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
    axios.get(`http://192.168.1.243:2000/attendance_log/client/${selectedProject?.client_name}/year/${selectedYear}/month/${selectedMonth}/export`, { responseType: 'blob' })
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
        <Col md="12">
          <Card>
          <Card.Header>
                <Card.Title as="h4">Client-Wise Report{selectedProject?.client_name ? ': '+selectedProject?.client_name : null}</Card.Title>
          </Card.Header>
          <Card.Body>
                <Row>
                  <Col md="6"><Label><b>Client</b></Label><Dropdown placeholder="select client" style={{width: "100%"}}  listStyle={{ maxHeight: '160px' }} filter value={selectedProject} 
                  onChange={(e) => {
                    console.log(e.value)
                    if (e.value) {
                      setSelectedProject(e?.value)
                      getProjectEmployees(e?.value)
                    }
                  }} 
                  // onChange={(e) => dateHandler(e)}
                  options={projects} optionLabel="name" className="w-full md:w-14rem" />
                  </Col>
                  <Col md="4"><Label><b>Month & Year</b></Label>
                  <Calendar placeholder="select month & year" style={{width: "100%"}} value={date} 
                   onChange={(e) => dateHandler(e)}

                  // onChange={(e) => {console.log(e.value); setSelectedYear(e.value.getFullYear()); setSelectedMonth(e.value.getMonth()+1)}} 
                  view="month" dateFormat="mm/yy" /></Col>
                  <Col md="2"> {selectedProject && selectedMonth && selectedYear ? <Button onClick={exportHandler} style={{ marginTop: "25px", height: "50px", width: "100%"}} >Export</Button>: null }</Col>
                </Row>
          </Card.Body>
            
          </Card>
        </Col>
        </Row>
        <Row>
          <Col lg="6" sm="6">
          <Card style={{height: "320px"}}>
              <Card.Header>
                <Card.Title as="h4">Projects</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListBox listStyle={{ maxHeight: '160px' }} filter value={selectedClientProject} onChange={(e) => {
                  console.log(e.value)
                  if (e.value) {
                    setSelectedClientProject(e?.value)
                  }
                }} options={clientProjects} optionLabel="name" className="w-full md:w-14rem" />

              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" sm="6">
          <Card style={{height: "320px"}} >
              <Card.Header>
                <Card.Title as="h4">Employees</Card.Title>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                  <ListBox listStyle={{ maxHeight: '160px' }} filter value={selectedEmployee} onChange={(e) => {
                  console.log(e.value)
                  if (e.value) {
                    setSelectedEmployee(e?.value)
                  }
                }} options={employees} optionLabel="FullName" className="w-full md:w-14rem" />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            
          </Col>
        </Row>
        
        <Row>
          {selectedProject && selectedYear && selectedMonth && employees?.length ? <ProjectEmployeeTable projectId={selectedProject.name} month={selectedMonth} year={selectedYear} client={selectedProject}></ProjectEmployeeTable>: null}
        </Row>
      </Container>
    </>
  );
}

export default ProjectComponent;
