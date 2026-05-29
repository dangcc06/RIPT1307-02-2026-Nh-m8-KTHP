import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clapperboard,
  CreditCard,
  Edit3,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  XCircle,
} from "lucide-react";
import { Modal, notification } from "antd";

import OverviewSection from "./overview/overview";
import MoviesSection from "./movies/movies";

import {
  createAdminMovie,
  createAdminShowtime,
  deleteAdminMovie,
  deleteAdminShowtime,
  getAdminBookings,
  getAdminUserDetail,
  getAdminUsers,
  getDashboardStats,
  updateAdminBookingStatus,
  updateAdminMovie,
  updateAdminShowtime,
  updateAdminUserRole,
  updateAdminUserStatus,
  deleteAdminUser,
} from "../../services/adminService";
import type { AdminBooking, AdminUser } from "../../services/adminService";
import { getMovies } from "../../services/movieService";
import { getShowtimes } from "../../services/showtimeService";
import type { ApiMovie, ApiShowtime } from "../../types/api";
import { formatCurrency, formatDateTime } from "../../utils/format";

type AdminTab = "overview" | "movies" | "showtimes" | "bookings" | "users";

const Visible = Modal;

const emptyMovieForm = {
  id: "",
  title: "",
  description: "",
  duration: "",
  release_date: "",
  poster_url: "",
  trailer_url: "",
  language: "Vietnamese",
  rating: "8.0",
  status: "NOW_SHOWING",
};

