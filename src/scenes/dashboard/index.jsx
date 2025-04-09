import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
  Snackbar,
  Alert,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { tokens } from "../../theme";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Header from "../../components/Header";
import StatBox from "../../components/StatBOx";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DashboardSkeleton from "./DashboardSkeleton";
import { useNotification } from "../../context/NotificationContext";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const { initializeNotifications } = useNotification();
  const navigate = useNavigate();

  const [timeIn, setTimeIn] = useState("");
  const [timeOut, setTimeOut] = useState("");
  const [activeInstructors, setActiveInstructors] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");
  const [dashboardData, setDashboardData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const generateEmployeeId = () => {
    // Generate Employee ID based on the current list length
    return `EMP${(activeInstructors.length + 1).toString().padStart(3, "0")}`;
  };

  const fetchDashboardData = async () => {
    setIsFetching(true);
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/dashboard",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setDashboardData(response.data);
      const dataResponse = response.data;
      console.log(response);
      const instructorList = dataResponse["instructor_list:"].map((item) => ({
        name: `${item.firstname} ${item.lastname}`,
        status: item.is_active ? "active" : "inactive",
        employeeId: `EMP${item.id.toString().padStart(3, "0")}`,
        contactNo: item.contact_no,
        email: item.email,
      }));

      setActiveInstructors(instructorList);
      setIsFetching(false);
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      setIsFetching(false);
    }
  };

  const handleTimeIn = () => {
    if (!timeIn) {
      setAlertMessage("Time In cannot be empty!");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }

    const newEmpId = generateEmployeeId();

    setAlertMessage(`Time In submitted successfully! Employee ID: ${newEmpId}`);
    setAlertType("success");
    setAlertOpen(true);

    setActiveInstructors([
      ...activeInstructors,
      {
        name: `Instructor ${activeInstructors.length + 1}`,
        status: "active",
        employeeId: newEmpId,
      },
    ]);
    setTimeIn("");
  };

  const handleTimeOut = () => {
    if (!timeOut) {
      setAlertMessage("Time Out cannot be empty!");
      setAlertType("error");
      setAlertOpen(true);
      return;
    }
    setAlertMessage("Time Out submitted successfully!");
    setAlertType("success");
    setAlertOpen(true);
    setTimeOut("");
  };

  // Toggle instructor status between "active" and "inactive"
  const toggleInstructorStatus = (name) => {
    setActiveInstructors(
      activeInstructors.map((instructor) =>
        instructor.name === name
          ? {
              ...instructor,
              status: instructor.status === "active" ? "inactive" : "active",
            }
          : instructor
      )
    );
  };

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      fetchDashboardData();
      initializeNotifications(authToken);
    }
  }, [authToken, navigate]);

  return (
    <>
      {isFetching ? (
        <DashboardSkeleton />
      ) : (
        <Box m="20px">
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
          </Box>

          {/* GRID & CHARTS */}
          <Box
            display="grid"
            gap={2}
            sx={{
              maxWidth: "96rem",
              gridTemplateColumns: {
                sm: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
            }}
          >
            {/* ROW 1 */}
            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={3}
            >
              <StatBox
                title={`${dashboardData?.total_equipmen || 0}`}
                subtitle="Equipment"
                progress="0.75"
                increase="+14%"
                icon={
                  <FitnessCenterOutlinedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={3}
            >
              <StatBox
                title={`${dashboardData?.total_products || 0}`}
                subtitle="Products"
                progress="0.50"
                increase="+21%"
                icon={
                  <InventoryOutlinedIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
            <Box
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              padding={3}
            >
              <StatBox
                title={`${dashboardData?.total_customers || 0}`}
                subtitle="Customers"
                progress="0.30"
                increase="+5%"
                icon={
                  <PersonAddIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "26px" }}
                  />
                }
              />
            </Box>
          </Box>

          {/* Instructors Section */}
          <Box marginTop={"2rem"}>
            <Typography variant="h3" fontWeight="600">
              List of Instructors
            </Typography>
            <Box
              display="grid"
              gap={2}
              backgroundColor={colors.primary[400]}
              marginTop="0.5rem"
              p="30px"
              sx={{
                maxHeight: "500px",
                maxWidth: "96rem",
                overflowY: "scroll",
                gridTemplateColumns: {
                  sm: "1fr",
                  md: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
              }}
            >
              {activeInstructors.map((instructor, index) => (
                <Card
                  key={index}
                  sx={{
                    padding: "15px",
                    marginBottom: "10px",
                    backgroundColor: colors.primary[400],
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <CardContent>
                    <Typography variant="h6">{instructor.name}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {instructor.status === "active"
                        ? "Active Instructor"
                        : "Inactive Instructor"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Employee ID: {instructor.employeeId}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Contact Number: {instructor.contactNo}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Email Address: {instructor.email}
                    </Typography>
                  </CardContent>
                  <IconButton
                    onClick={() => toggleInstructorStatus(instructor.name)}
                    color={instructor.status === "active" ? "success" : "error"}
                  >
                    {instructor.status === "active" ? (
                      <CheckCircleIcon />
                    ) : (
                      <CancelIcon />
                    )}
                  </IconButton>
                </Card>
              ))}
            </Box>
          </Box>

          {/* Snackbar for Alerts */}
          <Snackbar
            open={alertOpen}
            autoHideDuration={2000}
            onClose={handleAlertClose}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={handleAlertClose} severity={alertType}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
