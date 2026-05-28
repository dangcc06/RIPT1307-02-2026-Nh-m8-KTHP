const adminService = require("../services/adminService");
const { successResponse } = require("../utils/apiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getDashboardStatistics = asyncHandler(async (req, res) => {
  const stats = await adminService.getDashboardStatistics();
  return successResponse(res, "Get dashboard statistics successfully", stats);
});

const getAdminBookings = asyncHandler(async (req, res) => {
  const bookings = await adminService.getAdminBookings();
  return successResponse(res, "Get admin bookings successfully", bookings);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  const booking = await adminService.updateBookingStatus(req.params.id, req.body.status);
  return successResponse(res, "Update booking status successfully", booking);
});

const getUsers = asyncHandler(async (req, res) => {
  const { role, search } = req.query;
  const users = await adminService.getUsers({ role, search });
  return successResponse(res, "Get users successfully", users);
});

const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const result = await adminService.updateUserRole(req.params.id, role);
  return successResponse(res, "Update user role successfully", result);
});

const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const result = await adminService.updateUserStatus(req.params.id, status);
  return successResponse(res, "Update user status successfully", result);
});

const deleteUser = asyncHandler(async (req, res) => {
  const result = await adminService.deleteUser(req.params.id);
  return successResponse(res, "Delete user successfully", result);
});

const getUserDetail = asyncHandler(async (req, res) => {
  const user = await adminService.getUserDetail(req.params.id);
  if (!user) {
    const AppError = require("../utils/AppError");
    throw new AppError("User not found", 404);
  }
  return successResponse(res, "Get user detail successfully", user);
});

module.exports = {
  getDashboardStatistics,
  getAdminBookings,
  updateBookingStatus,
  getUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserDetail,
};
