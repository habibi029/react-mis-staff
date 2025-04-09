import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Tooltip,
  useTheme,
  Modal,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAlert } from "../../context/AlertContext";

const InventoryTable = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { authToken } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  const handleUpdateSuccess = () => {
    showAlert(`Inventory successfully updated.`, "success");
  };

  const handleError = () => {
    showAlert("An error occurred while updating the inventory!", "error");
  };

  const [inventoryData, setInventoryData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  useEffect(() => {
    if (!authToken) {
      navigate("/");
    } else {
      const fetchInventoryData = async () => {
        try {
          const response = await axios.get(
            "http://localhost:8000/api/staff/inventory-lists",
            {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            }
          );
          const inventories = response.data.data.filter(
            (item) => item.type === "supplement"
          );
          setInventoryData(inventories);
          console.log(inventories);
        } catch (error) {
          console.error("Error fetching inventory data:", error);
        }
      };

      fetchInventoryData();
    }
  }, [authToken, navigate]);

  // const handleEdit = (item) => {
  //   setCurrentItem(item);
  //   setEditModalOpen(true);
  // };

  const handleEditChange = (event) => {
    const { name, value } = event.target;
    setCurrentItem({
      ...currentItem,
      [name]: value,
    });
  };

  const handleEditSubmit = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8000/api/admin/update-inventory/${currentItem.id}`,
        currentItem,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      console.log("Inventory updated successfully:", response.data);
      setEditModalOpen(false);
      // Refresh the inventory data
      const updatedInventoryData = inventoryData.map((item) =>
        item.id === currentItem.id ? response.data.data : item
      );
      setInventoryData(updatedInventoryData);
      handleUpdateSuccess();
    } catch (error) {
      console.error("Error updating inventory:", error);
      handleError();
    }
  };

  const getStockLevelColor = (stockLevel) => {
    if (stockLevel <= 5) return "error.main"; // Low stock
    if (stockLevel <= 15) return "warning.main"; // Medium stock
    return "success.main"; // High stock
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Header
        title="Supplements"
        subtitle="Monitor and track supplement inventory"
      />
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: colors.primary[400] }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Item Code</b>
              </TableCell>
              <TableCell>
                <b>Name</b>
              </TableCell>
              <TableCell>
                <b>Stock Level</b>
              </TableCell>
              <TableCell>
                <b>Description</b>
              </TableCell>
              <TableCell>
                <b>Unit Price</b>
              </TableCell>
              {/* <TableCell>
                <b>Action</b>
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {inventoryData?.map((inventory) => (
              <TableRow key={inventory.id}>
                <TableCell>{inventory.item_code.toUpperCase()}</TableCell>
                <TableCell>{inventory.name}</TableCell>
                <TableCell
                  sx={{
                    color: getStockLevelColor(inventory.quantity),
                    fontWeight: "bold",
                  }}
                >
                  {inventory.quantity}
                </TableCell>
                <TableCell>
                  {inventory.short_description || (
                    <i style={{ color: colors.grey[500] }}>
                      No description available
                    </i>
                  )}
                </TableCell>
                <TableCell>{inventory.price}</TableCell>
                {/* <TableCell>
                  <Tooltip title="Edit this equipment" arrow>
                    <Button
                      variant="contained"
                      color="secondary"
                      startIcon={<EditOutlinedIcon />}
                      onClick={() => handleEdit(inventory)}
                      sx={{ marginRight: 1 }}
                    >
                      Edit
                    </Button>
                  </Tooltip>
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Modal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        aria-labelledby="edit-inventory-modal"
        aria-describedby="edit-inventory-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Edit Inventory
          </Typography>
          {currentItem && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                label="Name"
                name="name"
                value={currentItem.name}
                onChange={handleEditChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth required sx={{ mb: 2 }}>
                <InputLabel>Type</InputLabel>
                <Select
                  label="Type"
                  name="type"
                  value={currentItem.type}
                  onChange={handleEditChange}
                >
                  <MenuItem value="equipment">Equipment</MenuItem>
                  <MenuItem value="supplement">Supplement</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Description"
                name="short_description"
                value={currentItem.short_description}
                onChange={handleEditChange}
                fullWidth
                multiline
                rows={4}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Quantity"
                name="quantity"
                value={currentItem.quantity}
                type="number"
                onChange={handleEditChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <TextField
                label="Price"
                name="price"
                value={currentItem.price}
                type="number"
                onChange={handleEditChange}
                fullWidth
                required
                sx={{ mb: 2 }}
              />
              <Box mt={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleEditSubmit}
                  sx={{ mr: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => setEditModalOpen(false)}
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default InventoryTable;
