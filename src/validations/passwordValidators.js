const validatePasswordFields = ({ currentPassword, newPassword, confirmPassword }) => {
  const fields = [currentPassword, newPassword, confirmPassword];

  // Check if any field is empty or undefined
  if (fields.some(field => !field?.trim())) {
    throw new Error('All fields are required.');
  }

  // Check if newPassword and confirmPassword match
  if (newPassword !== confirmPassword) {
    throw new Error('New password and confirm password must match.');
  }
};

module.exports = { validatePasswordFields }