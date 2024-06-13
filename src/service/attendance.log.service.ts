import axios from "axios"

const baseUrl = 'http://192.168.1.143:2000'
export const AttendanceService = {
    getAttendanceLogByProject: (projectId, year, month) => {
        return axios.get(`${baseUrl}/attendance_log/project/${projectId}/year/${year}/month/${month}`)
    }
}