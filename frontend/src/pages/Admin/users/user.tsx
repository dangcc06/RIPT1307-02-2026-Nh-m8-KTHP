import React from "react";
<<<<<<< HEAD
import { Modal, notification } from "antd";
import type { AdminUser } from "../../../services/adminService";


=======
import { Modal } from "antd";
import { Eye, Lock, Unlock } from "lucide-react";
import type { AdminUser } from "../../../services/adminService";

>>>>>>> origin/TuanAnh
type UserModalData = {
  selectedUser: AdminUser | null;
  isUserModalVisible: boolean;
  setIsUserModalVisible: (visible: boolean) => void;
};

type UsersSectionProps = {
  users: AdminUser[];
  userFilters: { role: string; search: string };
  onUserFilterChange: (updates: Partial<{ role: string; search: string }>) => Promise<void> | void;
<<<<<<< HEAD
  onUserRoleChange: (userId: number, newRole: string) => Promise<void> | void;
  onUserStatusChange: (userId: number, status: "ACTIVE" | "BLOCKED") => Promise<void> | void;
  onViewUserDetail: (userId: number) => Promise<void> | void;
  onDeleteUser: (userId: number) => Promise<void> | void;
} & UserModalData;

=======
  onUserRoleChange?: (userId: number, newRole: string) => Promise<void> | void;
  onUserStatusChange: (userId: number, status: "ACTIVE" | "BLOCKED") => Promise<void> | void;
  onViewUserDetail: (userId: number) => Promise<void> | void;
  onDeleteUser?: (userId: number) => Promise<void> | void;
} & UserModalData;

const getStatus = (user?: AdminUser | null) => user?.is_active || user?.status || "ACTIVE";

