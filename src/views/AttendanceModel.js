import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import AttendanceChart from './AttendanceChart';

function Example(props) {
  const {emp_name, attendanceReport}  = props;

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Attendence: {emp_name}</Modal.Title>
        </Modal.Header>
        <Modal.Body><AttendanceChart></AttendanceChart></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Example;