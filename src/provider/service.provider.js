import axios from 'axios'


const BASE_URL = process.env.BASE_PATH || "http://192.168.1.243:5000/api"

export const getEmployeeAttendance = async (empId) => {
    return await axios.get(`${BASE_URL}/attendance/employee/${empId}`)
}

export const getEmployeeAttendanceByProject = async (project) => {
    return await axios.get(encodeURI(`${BASE_URL}/attendance/project/${project}`))
}