>>>>>>> origin/TuanAnh
const UsersSection: React.FC<UsersSectionProps> = ({
  users,
  userFilters,
  onUserFilterChange,
<<<<<<< HEAD
  onUserRoleChange,
  onUserStatusChange,
  onViewUserDetail,
  onDeleteUser,
=======
  onUserStatusChange,
  onViewUserDetail,
>>>>>>> origin/TuanAnh
  selectedUser,
  isUserModalVisible,
  setIsUserModalVisible,
}) => {
  return (
    <div className="admin-users-section">
<<<<<<< HEAD
      <div className="data-card">
        <div className="section-header">
          <h2>Quản lý người dùng</h2>

          <div className="filters-group">
            <input
              type="text"
              placeholder="Tìm tên, email..."
              value={userFilters.search}
              onChange={(e) => onUserFilterChange({ search: e.target.value })}
              className="admin-filter-input"
            />

            <select
              value={userFilters.role}
              onChange={(e) => onUserFilterChange({ role: e.target.value })}
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
                        onChange={(e) => onUserRoleChange(user.id, e.target.value)}
                        className="role-select"
                        disabled={user.is_active === "BLOCKED"}
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td>
<button
  className={`admin-status-pill ${
    user.is_active === "ACTIVE"
      ? "status-active"
      : "status-locked"
  }`}
  onClick={() =>
    onUserStatusChange(
      user.id,
      user.is_active === "ACTIVE"
        ? "BLOCKED"
        : "ACTIVE"
    )
  }
>
  {user.is_active === "ACTIVE"
    ? "Hoạt động"
    : "Bị khóa"}
</button>
                    </td>

                    <td>
                      <div className="user-actions">
                        <button
                          className="secondary-btn compact"
                          onClick={() => onViewUserDetail(user.id)}
                        >
                          Chi tiết
                        </button>

                        {user.roles !== "ADMIN" && user.is_active === "BLOCKED" && (
                          <button
                            className="secondary-btn compact danger-btn"
                            onClick={async () => {
                              if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
                                try {
                                  await onDeleteUser(user.id);
                                } catch (e: any) {
                                  notification.error({
                                    message: "Lỗi khi xóa",
                                    description:
                                      e?.response?.data?.message || "Không thể xóa tài khoản.",
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
=======
      <div className="data-card users-admin-card">
        <div className="section-header users-section-header">
          <div>
            <h2>Quản lý người dùng</h2>
            <p className="muted">Theo dõi tài khoản, trạng thái và thông tin liên hệ.</p>
          </div>

          <input
            type="text"
            placeholder="Tìm tên, email, số điện thoại..."
            value={userFilters.search}
            onChange={(e) => onUserFilterChange({ search: e.target.value })}
            className="admin-filter-input users-search-input"
          />
        </div>

        <div className="users-grid users-grid-head">
          <span>ID</span>
          <span>Người dùng</span>
          <span>Email</span>
          <span>Số điện thoại</span>
          <span>Vai trò</span>
          <span>Trạng thái</span>
          <span>Hành động</span>
        </div>

        <div className="users-grid-list">
          {users.length > 0 ? (
            users.map((user) => {
              const status = getStatus(user);
              const isLocked = status === "BLOCKED";

              return (
                <div className="users-grid users-grid-row" key={user.id}>
                  <span className="user-id-cell">#{user.id}</span>

                  <strong className="user-name-cell" title={user.full_name}>
                    {user.full_name}
                  </strong>

                  <span className="user-email-cell" title={user.email}>
                    {user.email}
                  </span>

                  <span>{user.phone || "-"}</span>

                  <span className="user-role-pill">{user.roles || "CUSTOMER"}</span>

                  <button
                    type="button"
                    className={`admin-status-pill ${isLocked ? "status-locked" : "status-active"}`}
                    onClick={() => onUserStatusChange(user.id, isLocked ? "ACTIVE" : "BLOCKED")}
                  >
                    {isLocked ? "Bị khóa" : "Hoạt động"}
                  </button>

                  <div className="user-actions">
                    <button
                      className="secondary-btn compact"
                      type="button"
                      onClick={() => onViewUserDetail(user.id)}
                      title="Xem chi tiết"
                    >
                      <Eye size={16} />
                      Chi tiết
                    </button>

                    <button
                      className={`secondary-btn compact ${isLocked ? "" : "danger-btn"}`}
                      type="button"
                      onClick={() => onUserStatusChange(user.id, isLocked ? "ACTIVE" : "BLOCKED")}
                      title={isLocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
                    >
                      {isLocked ? <Unlock size={16} /> : <Lock size={16} />}
                      {isLocked ? "Mở khóa" : "Khóa"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="users-empty-state">Không tìm thấy người dùng nào.</div>
          )}
>>>>>>> origin/TuanAnh
        </div>
      </div>

      <Modal
        title="Chi tiết người dùng"
        open={isUserModalVisible}
        onCancel={() => setIsUserModalVisible(false)}
        footer={null}
      >
<<<<<<< HEAD
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
                color:
                  selectedUser?.is_active === "ACTIVE" ? "#52c41a" : "#ff4d4f",
                fontWeight: "bold",
              }}
            >
              {selectedUser?.is_active === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
=======
        <div className="user-detail-modal">
          <div>
            <strong>Họ tên</strong>
            <span>{selectedUser?.full_name}</span>
          </div>

          <div>
            <strong>Email</strong>
            <span>{selectedUser?.email}</span>
          </div>

          <div>
            <strong>Số điện thoại</strong>
            <span>{selectedUser?.phone || "-"}</span>
          </div>

          <div>
            <strong>Vai trò</strong>
            <span>{selectedUser?.roles || "CUSTOMER"}</span>
          </div>

          <div>
            <strong>Trạng thái</strong>
            <span className={getStatus(selectedUser) === "ACTIVE" ? "status-text-active" : "status-text-locked"}>
              {getStatus(selectedUser) === "ACTIVE" ? "Hoạt động" : "Bị khóa"}
>>>>>>> origin/TuanAnh
            </span>
          </div>
        </div>
      </Modal>
    </div>
  );
};

<<<<<<< HEAD

export default UsersSection;

=======
export default UsersSection;
>>>>>>> origin/TuanAnh
