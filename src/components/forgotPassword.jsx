import React, { useState } from "react";
import {
  useTheme,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Grid,
  FormHelperText,
  Box,
} from "@mui/material";
import { tokens } from "../theme";
import { useNavigate } from "react-router-dom"; // Use React Router for navigation

const ForgotPassword = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate(); // Initialize navigation

  const questions = [
    "What is your favorite color?",
    "What was the name of your pet?",
    "What is your mother's maiden name?", // Added a third question
  ];

  const [selectedQuestions, setSelectedQuestions] = useState({
    question1: "",
    question2: "",
    question3: "",
  });

  const [answers, setAnswers] = useState({
    answer1: "",
    answer2: "",
    answer3: "",
  });

  const [error, setError] = useState({
    question1: false,
    question2: false,
    question3: false,
    answer1: false,
    answer2: false,
    answer3: false,
  });

  const handleQuestionChange = (event, questionKey) => {
    setSelectedQuestions((prev) => ({
      ...prev,
      [questionKey]: event.target.value,
    }));
  };

  const handleAnswerChange = (event, answerKey) => {
    setAnswers((prev) => ({
      ...prev,
      [answerKey]: event.target.value,
    }));
  };

  const handleConfirm = () => {
    // Validate input fields
    const newError = {
      question1: !selectedQuestions.question1,
      question2: !selectedQuestions.question2,
      question3: !selectedQuestions.question3,
      answer1: !answers.answer1,
      answer2: !answers.answer2,
      answer3: !answers.answer3,
    };

    setError(newError);

    // If no errors, proceed
    if (!Object.values(newError).some((value) => value)) {
      alert(`Questions and Answers:
      1. ${selectedQuestions.question1}: ${answers.answer1}
      2. ${selectedQuestions.question2}: ${answers.answer2}
      3. ${selectedQuestions.question3}: ${answers.answer3}`);
      navigate("/change-password"); // Navigate to password reset page
    }
  };

  const handleCancel = () => {
    setSelectedQuestions({
      question1: "",
      question2: "",
      question3: "",
    });
    setAnswers({
      answer1: "",
      answer2: "",
      answer3: "",
    });
    setError({
      question1: false,
      question2: false,
      question3: false,
      answer1: false,
      answer2: false,
      answer3: false,
    });
  };

  const getAvailableQuestions = (selectedKey) => {
    return questions.filter(
      (q) =>
        !Object.values(selectedQuestions).includes(q) ||
        selectedQuestions[selectedKey] === q
    );
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        marginTop: 5,
        backgroundColor: colors.primary[400],
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ textAlign: "center", marginBottom: 4 }}>
        <h2>Forgot Password</h2>
        <p>Answer the following security questions to proceed.</p>
      </Box>

      <Grid container spacing={2}>
        {["question1", "question2", "question3"].map((questionKey, index) => (
          <Grid item xs={12} key={questionKey}>
            <FormControl
              fullWidth
              margin="normal"
              error={error[questionKey]}
            >
              <InputLabel>Question {index + 1}</InputLabel>
              <Select
                value={selectedQuestions[questionKey]}
                onChange={(e) => handleQuestionChange(e, questionKey)}
              >
                {getAvailableQuestions(questionKey).map((q, i) => (
                  <MenuItem value={q} key={i}>
                    {q}
                  </MenuItem>
                ))}
              </Select>
              {error[questionKey] && (
                <FormHelperText>
                  Question {index + 1} is required
                </FormHelperText>
              )}
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              label={`Answer ${index + 1}`}
              value={answers[`answer${index + 1}`]}
              onChange={(e) => handleAnswerChange(e, `answer${index + 1}`)}
              error={error[`answer${index + 1}`]}
              helperText={
                error[`answer${index + 1}`] ? "Answer is required" : ""
              }
            />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: 3 }}>
        <Grid item xs={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
            sx={{ width: "100%" }}
          >
            Confirm
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: "100%" }}
          >
            Cancel
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ForgotPassword;
