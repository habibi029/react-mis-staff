import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useAlert } from "../../context/AlertContext";
import AttendanceSummary from "./AttendanceSummary";

const EditButton = ({ onClick }) => {
  return (
    <Box display="flex" gap="9px" alignItems={"center"} height={"100%"}>
      <Button
        variant="outlined"
        color="success"
        startIcon={<EditOutlinedIcon />}
        onClick={onClick}
      >
        Update
      </Button>
    </Box>
  );
};

const EmployeeAttendance = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken, userId, role } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert("Attendance successfully updated.", "success");
  };

  const handleError = () => {
    showAlert("An error occurred while updating the attendance!", "error");
  };

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [employeesAttendance, setEmployeesAttendance] = useState([]);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [newAttendanceStatus, setNewAttendanceStatus] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch attendance records for Admin or Staff
  const fetchAttendanceData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        role === "admin" 
          ? "http://localhost:8000/api/admin/show-attendance-list" 
          : "http://localhost:8000/api/staff/attendance-lists",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const formattedData = response.data.data.map((attendance) => ({
        id: attendance.id,
        name: attendance.name,
        date: attendance.date,
        attendance: attendance.status,
        staff_id: attendance.staff_id,  // Assuming each attendance record has a staff_id field
      }));

      // Filter attendance records for the current staff member if the user is a staff
      if (role === "staff") {
        const filteredAttendance = formattedData.filter(
          (record) => record.staff_id === userId
        );
        setEmployeesAttendance(filteredAttendance);
      } else {
        setEmployeesAttendance(formattedData);  // Admin sees all records
      }

      setAttendanceRecords(formattedData);
    } catch (error) {
      console.error("Failed to fetch attendance data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update attendance status for Admin or Staff
  const handleUpdateAttendance = async () => {
    if (!selectedAttendance || !newAttendanceStatus) return;

    const updateUrl = `http://localhost:8000/api/admin/update-attendance/${selectedAttendance.id}`;

    const requestData = {
      attendance: newAttendanceStatus,
      staff_id: userId, // The logged-in staff member's ID
    };
  
    try {
      const response = await axios.post(
        updateUrl,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      fetchAttendanceData(); // Refresh attendance after update
      setSelectedAttendance(null);
      setNewAttendanceStatus("");
      setOpen(false);
      handleUpdateSuccess();
    } catch (error) {
      console.error("Failed to update attendance:", error);
      handleError();
    }
  };

  // Open dialog to update attendance
  const handleClickOpen = (row) => {
    setSelectedAttendance(row);
    setOpen(true);
  };

  // Close the dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedAttendance(null);
    setNewAttendanceStatus("");
  };

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "attendance", headerName: "Attendance", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <EditButton onClick={() => handleClickOpen(params.row)} />
      ),
    },
  ];

  useEffect(() => {
    if (!authToken) {
      navigate("/"); // Redirect to login if not authenticated
    } else {
      fetchAttendanceData(); // Fetch attendance data for the user (Admin or Staff)
    }
  }, [authToken, role, navigate]);

  return (
    <Box m="20px">
      <Header title="Employee's Attendance" subtitle="Records of Employee's Attendance" />
       <Box
        mb={"20px"}
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        {/* Render DataGrid for Admin or Staff */}
        <DataGrid
           loading={isLoading}
           checkboxSelection
           rows={employeesAttendance}
           columns={columns}
        />
      </Box>

      {/* Dialog for updating attendance */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Update Attendance</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the attendance status for {selectedAttendance?.name}.
          </DialogContentText>
          <FormControl fullWidth required sx={{ mt: 1 }}>
            <InputLabel>Attendance</InputLabel>
            <Select
              label="Attendance"
              value={newAttendanceStatus}
              onChange={(e) => setNewAttendanceStatus(e.target.value)}
            >
              <MenuItem value="present">Present</MenuItem>
              <MenuItem value="absent">Absent</MenuItem>
              <MenuItem value="halfday">Halfday</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error">
            Cancel
          </Button>
          <Button onClick={handleUpdateAttendance} color="secondary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EmployeeAttendance;
