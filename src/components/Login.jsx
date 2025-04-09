import React, { useState, useContext, useEffect } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  Box,
} from "@material-ui/core";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { authToken, login } = useContext(AuthContext);
  const showAlert = useAlert();
  const navigate = useNavigate();

  useEffect(() => {
    if (authToken) {
      navigate("/dashboard");
    }
  }, [authToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/login", {
        email,
        password,
        remember_me: rememberMe ? 1 : 0,
      });
      const { data } = response;
      login(data.meta.access_token);
      navigate("/dashboard");
      showAlert(`Welcome back, ${data.data.name || "Staff"}!`, "success");
    } catch (err) {
      setError(err.response?.data?.error?.message || "Invalid credentials");
      showAlert("Something went wrong!", "error");
    }
    setIsLoading(false);
  };

  return (
    <Grid container style={{ height: "100vh" }}>
      {/* Left Side */}
    {/* Left Section (Blue Background with Logo and Info) */}
    <Grid
        item
        xs={12}
        md={6}
        style={{
          background: "linear-gradient(to bottom, #007bff, #0056b3)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          padding: "2rem",
          position: "relative",
          clipPath: "polygon(0 0, 80% 0, 100% 50%, 80% 100%, 0 100%)",
        }}
      >
        <img 
          src="logo.png" 
          alt="Logo" 
          style={{ width: "150px", marginBottom: "2rem" }}
        />
        <Typography variant="h4" style={{ fontWeight: "bold", marginBottom: "25rem" }}>
          The GYM Republic
        </Typography>
        <Typography style={{ maxWidth: "400px", marginTop: "6rem" }}>
          5570 Paterno Street, cor, Cajigas St. P. Burgos Ave. Behind 7/11 public market Cavite City
        </Typography>
      </Grid>

      {/* Right Side */}
      <Grid item xs={12} md={6} style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "#f8f9fa" }}>
        <Paper elevation={6} style={{ padding: "2rem", width: "400px" }}>
          <Grid align="center">
            <Avatar style={{ backgroundColor: "#007bff", marginBottom: "2rem" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography variant="h5">STAFF LOGIN</Typography>
          </Grid>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              placeholder="Enter email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              placeholder="Enter password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <Button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </Button>
                ),
              }}
            />
            <FormControlLabel
              control={<Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />}
              label="Remember me"
            />
            {error && <Typography color="error">{error}</Typography>}
            <Typography align="center" style={{ marginTop: "-2rem", marginLeft: "12rem" }}>
              <Link href="/forgot-password">Forgot password?</Link>
            </Typography>

            <Button type="submit" 
                    color="primary" 
                    variant="contained" 
                    fullWidth disabled={isLoading}
                    style={{ marginTop: "3rem" }}
                    >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Login;
