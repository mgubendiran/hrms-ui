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
import { getEmployeeAttendance } from "provider/service.provider";

import Compliency from './compliency.component'
import EmployeeList from './EmployeeList'
import { ListBox } from 'primereact/listbox';
import { getEmployeeAttendanceByProject } from "provider/service.provider";
import EmployeeDetails from "./EmployeeDetails";

function Dashboard() {
  const [data, setData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [employees, setEmployees] = useState([])
  const [employee, setEmployee] = useState(null)
  const [projects, setProjects] = useState([])
  const [project, setProject] = useState(null)

  const [title, setTitle] = useState('Location')
  const [titleName, setTitleName] = useState('Chennai')
  const [searchKey, setSearchKey] = useState(null)
  const [compliency, setCompliency] = useState({ presence: 0, absence: 0 })
  const [attendance, setAttendance] = useState({ presence: 0, absence: 0 })
  const [isRemote, setIsRemote] = useState(false)



  useEffect(() => {
    axios.get('http://192.168.1.243:5000/api/dashboard')
      .then(response => {
        console.log(response.data)
        setProjects(response.data.teams.map(team => { return { label: team, code: team } }));
        setTitle('Project')
        setTitleName(response.data.teams[0])
        projectHandler(response.data.teams[0])
        setEmployees(response.data.employees)
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const employeeHandler = (searchKey) => {
    if (searchKey) {
      getEmployeeAttendance(searchKey).then(res => {
        setAttendance(res.data.attendance)
        setCompliency(res.data.compliency)
        setIsRemote(res.data.isRemote)
        setUserData(res.data)
      })
    }
  }


  const projectHandler = (searchKey) => {
    if (searchKey) {
      getEmployeeAttendanceByProject(searchKey).then(res => {
        console.log(res.data)
        setAttendance(res.data.attendance)
        setCompliency(res.data.compliency)
        setData(res.data.report)
      })
    }
  }

  // let compliency = { presence: 10, absence: 5 };
  // let attendance = { presence: 14, absence: 8 }

  const groupTemplate = (option) => {
    return (<div className="flex align-items-center gap-2">
      <img alt={option.name} src="https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png" style={{ width: '18px' }} />
      <div>{option.name}</div>
    </div>
    );
  };


  return (
    <>
      <Container fluid>
        <Row>
          <Col lg="6" sm="6">
            <Card >
              <Card.Header>
                <Card.Title as="h4">Project</Card.Title>
              </Card.Header>
              <Card.Body>
                <div>
                  <ListBox filter value={project} onChange={(e) => {
                    console.log(e.value)
                    if (e.value) {
                      setProject(e.value)
                      setTitle('Project')
                      setSearchKey(e?.value?.code)
                      setTitleName(e.value?.label)
                      projectHandler(e?.value?.code)
                    }
                  }} options={projects} optionLabel="label" listStyle={{ maxHeight: '160px' }} />

                  {/* <ListBox value={project} onChange={(e) => setProject(e.value)} options={projects} optionLabel="label" className="w-full md:w-14rem" listStyle={{ maxHeight: '250px' }} /> */}
                  {/* <ListBox value={project} onChange={(e) => setProject(e.value)} options={projects} optionLabel="label" 
    optionGroupLabel="label" optionGroupTemplate={groupTemplate} className="w-full md:w-14rem" listStyle={{ maxHeight: '250px' }} /> */}
                  {/* <ListBox value={selectedCity} onChange={(e) => setSelectedCity(e.value)} options={cities} optionLabel="name" className="w-full md:w-14rem" /> */}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg="6" sm="6">
            <Card >
              <Card.Header>
                <Card.Title as="h4">Employee</Card.Title>
              </Card.Header>
              <Card.Body>
                <ListBox filter value={employee} onChange={(e) => {
                  console.log(e.value)
                  if (e.value) {
                    setEmployee(e.value)
                    setTitle('Employee')
                    setTitleName(e.value?.label)
                    setSearchKey(e?.value?.code)
                    employeeHandler(e?.value?.code)
                  }
                }} options={employees} optionLabel="label" className="w-full md:w-14rem" listStyle={{ height: '160px' }} />

              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Compliency isRemote={isRemote} searchKey={searchKey} titleName={titleName} title={title} compliency={compliency} attendance={attendance} />
        {title == 'Project' ? <EmployeeList data = {data}></EmployeeList> : <></>}
        {title == 'Employee' ? <EmployeeDetails userData = {userData} ></EmployeeDetails> : <></>}
      </Container>
    </>
  );
}

export default Dashboard;
