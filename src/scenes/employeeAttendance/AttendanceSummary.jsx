import React, { useState, useEffect } from "react";
import {
  Box,
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
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { tokens } from "../../theme";

const AttendanceSummary = ({
  attendanceRecords = [],
  employees = [],
  selectedStaffId,
  setSelectedStaffId,
  EditButton,
  handleClickOpen,
  userRole = "admin", // pass 'admin' or 'staff' to control UI
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  // Auto-select first employee if only one exists (useful for staff account)
  useEffect(() => {
    if (!selectedStaffId && employees.length === 1) {
      setSelectedStaffId(employees[0].id);
    }
  }, [employees, selectedStaffId, setSelectedStaffId]);

  // Type-safe filtering
  const filteredRecords = attendanceRecords.filter((record) => {
    const recordDate = dayjs(record.date);
    const matchesStaff =
      !selectedStaffId || record.staff_id == selectedStaffId; // fix type issue
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

  const calculateSummary = () => {
    if (!selectedStaffId)
      return { present: 0, absent: 0, halfday: 0, total: 0 };

    return filteredRecords.reduce(
      (acc, record) => {
        acc[record.status]++; // Count the attendance status
        acc.total++;
        return acc;
      },
      { present: 0, absent: 0, halfday: 0, total: 0 }
    );
  };

  const summary = calculateSummary();

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
          {/* Show selector only if admin or more than one employee */}
          {(userRole === "admin" || employees.length > 1) && (
            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel id="select-staff-label">Select Staff Member</InputLabel>
              <Select
                labelId="select-staff-label"
                id="select-staff"
                value={selectedStaffId || ""}
                label="Select Staff Member"
                onChange={(e) => setSelectedStaffId(e.target.value)}
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
          )}

          {/* Date pickers for filtering attendance records */}
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

      {/* Only display attendance summary if a staff member is selected */}
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
              <Box display="flex" gap={4}>
                <Box>
                  <Typography color="success">Present Days</Typography>
                  <Typography variant="h4">{summary.present}</Typography>
                </Box>
                <Box>
                  <Typography color="error">Absent Days</Typography>
                  <Typography variant="h4">{summary.absent}</Typography>
                </Box>
                <Box>
                  <Typography color="warning.main">Half Days</Typography>
                  <Typography variant="h4">{summary.halfday}</Typography>
                </Box>
                <Box>
                  <Typography color={"info"}>Total Records</Typography>
                  <Typography variant="h4">{summary.total}</Typography>
                </Box>
              </Box>
            </Paper>

            <TableContainer
              component={Paper}
              sx={{ backgroundColor: colors.primary[400] }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell sx={{ textTransform: "capitalize" }}>
                        {record.status}
                      </TableCell>
                      <TableCell>
                        <EditButton onClick={() => handleClickOpen(record)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AttendanceSummary;
