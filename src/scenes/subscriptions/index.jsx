import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Modal,
  Typography,
  TextField,
  Autocomplete,
  Skeleton,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { useReactToPrint } from "react-to-print";
import { ComponentToPrint } from "../../components/ComponentToPrint";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SubscriptionReceipt from "./SubscriptionReceipt";
import { useAlert } from "../../context/AlertContext";
import TransactionSummary from "./TransactionSummary";
import SubscriptionSkeleton from "./SubscriptionSkeleton";
import { checkServiceConflict } from "../../utils/serviceConflicts";
import CloseIcon from "@mui/icons-material/Close";

const getRandomDarkColor = (number) => {
  return `hsl(${number}, 30%, 50%)`;
};

const Subscriptions = () => {
  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [cart, setCart] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [amountPaid, setAmountPaid] = useState(0);
  const [customerId, setCustomerId] = useState(null);
  const [customerName, setCustomerName] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [instructorName, setInstructorName] = useState("");
  const [instructorId, setInstructorId] = useState(null);
  const [instructors, setInstructors] = useState([]);
  const [colours, setColours] = useState([]);
  const [transactionCode, setTransactionCode] = useState("");
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [isTransactionSummaryOpen, setIsTransactionSummaryOpen] =
    useState(false);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      initializeData();
    }
  }, [authToken, navigate]);

  const initializeData = async () => {
    setIsFetching(true);
    try {
      await fetchServices();
      await fetchCustomers();
      await fetchInstructors();
      setIsFetching(false);
    } catch (error) {
      console.error(error);
      setIsFetching(false);
    }
  };

  useEffect(() => {
    calculateTotalAmount();
  }, [cart]);

  const handleCreateSuccess = () => {
    showAlert(`Transaction successfully saved.`, "success");
  };

  const handleError = (errorMessage) => {
    showAlert(
      errorMessage || "An error occurred while saving the transaction!",
      "error"
    );
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/show-exercise-list",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      if (response.status === 200) {
        const randomColors = response.data.data.map((item, index) =>
          getRandomDarkColor(999 * index)
        );
        setColours(randomColors);
        setServices(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/show-client",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCustomers(response.data.data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/staff/show-staff-list",
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setInstructors(response.data.data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
    }
  };

  const addServiceToCart = (service) => {
    const exists = cart.find((item) => item.id === service.id);

    const hasConflict = checkServiceConflict(cart, service);

    const expireDate =
      service.tag === "monthly"
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        : new Date(Date.now() + 24 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

    if (exists || hasConflict) {
      toast.error(`${service.name} is already in the cart`);
    } else {
      const newService = {
        ...service,
        exercise_id: service.id,
        isMainPlan: service.tag === "monthly",
        expire_date: expireDate,
      };
      setCart([...cart, newService]);
      toast.success(`${service.name} added to cart`);
    }
  };

  const isServiceDisabled = (service) => {
    return (
      cart.some((item) => item.exercise_id === service.id) ||
      checkServiceConflict(cart, service)
    );
  };

  const removeServiceFromCart = (serviceId) => {
    setCart(cart.filter((item) => item.id !== serviceId));
  };

  const calculateTotalAmount = () => {
    const total = cart.reduce((sum, item) => sum + Number(item.price), 0);
    setTotalAmount(total);
  };

  const handlePayNow = () => {
    generateTransactionCode();
    setIsCustomerModalOpen(true);
  };

  const handleCompleteTransaction = async (e) => {
    e.preventDefault();
    setIsCustomerModalOpen(false);
    setTransactionDetails({
      customerName,
      instructorName,
      cart,
      totalAmount,
      amountPaid,
      change: amountPaid - totalAmount,
      transactionCode,
    });
    if (amountPaid < totalAmount) {
      handleError("Insufficient payment amount!");
    } else {
      setIsTransactionSummaryOpen(true);
    }
  };

  const handleCloseReceiptModal = () => {
    setIsReceiptModalOpen(false);
    setCart([]);
    setTransactionCode("");
    setCustomerId(null);
    setCustomerName("");
    setInstructorId(null);
    setInstructorName("");
    setTotalAmount(0);
    setAmountPaid(0);
  };

  const handleNavigateToCustomerList = () => {
    if (confirm("Do you want to go to customer list?")) {
      navigate("/customer-list");
    }
  };

  const createTransaction = async () => {
    cart.map(async (item, index) => {
      const transactionItem = {
        isMainPlan: item.isMainPlan,
        exercise_id: item.exercise_id,
        expire_date: item.expire_date,
        client_id: customerId,
        instructor_id: instructorId,
        transaction_code: transactionCode,
      };

      try {
        const response = await axios.post(
          "http://localhost:8000/api/staff/exercise-transaction/add",
          transactionItem,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
      } catch (error) {
        console.error(error);
        return;
      }
    });
  };

  const handleFinalizeTransaction = async () => {
    if (
      confirm(
        "Are you sure all the details are correct before continuing? This action cannot be undone."
      )
    ) {
      try {
        await createTransaction();
        setIsTransactionSummaryOpen(false);
        setIsReceiptModalOpen(true);
        handleCreateSuccess();
      } catch (error) {
        handleError();
      }
    }
  };

  const generateTransactionCode = () => {
    const code = Math.random().toString(36).substring(2, 9).toUpperCase();
    setTransactionCode(code);
  };

  return (
    <Box m="20px">
      <Header title="Subscriptions" subtitle="Manage customer subscriptions" />

      {isFetching ? (
        // Skeleton Loader
        <SubscriptionSkeleton />
      ) : (
        <Box
          display="flex"
          gap={2}
          sx={{
            flexDirection: {
              xs: "column-reverse",
              sm: "column-reverse",
              md: "row",
            },
          }}
        >
          {/* Services List */}
          <Box flex={1}>
            <Typography marginBottom={"0.5rem"} variant="h6">
              Available Services
            </Typography>
            <Box
              display="grid"
              gap={2}
              sx={{
                gridTemplateColumns: {
                  xs: "1fr 1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr",
                  lg: "1fr 1fr 1fr",
                  xl: "1fr 1fr 1fr 1fr",
                },
              }}
            >
              {services.map((service, index) => (
                <Box
                  key={service.id}
                  sx={{
                    backgroundColor: colours[index],
                    cursor: isServiceDisabled(service)
                      ? "not-allowed"
                      : "pointer",
                    color: "white",
                    opacity: isServiceDisabled(service) ? "50%" : "100%",
                  }}
                  p={2}
                  border="1px solid #ddd"
                  borderRadius="8px"
                  onClick={() => addServiceToCart(service)}
                >
                  <Typography variant="subtitle1">{service.name}</Typography>
                  <Typography variant="body2">₱{service.price}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Cart */}
          <Box flex={1}>
            <Typography marginBottom={"0.5rem"} variant="h6">
              Cart
            </Typography>
            <div className="table-responsive bg-dark">
              <table className="table table-responsive table-dark table-hover">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td>₱{item.price}</td>
                      <td>
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => removeServiceFromCart(item.id)}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Typography variant="h6" mt={2}>
              Total: ₱{totalAmount}
            </Typography>
            <Button
              variant="contained"
              color="info"
              onClick={handlePayNow}
              disabled={cart.length === 0}
              style={{ marginTop: "16px" }}
              // className="bg-dark"
            >
              Pay Now
            </Button>
          </Box>
        </Box>
      )}

      {/* Other Information Modal */}
      <Modal
        open={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            p: 4,
            borderRadius: "8px",
            width: 400,
          }}
        >
          <IconButton
            aria-label="close"
            onClick={() => setIsCustomerModalOpen(false)}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant="h6" component="h2">
            Customer
          </Typography>
          <Autocomplete
            options={[
              { id: "new", fullname: "-- New Customer --" },
              ...customers,
            ]}
            getOptionLabel={(option) => option.fullname}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Customer"
                fullWidth
                required
                // error={customerId === null}
                helperText={!customerId ? "Customer is required" : ""}
              />
            )}
            onChange={(event, newValue) => {
              if (newValue) {
                setCustomerId(newValue.id);
                setCustomerName(newValue.fullname);
                if (newValue.id === "new") {
                  handleNavigateToCustomerList();
                }
              } else {
                setCustomerId(null);
              }
            }}
            sx={{ mt: 2, mb: 2 }}
          />
          <Typography variant="h6" component="h2">
            Instructor
          </Typography>
          <Autocomplete
            options={[...instructors]}
            getOptionLabel={(option) =>
              option.firstname + " " + option.lastname
            }
            renderInput={(params) => (
              <TextField {...params} label="Search Instructor" fullWidth />
            )}
            onChange={(event, newValue) => {
              if (newValue) {
                setInstructorName(newValue.firstname + " " + newValue.lastname);
                setInstructorId(newValue.id);
              } else {
                setInstructorId(null);
              }
            }}
            sx={{ mt: 2, mb: 2 }}
          />
          <TextField
            label="Amount Paid"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            fullWidth
            required
            type="number"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleCompleteTransaction}
            fullWidth
            disabled={customerId === null}
          >
            Complete Transaction
          </Button>
        </Box>
      </Modal>

      <Modal
        open={isTransactionSummaryOpen}
        onClose={() => setIsTransactionSummaryOpen(false)}
        aria-labelledby="transaction-summary-modal"
        aria-describedby="transaction-summary-modal-description"
      >
        <TransactionSummary
          transactionDetails={transactionDetails}
          onClose={() => setIsTransactionSummaryOpen(false)}
          onProceed={handleFinalizeTransaction}
        />
      </Modal>

      <Modal
        open={isReceiptModalOpen}
        onClose={handleCloseReceiptModal}
        aria-labelledby="receipt-modal"
        aria-describedby="receipt-modal-description"
        style={{ overflowY: "auto" }}
      >
        <SubscriptionReceipt
          transactionDetails={transactionDetails}
          onClose={handleCloseReceiptModal}
        ></SubscriptionReceipt>
      </Modal>
    </Box>
  );
};

export default Subscriptions;
