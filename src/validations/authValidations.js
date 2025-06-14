const ApiError = require('../utilis/ApiError'); // adjust path as needed

const validateFirstName = (firstName) => {
  if (firstName.length < 4 || firstName.length > 20) {
    throw new ApiError(400, "First Name must be between 4 to 20 characters");
  }
  if (!/^[A-Za-z]+$/.test(firstName)) {  // Only letters allowed
    throw new ApiError(400, "First Name must contain only letters");
  }
};

const validateLastName = (lastName) => {
  if (lastName.length < 4 || lastName.length > 20) {
    throw new ApiError(400, "Last Name must be between 4 to 20 characters");
  }
  if (!/^[A-Za-z]+$/.test(lastName)) {  // Allow letters and numbers
    throw new ApiError(400, "Last Name must contain only letters and numbers");
  }
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new ApiError(400, "Invalid email format");
  }
};

const validatePassword = (password) => {
  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters long");
  }
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    throw new ApiError(400, "Password must contain at least one letter and one number");
  }
};

const validateRequiredFields = (fields) => {
  if (fields.some(field => !field?.trim())) {
    throw new ApiError(400, "All fields are required and must not be empty");
  }
};

module.exports = {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePassword,
  validateRequiredFields
};