const emptyShowtimeForm = {
  id: "",
  movie_id: "",
  room_id: "",
  start_time: "",
  end_time: "",
  status: "OPEN",
};

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [stats, setStats] = useState<any>(null);
  const [movies, setMovies] = useState<ApiMovie[]>([]);
  const [showtimes, setShowtimes] = useState<ApiShowtime[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userFilters, setUserFilters] = useState({ role: "", search: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [movieForm, setMovieForm] = useState(emptyMovieForm);
  const [showtimeForm, setShowtimeForm] = useState(emptyShowtimeForm);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isUserModalVisible, setIsUserModalVisible] = useState(false);

  const loadAdminData = async () => {
    setIsLoading(true);
    try {
      const [statsData, movieData, showtimeData, bookingData, userData] =
        await Promise.all([
          getDashboardStats(),
          getMovies({ page: 1, limit: 50 }),
          getShowtimes(),
          getAdminBookings(),
          getAdminUsers(),
        ]);

      setStats(statsData);
      setMovies(movieData.items);
      setShowtimes(showtimeData);
      setBookings(bookingData);
      setUsers(userData);
      setMessage("");
    } catch (error: any) {
      setMessage(
        error.response?.data?.message ||
          "Không tải được dữ liệu quản trị. Vui lòng đăng nhập bằng tài khoản ADMIN."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const maxMonthlyRevenue = useMemo(() => {
    const values =
      stats?.monthly_revenue?.map((item: any) => Number(item.revenue)) || [0];
    return Math.max(...values, 1);
  }, [stats]);

  const handleSubmitMovie = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        title: movieForm.title,
        description: movieForm.description,
        duration: Number(movieForm.duration),
        release_date: movieForm.release_date,
        poster_url: movieForm.poster_url,
        trailer_url: movieForm.trailer_url,
        language: movieForm.language,
        rating: Number(movieForm.rating),
        status: movieForm.status as ApiMovie["status"],
      };

      if (movieForm.id) {
        await updateAdminMovie(Number(movieForm.id), payload);
        setMessage("Đã cập nhật phim.");
      } else {
        await createAdminMovie(payload);
        setMessage("Đã thêm phim mới.");
      }

      setMovieForm(emptyMovieForm);
      await loadAdminData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Không lưu được phim.");
    }
  };

  const handleSubmitShowtime = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const payload = {
        movie_id: Number(showtimeForm.movie_id),
        room_id: Number(showtimeForm.room_id),
        start_time: showtimeForm.start_time,
        end_time: showtimeForm.end_time,
        status: showtimeForm.status,
      };

      if (showtimeForm.id) {
        await updateAdminShowtime(Number(showtimeForm.id), payload);
        setMessage("Đã cập nhật suất chiếu.");
      } else {
        await createAdminShowtime(payload);
        setMessage("Đã thêm suất chiếu mới.");
      }

      setShowtimeForm(emptyShowtimeForm);
      await loadAdminData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Không lưu được suất chiếu.");
    }
  };

  const handleBookingStatus = async (
    bookingId: number,
    status: AdminBooking["booking_status"]
  ) => {
    try {
      await updateAdminBookingStatus(bookingId, status);
      setMessage(
        status === "CONFIRMED" ? "Đã xác nhận đơn hàng." : "Đã cập nhật trạng thái đơn hàng."
      );
      await loadAdminData();
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Không cập nhật được đơn hàng.");
    }
  };

  const editMovie = (movie: ApiMovie) => {
    setMovieForm({
      id: String(movie.id),
      title: movie.title,
      description: movie.description || "",
      duration: String(movie.duration || ""),
      release_date: movie.release_date?.slice(0, 10) || "",
      poster_url: movie.poster_url || "",
      trailer_url: movie.trailer_url || "",
      language: movie.language || "Vietnamese",
      rating: String(movie.rating || "8.0"),
      status: movie.status,
    });
    setActiveTab("movies");
  };

  const editShowtime = (showtime: ApiShowtime) => {
    setShowtimeForm({
      id: String(showtime.id),
      movie_id: String(showtime.movie_id),
      room_id: String(showtime.room_id),
      start_time: showtime.start_time.slice(0, 16),
      end_time: showtime.end_time.slice(0, 16),
      status: showtime.status,
    });
    setActiveTab("showtimes");
  };

  const handleUserFilterChange = async (updates: Partial<typeof userFilters>) => {
    const newFilters = { ...userFilters, ...updates };
    setUserFilters(newFilters);

    try {
      const data = await getAdminUsers(newFilters);
      setUsers(data);
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Không lọc được người dùng.");
    }
  };

  const handleUserRoleChange = async (userId: number, newRole: string) => {
    const user = users.find((u) => u.id === userId);

    if (user?.is_active === "BLOCKED") {
      notification.warning({
        message: "Hành động bị chặn",
        description: "Không thể thay đổi vai trò của tài khoản đang bị khóa.",
      });
      return;
    }

    try {
      await updateAdminUserRole(userId, newRole);

      notification.success({
        message: "Cập nhật vai trò",
        description: `Đã thay đổi vai trò người dùng thành ${newRole}.`,
      });

      await loadAdminData();
    } catch (error: any) {
      notification.error({
        message: "Lỗi cập nhật",
        description: error.response?.data?.message || "Không đổi được vai trò.",
      });
    }
  };

  const handleUserStatusChange = async (
    userId: number,
    status: "ACTIVE" | "BLOCKED"
  ) => {
    try {
      await updateAdminUserStatus(userId, status);

      notification.success({
        message: "Cập nhật trạng thái",
        description: status === "ACTIVE" ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.",
      });

      await loadAdminData();
    } catch (error: any) {
      notification.error({
        message: "Lỗi cập nhật",
        description: error.response?.data?.message || "Không cập nhật trạng thái được.",
      });
    }
  };

  const handleViewUserDetail = async (userId: number) => {
    try {
      const user = await getAdminUserDetail(userId);
      setSelectedUser(user);
      setIsUserModalVisible(true);
    } catch (error: any) {
      notification.error({
        message: "Lỗi",
        description: error.response?.data?.message || "Không lấy được chi tiết người dùng.",
      });
    }
  };

  return (
    <section className="app-page admin-page">
      <style>{`
        .table-responsive {
          width: 100%;
          overflow-x: auto;
          border-radius: 14px;
        }

        .admin-table {
          width: 100%;
          min-width: 1450px;
          border-collapse: collapse;
          table-layout: fixed;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.02);
        }

        .admin-table th,
        .admin-table td {
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 18px 16px;
          box-sizing: border-box;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .admin-table th {
          font-size: 18px;
          font-weight: 700;
          text-align: left;
          background: rgba(255, 255, 255, 0.04);
        }

        .admin-table td {
          font-size: 16px;
          text-align: left;
        }

        .admin-table tbody tr:nth-child(even) {
          background: rgba(255, 255, 255, 0.02);
        }

        .admin-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.04);
          transition: 0.2s ease;
        }

        .users-table th:nth-child(1),
        .users-table td:nth-child(1),
        .users-table th:nth-child(6),
        .users-table td:nth-child(6),
        .users-table th:nth-child(7),
        .users-table td:nth-child(7) {
          text-align: center;
        }

        .role-select {
          width: 100%;
          min-width: 0;
          background: #111;
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 10px;
          padding: 12px;
          font-weight: 600;
          outline: none;
        }

        .role-select:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status-toggle-btn {
          padding: 8px 14px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          font-weight: 700;
          color: white;
          min-width: 110px;
        }

        .status-toggle-btn.active {
          background: #52c41a;
        }

        .status-toggle-btn.blocked {
          background: #ff4d4f;
        }

        .user-actions {
          display: flex;
          justify-content: center;
          gap: 10px;
          align-items: center;
          flex-wrap: nowrap;
        }

        .danger-btn {
          border-color: red !important;
          color: red !important;
        }

        .text-center {
          text-align: center !important;
        }
      `}</style>

      <div className="container">
        <div className="admin-hero">
          <div>
            <p className="eyebrow">Admin Console</p>
            <h1>Quản trị ứng dụng xem phim</h1>
            <p className="muted">Theo dõi doanh thu, đơn hàng, phim, suất chiếu và dữ liệu người dùng.</p>
          </div>

          <button
            className="secondary-btn compact admin-refresh"
            onClick={loadAdminData}
            disabled={isLoading}
          >
            <RefreshCw size={18} />
            Tải lại
          </button>
        </div>

        {message && <p className="section-state warning">{message}</p>}

        <div className="admin-tabs">
          <button
            className={activeTab === "overview" ? "active" : ""}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 size={18} /> Tổng quan
          </button>

          <button className={activeTab === "movies" ? "active" : ""} onClick={() => setActiveTab("movies")}
          >
            <Clapperboard size={18} /> Phim
          </button>

          <button
            className={activeTab === "showtimes" ? "active" : ""}
            onClick={() => setActiveTab("showtimes")}
          >
            <CalendarClock size={18} /> Suất chiếu
          </button>

          <button
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            <CreditCard size={18} /> Đơn hàng
          </button>

          <button className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}
          >
            <Users size={18} /> Người dùng
          </button>
        </div>

        {activeTab === "overview" && (
          <OverviewSection stats={stats} maxMonthlyRevenue={maxMonthlyRevenue} />
        )}

        {activeTab === "movies" && (
          <MoviesSection
            movies={movies}
            movieForm={movieForm}
            setMovieForm={setMovieForm}
            handleSubmitMovie={handleSubmitMovie}
            editMovie={editMovie}
            deleteMovie={async (movieId) => {
              await deleteAdminMovie(movieId);
              await loadAdminData();
            }}
          />
        )}

        {activeTab === "showtimes" && (
          <div className="admin-workspace">
            <form className="form-panel admin-form" onSubmit={handleSubmitShowtime}>
              <h2>{showtimeForm.id ? "Sửa suất chiếu" : "Thêm suất chiếu"}</h2>

              <select
                required
                value={showtimeForm.movie_id}
                onChange={(e) =>
                  setShowtimeForm({ ...showtimeForm, movie_id: e.target.value })
                }
              >
                <option value="">Chọn phim</option>
                {movies.map((movie) => (
                  <option value={movie.id} key={movie.id}>
                    {movie.title}
                  </option>
                ))}
              </select>

              <input
                required
                type="number"
                min="1"
                placeholder="Room ID"
                value={showtimeForm.room_id}
                onChange={(e) =>
                  setShowtimeForm({ ...showtimeForm, room_id: e.target.value })
                }
              />

              <input
                required
                type="datetime-local"
                value={showtimeForm.start_time}
                onChange={(e) =>
                  setShowtimeForm({ ...showtimeForm, start_time: e.target.value })
                }
              />

              <input
                required
                type="datetime-local"
                value={showtimeForm.end_time}
                onChange={(e) =>
                  setShowtimeForm({ ...showtimeForm, end_time: e.target.value })
                }
              />

              <select
                value={showtimeForm.status}
                onChange={(e) =>
                  setShowtimeForm({ ...showtimeForm, status: e.target.value })
                }
              >
                <option value="OPEN">Mở bán</option>
                <option value="FULL">Đã đầy</option>
                <option value="CANCELLED">Đã hủy</option>
              </select>

              <button className="primary-btn form-submit">
                <Plus size={18} />
                Lưu suất chiếu
              </button>
            </form>

            <div className="data-card admin-table-card">
              <h2>Danh sách suất chiếu</h2>

              <div className="admin-table">
                {showtimes.map((showtime) => (
                  <div className="admin-table-row showtime-admin-row" key={showtime.id}>
                    <strong>{showtime.movie_title}</strong>
                    <span>
                      {showtime.cinema_name} - {showtime.room_name}
                    </span>
                    <span>{formatDateTime(showtime.start_time)}</span>
                    <span>{showtime.status}</span>

                    <button title="Sửa suất chiếu" onClick={() => editShowtime(showtime)}>
                      <Edit3 size={16} />
                    </button>

                    <button
                      title="Xóa suất chiếu"
                      onClick={async () => {
                        await deleteAdminShowtime(showtime.id);
                        await loadAdminData();
                      }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="data-card admin-table-card">
            <h2>Xác nhận đơn hàng</h2>

            <div className="admin-table">
              {bookings.map((booking) => (
                <div className="admin-table-row booking-admin-row" key={booking.id}>
                  <strong>{booking.booking_code}</strong>
                  <span>
                    {booking.customer_name || booking.customer_email || "Khách hàng"}
                  </span>
                  <span>{booking.movie_title}</span>
                  <span>{formatDateTime(booking.start_time)}</span>
                  <span>{formatCurrency(booking.total_amount)}</span>

                  <span
                    className={`admin-status-pill ${booking.booking_status.toLowerCase()}`}
                  >
                    {booking.booking_status}
                  </span>

                  <button
                    title="Xác nhận đơn"
                    disabled={booking.booking_status === "CONFIRMED"}
                    onClick={() => handleBookingStatus(booking.id, "CONFIRMED")}
                  >
                    <CheckCircle2 size={16} />
                  </button>

                  <button
                    title="Hủy đơn"
                    disabled={booking.booking_status === "CANCELLED"}
                    onClick={() => handleBookingStatus(booking.id, "CANCELLED")}
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="admin-users-section">
            <div className="data-card">
              <div className="section-header">
                <h2>Quản lý người dùng</h2>

                <div className="filters-group">
                  <input
                    type="text"
                    placeholder="Tìm tên, email..."
                    value={userFilters.search}
                    onChange={(e) =>
                      handleUserFilterChange({ search: e.target.value })
                    }
                    className="admin-filter-input"
                  />

                  <select
                    value={userFilters.role}
                    onChange={(e) => handleUserFilterChange({ role: e.target.value })}
                    className="admin-filter-select"
                  >
                    <option value="">Tất cả vai trò</option>
                    <option value="CUSTOMER">Customer</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>

              <div className="table-responsive">
                <table className="admin-table users-table">
                  <colgroup>
                    <col style={{ width: "70px" }} />
                    <col style={{ width: "220px" }} />
                    <col style={{ width: "300px" }} />
                    <col style={{ width: "190px" }} />
                    <col style={{ width: "200px" }} />
                    <col style={{ width: "170px" }} />
                    <col style={{ width: "260px" }} />
                  </colgroup>

                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Số điện thoại</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>

                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td title={user.full_name}>{user.full_name}</td>
                          <td title={user.email}>{user.email}</td>
                          <td title={user.phone || ""}>{user.phone || "-"}</td>

                          <td>
                            <select
                              value={user.roles}
                              onChange={(e) => handleUserRoleChange(user.id, e.target.value)}
                              className="role-select"
                              disabled={user.is_active === "BLOCKED"}
                            >
                              <option value="CUSTOMER">CUSTOMER</option>
                              <option value="ADMIN">ADMIN</option>
                            </select>
                          </td>

                          <td>
                            <button
                              className={`status-toggle-btn ${user.is_active === "ACTIVE" ? "active" : "blocked"}`}
                              onClick={() =>
                                handleUserStatusChange(
                                  user.id,
                                  user.is_active === "ACTIVE" ? "BLOCKED" : "ACTIVE"
                                )
                              }
                            >
                              {user.is_active === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
                            </button>
                          </td>

                          <td>
                            <div className="user-actions">
                              <button
                                className="secondary-btn compact"
                                onClick={() => handleViewUserDetail(user.id)}
                              >
                                Chi tiết
                              </button>

                              {user.roles !== "ADMIN" && user.is_active === "BLOCKED" && (
                                <button
                                  className="secondary-btn compact danger-btn"
                                  onClick={async () => {
                                    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
                                      try {
                                        await deleteAdminUser(user.id);
                                        notification.success({ message: "Xóa tài khoản thành công" });
                                        await loadAdminData();
                                      } catch (e: any) {
                                        notification.error({
                                          message: "Lỗi khi xóa",
                                          description: e.response?.data?.message || "Không thể xóa tài khoản.",
                                        });
                                      }
                                    }
                                  }}
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="text-center">
                          Không tìm thấy người dùng nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      <Visible
        title="Chi tiết người dùng"
        visible={isUserModalVisible}
        onCancel={() => {
          setIsUserModalVisible(false);
          setSelectedUser(null);
        }}
        footer={null}
      >
        <div style={{ display: "grid", gap: "12px", padding: "10px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Họ tên:</strong>
            <span>{selectedUser?.full_name}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Email:</strong>
            <span>{selectedUser?.email}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Số điện thoại:</strong>
            <span>{selectedUser?.phone || "-"}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Vai trò:</strong>
            <span>{selectedUser?.roles}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>Trạng thái:</strong>
            <span
              style={{
                color: selectedUser?.is_active === "ACTIVE" ? "#52c41a" : "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              {selectedUser?.is_active === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
            </span>
          </div>
        </div>
      </Visible>
    </section>
  );
};

export default AdminPage;

