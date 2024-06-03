import React, {useState} from "react";

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
  Modal
} from "react-bootstrap";

import { ProgressBar } from 'primereact/progressbar';
import "primereact/resources/themes/lara-light-indigo/theme.css";
import AttendanceChart from "./AttendanceChart";



function EmployeeList(props) {

  const {data} = props;
  console.log("data", data)
  const [index, setIndex] = useState(0)
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true)
    console.log('index', e.target.id);
    setIndex(e.target.id)
    
  };

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Employee Details</Card.Title>
                {/* <p className="card-category">
                  Here is a subtitle for this table
                </p> */}
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table responsive className="table-hover table-striped">
                  <thead>
                    <tr>
                      <th className="border-0">S.No</th>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Location</th>
                      <th className="border-0">Team</th>
                      <th className="border-0">RM</th>
                      <th className="border-0">Compliance</th>
                      <th className="border-0">Attendance</th>
                      <th className="border-0">Present</th>
                      <th className="border-0">Absent</th>
                      <th className="border-0">Entries</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      data?.map((obj, i) => {
                        let attendancePer = obj.attendance.presence + obj.attendance.absence == 0 ? 0 : Math.round(obj.attendance.presence/(obj.attendance.presence + obj.attendance.absence) * 100)
                        let compliencyPer = obj.compliency.presence + obj.compliency.absence == 0 ? 0 : Math.round(obj.compliency.presence/(obj.compliency.presence + obj.compliency.absence) * 100)
                        return <tr>
                        <td>{(i+1)}</td>
                        <td >{obj.empId}</td>
                        <td >{obj.emp_name}</td>
                        <td >{obj.location}</td>
                        <td >{obj.team}</td>
                        <td >{obj.reporting_manager}</td>
                        <td ><ProgressBar value={compliencyPer}></ProgressBar>{compliencyPer}%</td>
                        <td ><ProgressBar value={attendancePer}></ProgressBar>{attendancePer}%</td>
                        <td >{obj.attendance?.presence}</td>
                        <td >{obj.attendance.absence}</td>
                        <td className="border-0"><Button variant="primary" id={i} onClick={handleShow}>
        Entries
      </Button></td>
                      </tr>
                      })
                    }
                  </tbody>
                  {/* <tbody>
                    <tr>
                      <td>1</td>
                      <td>Dakota Rice</td>
                      <td>$36,738</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Minerva Hooper</td>
                      <td>$23,789</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sage Rodriguez</td>
                      <td>$56,142</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Philip Chaney</td>
                      <td>$38,735</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Doris Greene</td>
                      <td>$63,542</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Mason Porter</td>
                      <td>$78,615</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                    </tr>
                  </tbody> */}
                </Table>
              </Card.Body>
            </Card>
          </Col>
          {/* <Col md="12">
            <Card className="card-plain table-plain-bg">
              <Card.Header>
                <Card.Title as="h4">Table on Plain Background</Card.Title>
                <p className="card-category">
                  Here is a subtitle for this table
                </p>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <Table className="table-hover">
                  <thead>
                    <tr>
                      <th className="border-0">ID</th>
                      <th className="border-0">Name</th>
                      <th className="border-0">Salary</th>
                      <th className="border-0">Country</th>
                      <th className="border-0">City</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>Dakota Rice</td>
                      <td>$36,738</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>Minerva Hooper</td>
                      <td>$23,789</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                    </tr>
                    <tr>
                      <td>3</td>
                      <td>Sage Rodriguez</td>
                      <td>$56,142</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                    </tr>
                    <tr>
                      <td>4</td>
                      <td>Philip Chaney</td>
                      <td>$38,735</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                    </tr>
                    <tr>
                      <td>5</td>
                      <td>Doris Greene</td>
                      <td>$63,542</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                    </tr>
                    <tr>
                      <td>6</td>
                      <td>Mason Porter</td>
                      <td>$78,615</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                    </tr>
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
      <>
      <Modal  show={show} onHide={handleClose} >
    {/* className="modal-dialog modal-dialog-centered" */}
    {/* style={{width: "100%", height: "90%", position: "absolute", top: "10px", */}
  {/* //  right: "100px",  bottom: 0, left: 0, zIndex: 10040, overflow: "auto", overflowY: "auto" }} */}
        {/* <Modal.Header closeButton>
          <Modal.Title>Attendence: {data?.emp_name}</Modal.Title>
        </Modal.Header> */}
        {/* <Modal.Body>
          <AttendanceChart attendanceReport = {data?.[index]?.attendanceReport || []}></AttendanceChart>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer> */}
        {/* <h4>{data?.[index]?.emp_name}</h4> */}
        <AttendanceChart attendanceReport = {data?.[index]?.attendanceReport || []} name = {data?.[index]?.emp_name}></AttendanceChart>
      </Modal>
    </>
    </>
  );
}

export default EmployeeList;
