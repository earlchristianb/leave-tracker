/** @format */

export const ToastType = Object.freeze({
  SUCCESS: "Success",
  ERROR: "Error",
  WARNING: "Warning",
  INFO: "Info",
});

export const ToastDuration = 5000;

export const ToastMessages = Object.freeze({
  TEAM: {
    SUCCESS_CREATE: "Team created successfully.",
    SUCCESS_JOIN: "Team joined successfully.",
    SUCCESS_LEAVE: "Team left successfully.",
    SUCCESS_UPDATE: "Team updated successfully.",
    SUCCESS_DELETE: "Team deleted successfully.",
    ERROR_CREATE: "Error creating team.",
    ERROR_JOIN: "Error joining team.",
    ERROR_LEAVE: "Error leaving team.",
  },
  USER: {
    SUCCESS_CREATE: "User profile created successfully.",
    SUCCESS_UPDATE: "User profile updated successfully.",
    SUCCESS_DELETE: "User profile deleted successfully.",
    ERROR_CREATE: "Error creating user profile.",
    ERROR_UPDATE: "Error updating user profile.",
    ERROR_DELETE: "Error deleting user profile.",
  },
  ORGANIZATION: {
    SUCCESS_CREATE: "Organization created successfully.",
    SUCCESS_UPDATE: "Organization updated successfully.",
    SUCCESS_DELETE: "Organization deleted successfully.",
    SUCCESS_JOIN: "Joined the organization successfully.",
    SUCCESS_LEAVE: "Left the organization successfully.",
    ERROR_CREATE: "Error creating organization.",
    ERROR_UPDATE: "Error updating organization.",
    ERROR_DELETE: "Error deleting organization.",
  },
  ORGLEAVETYPE: {
    SUCCESS_CREATE: "Leave type created successfully.",
    SUCCESS_UPDATE: "Leave type updated successfully.",
    SUCCESS_DELETE: "Leave type deleted successfully.",
    ERROR_CREATE: "Error creating Leave type.",
    ERROR_UPDATE: "Error updating Leave type.",
    ERROR_DELETE: "Error deleting Leave type.",
  },
  LEAVE: {
    SUCCESS_CREATE: "Leave created successfully.",
    SUCCESS_UPDATE: "Leave updated successfully.",
    SUCCESS_DELETE: "Leave deleted successfully.",
    ERROR_CREATE: "Error creating leave.",
    ERROR_UPDATE: "Error updating leave.",
    ERROR_DELETE: "Error deleting leave.",
  },
  ERROR_DEFAULT: "Something went wrong.",
  SUCCESS_DEFAULT: "Success.",
});