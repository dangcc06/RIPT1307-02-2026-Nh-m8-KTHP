import type { ApiMovie, ApiResponse } from "../types/api";
import apiClient from "./apiClient";

export type AdminBooking = {
  id: number;
  booking_code: string;
  total_amount: string | number;
  booking_status: "PENDING" | "CONFIRMED" | "CANCELLED";
  showtime_id: number;
  start_time: string;
  movie_title: string;
  customer_name: string | null;
  customer_email: string | null;
  payment_method: string;
  payment_status: "PENDING" | "SUCCESS" | "FAILED";
};

export const getDashboardStats = async () => {
  const response = await apiClient.get<ApiResponse<any>>("/admin/dashboard");
  return response.data.data;
};

export const getAdminBookings = async () => {
  const response = await apiClient.get<ApiResponse<AdminBooking[]>>("/admin/bookings");
  return response.data.data;
};

export const updateAdminBookingStatus = async (
  id: number,
  status: AdminBooking["booking_status"]
) => {
  const response = await apiClient.patch<ApiResponse<AdminBooking>>(`/admin/bookings/${id}/status`, {
    status,
  });
  return response.data.data;
};

export const createAdminMovie = async (payload: Partial<ApiMovie>) => {
  const response = await apiClient.post<ApiResponse<ApiMovie>>("/admin/movies", payload);
  return response.data.data;
};

export const updateAdminMovie = async (id: number, payload: Partial<ApiMovie>) => {
  const response = await apiClient.put<ApiResponse<ApiMovie>>(`/admin/movies/${id}`, payload);
  return response.data.data;
};

export const deleteAdminMovie = async (id: number) => {
  const response = await apiClient.delete<ApiResponse<{}>>(`/admin/movies/${id}`);
  return response.data;
};

export const createAdminShowtime = async (payload: any) => {
  const response = await apiClient.post<ApiResponse<any>>("/admin/showtimes", payload);
  return response.data.data;
};

export const updateAdminShowtime = async (id: number, payload: any) => {
  const response = await apiClient.put<ApiResponse<any>>(`/admin/showtimes/${id}`, payload);
  return response.data.data;
};

export const deleteAdminShowtime = async (id: number) => {
  const response = await apiClient.delete<ApiResponse<{}>>(`/admin/showtimes/${id}`);
  return response.data;
};

export type AdminUser = {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active?: "ACTIVE" | "BLOCKED";
  status?: "ACTIVE" | "BLOCKED";
  roles: string;
};

export const getAdminUsers = async (params?: { role?: string; search?: string }) => {
  const response = await apiClient.get<ApiResponse<AdminUser[]>>("/admin/users", { params });
  return response.data.data;
};

export const updateAdminUserRole = async (id: number, role: string) => {
  const response = await apiClient.patch<ApiResponse<{ userId: number; newRole: string }>>(
    `/admin/users/${id}/role`,
    {
      role,
    }
  );
  return response.data.data;
};

export const updateAdminUserStatus = async (id: number, status: "ACTIVE" | "BLOCKED") => {
  const response = await apiClient.patch<ApiResponse<{ id: number; status: string }>>(
    `/admin/users/${id}/status`,
    {
      status,
    }
  );
  return response.data.data;
};

export const deleteAdminUser = async (id: number) => {
  const response = await apiClient.delete<ApiResponse<{ userId: number; deleted: boolean }>>(
    `/admin/users/${id}`
  );
  return response.data.data;
};

export const getAdminUserDetail = async (id: number) => {
  const response = await apiClient.get<ApiResponse<AdminUser>>( `/admin/users/${id}`);
  return response.data.data;
};
