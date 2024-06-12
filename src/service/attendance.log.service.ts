import axios from "axios"

const baseUrl = 'http://localhost:2000'
export const AttendanceService = {
    getAttendanceLogByProject: (projectId, year, month) => {
        return axios.get(`${baseUrl}/attendance_log/project/${projectId}/year/${year}/month/${month}`)
    }
}