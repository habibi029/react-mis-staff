import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { tokens } from "../../theme";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
const AttendanceSummary = ({
  attendanceRecords = [],
  employees = [],
  selectedStaffId,
  setSelectedStaffId,
  showAlert, // Added to show alerts on errors
  isLoading,
  handleAbsentEmployee,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  useEffect(() => {
    if (fromDate && toDate && fromDate.isAfter(toDate)) {
      showAlert("From date cannot be after To date", "warning");
    }
  }, [fromDate, toDate]);

  // Update the filtered records logic
 const filteredRecords = attendanceRecords.filter((record) => {
  const recordDate = dayjs(record.date);
  const matchesStaff =
    !selectedStaffId || record.staff_id === selectedStaffId.id;
  const matchesFromDate =
    !fromDate ||
    recordDate.isAfter(fromDate, "day") ||
    recordDate.isSame(fromDate, "day");
  const matchesToDate =
    !toDate ||
    recordDate.isBefore(toDate, "day") ||
    recordDate.isSame(toDate, "day");

  return matchesStaff && matchesFromDate && matchesToDate;
});


  // Update the calculate summary function
  const calculateSummary = () => {
    if (!selectedStaffId)
      return { presentDays: 0, halfDays: 0, absentDays: 0, totalHours: 0 };
  
    let presentDays = 0;
    let halfDays = 0;
    let absentDays = 0;
    let totalHours = 0;
  
    filteredRecords.forEach((record) => {
      const inTime = record.clock_in_time ? dayjs(record.clock_in_time) : null;
      const outTime = record.clock_out_time ? dayjs(record.clock_out_time) : null;
  
      // ❗ Skip this record if incomplete (ongoing shift or missing times)
      if (!inTime || !outTime) return;
  
      const hoursWorked = outTime.diff(inTime, "hour", true);
  
      if (hoursWorked >= 8) {
        presentDays++;
      } else if (hoursWorked >= 4) {
        halfDays++;
      } else {
        absentDays++;
      }
  
      totalHours += hoursWorked;
    });
  
    return {
      presentDays,
      halfDays,
      absentDays,
      totalHours: Math.round(totalHours * 100) / 100,
    };
  };
  

  const pendingLogs = filteredRecords.filter(
    (r) => r.clock_in_time && !r.clock_out_time
  );
  console.log("Ongoing logs:", pendingLogs.length);
  
  
  // Update the table to include more information
  <TableContainer
    component={Paper}
    sx={{ backgroundColor: colors.primary[400] }}
  >
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Clock In</TableCell>
          <TableCell>Clock Out</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredRecords.map((record) => (
          <TableRow key={record.id}>
            <TableCell>{record.id}</TableCell>
            <TableCell>{dayjs(record.date).format("YYYY-MM-DD")}</TableCell>
            <TableCell>
              {record.clock_in_time
                ? dayjs(record.clock_in_time).format("HH:mm:ss")
                : "Not clocked in"}
            </TableCell>
            <TableCell>
              {record.clock_out_time
                ? dayjs(record.clock_out_time).format("HH:mm:ss")
                : "Not clocked out"}
            </TableCell>
            <TableCell>
              <Typography
                color={
                  record.attendance === "present"
                    ? "success.main"
                    : record.attendance === "absent"
                    ? "error.main"
                    : "warning.main"
                }
              >
                {record.attendance}
              </Typography>
            </TableCell>
            <TableCell>{record.reason || "-"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>;

  const summary = calculateSummary();

  if (isLoading) return <CircularProgress />;

  return (
    <Box>
      <Box mb={2}>
        <Stack
          spacing={2}
          padding={2}
          borderRadius={1}
          backgroundColor={colors.primary[400]}
          direction={{ xs: "column", sm: "row" }}
          alignItems="flex-start"
          sx={{ width: "fit-content" }}
        >
         <FormControl sx={{ minWidth: 220 }}>
  <InputLabel id="select-staff-label">Select Staff Member</InputLabel>
  <Select
    labelId="select-staff-label"
    id="select-staff"
    value={selectedStaffId?.id || ""}
    label="Select Staff Member"
    onChange={(e) => {
      const selectedId = e.target.value;
      const selectedStaff = employees.find((staff) => staff.id === selectedId);
      setSelectedStaffId(selectedStaff);
    }}
  >
    <MenuItem key={"all"} value="">
      <em>-- All --</em>
    </MenuItem>
    {employees.map((staff) => (
      <MenuItem key={staff.id} value={staff.id}>
        {staff.fullname}
      </MenuItem>
    ))}
  </Select>
</FormControl>


          {selectedStaffId && (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="From Date"
                value={fromDate}
                onChange={(newValue) => setFromDate(newValue)}
              />
              <DatePicker
                label="To Date"
                value={toDate}
                onChange={(newValue) => setToDate(newValue)}
              />
            </LocalizationProvider>
          )}
        </Stack>
      </Box>

      {selectedStaffId && (
        <>
          <Box mb={2}>
            <Paper
              elevation={3}
              sx={{ p: 3, mb: 2, backgroundColor: colors.primary[400] }}
            >
              <Typography variant="h6" gutterBottom>
                Attendance Summary
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Box display="flex" gap={4}>
                <Box>
                  <Typography color="success">Present Days</Typography>
                  <Typography variant="h4">{summary.presentDays}</Typography>
                </Box>
                <Box>
                  <Typography color="error">Absent Days</Typography>
                  <Typography variant="h4">{summary.absentDays}</Typography>
                </Box>
                <Box>
                  <Typography color="warning.main">Half Days</Typography>
                  <Typography variant="h4">{summary.halfDays}</Typography>
                </Box>
                <Box>
                  <Typography color="info">Total Hours Worked</Typography>
                  <Typography variant="h4">{summary.totalHours} hrs</Typography>
                </Box>
                </Box>
                <Box display="flex" gap={2}>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<PlayArrowIcon />}
                              onClick={handleAbsentEmployee}
                              disabled={"timeRecordingStatus" === "clock_in_time"}
                              sx={{ flex: 1 }}
                            >
                              {"none" === "clock_in_time" ? "Processing..." : "Mark Absent"}
                            </Button>
                  </Box>
              </Box>
             
            </Paper>
                
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceSummary;