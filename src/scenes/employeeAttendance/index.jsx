import React, { useState, useContext, useEffect, useRef } from "react";
import {
  Box,
  useTheme,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAlert } from "../../context/AlertContext";
import AttendanceSummary from "./AttendanceSummary";

const EmployeeAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [newAttendanceStatus, setNewAttendanceStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [timeRecordingStatus, setTimeRecordingStatus] = useState(null);

  const formatTime = (date) =>
    date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  const formatDate = (date) => date.toISOString().split("T")[0];

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/show-staff",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setEmployees(res.data.data);
    } catch (err) {
      console.error("Fetch employees failed", err);
      if (err.response?.status === 401) {
        showAlert("Session expired. Please login again.", "error");
        navigate("/");
      } else {
        showAlert("Error fetching employees", "error");
      }
    }
  };

  const fetchAttendanceData = async (staffId) => {
    setIsLoading(true);
    try {
      const url = staffId
        ? `http://localhost:8000/api/admin/show-attendance-list/${staffId}`
        : `http://localhost:8000/api/admin/show-attendance-list/`;
  
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      console.log("Attendance Data:", res.data.data);  // Add this line to inspect data
  
      const formatted = res.data.data.map((a) => ({
        id: a.staff_id,
        name: a.fullname, // Assuming staff relation is loaded
        date: a.date,
        clock_in_time: a.clock_in_time ? a.clock_in_time : "N/A",
        clock_out_time: a.clock_out_time ? a.clock_out_time : "N/A",
        staffId: a.staff_id,
      }));
  
      setEmployeesAttendance(formatted);
      setAttendanceRecords(res.data.data);
    } catch (err) {
      console.error("Fetch attendance failed", err);
      if (err.response?.status === 401) {
        showAlert("Session expired. Please login again.", "error");
        navigate("/");
      } else {
        showAlert("Error fetching attendance data", "error");
      }
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleAbsentEmployee = async () => {
    if (!selectedStaffId) {
      showAlert("Select employee first", "warning");
      return;
    }
    try {
      const currentDateTime = new Date();
      const requestData = {
        staff_id: selectedStaffId.id,
        fullname: selectedStaffId.fullname,
        date: formatDate(currentDateTime),
      };

      const response = await axios.post('http://localhost:8000/api/admin/mark-absent',
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )

      showAlert(response.data.message, "success");
      fetchAttendanceData(selectedStaffId.id);
    } catch (err) {
      console.error(`Failed to mark absent:`, err);
      showAlert(`Error: ${err.message}`, "error");
    }
  };

  const handleClickOpen = (row) => {
    setSelectedAttendance(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedAttendance(null);
    setNewAttendanceStatus("");
  };

  const staffAttendance = selectedStaffId
    ? employeesAttendance.filter((r) => r.staffId === selectedStaffId)
    : [];

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "clock_in_time", headerName: "Clock In", flex: 1 },
    { field: "clock_out_time", headerName: "Clock Out", flex: 1 },
  ];
  const handleStaffSelection = (staffId) => {
    setSelectedStaffId(staffId);
    fetchAttendanceData(staffId.id);
  };

  useEffect(() => {
    if (!authToken) return navigate("/");
    fetchEmployees();
    fetchAttendanceData();
  }, [authToken, navigate]);

  return (
    <Box m="20px">
      <Header
        title="Employee's Attendance"
        subtitle="Records of Employee's Attendance"
      />

      {employees.length > 0 && (
        <AttendanceSummary
          attendanceRecords={attendanceRecords}
          employees={employees}
          selectedStaffId={selectedStaffId}
          setSelectedStaffId={handleStaffSelection}
          handleClickOpen={handleClickOpen}
          handleAbsentEmployee={handleAbsentEmployee}
        />
      )}

      <Box
        mb={"20px"}
        height="75vh"
        sx={{ "& .MuiDataGrid-root": { border: "none" } }}
      >
        <DataGrid
          rows={employeesAttendance}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection
        />
      </Box>
    </Box>
  );
};

export default EmployeeAttendance;
