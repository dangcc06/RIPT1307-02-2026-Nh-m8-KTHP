import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { AdminBooking } from "../../../services/adminService";
import { formatCurrency, formatDateTime } from "../../../utils/format";

type BookingsSectionProps = {
  bookings: AdminBooking[];
  handleBookingStatus: (
    bookingId: number,
    status: AdminBooking["booking_status"]
  ) => Promise<void> | void;
};

const cellStyle: React.CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const BookingsSection: React.FC<BookingsSectionProps> = ({
  bookings,
  handleBookingStatus,
}) => {
  return (
    <div
      className="admin-table-card"
      style={{
        width: "100%",
        maxWidth: "100%",
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      <h2>Xác nhận đơn hàng</h2>

      <div
        className="admin-table"
        style={{
          width: "100%",
          maxWidth: "100%",
          overflowX: "auto",
          boxSizing: "border-box",
        }}
      >
        {bookings.map((booking) => (
          <div
            className="admin-table-row booking-admin-row"
            key={booking.id}
            style={{
              width: "100%",
              minWidth: "760px",
              boxSizing: "border-box",
              display: "grid",
              alignItems: "center",
              gap: "12px",
              gridTemplateColumns:
                "0.8fr 1.2fr 1.6fr 1.2fr 1fr 1fr 40px 40px",
            }}
          >
            <strong style={cellStyle}>{booking.booking_code}</strong>

            <span style={cellStyle}>
              {booking.customer_name || booking.customer_email || "Khách hàng"}
            </span>

            <span style={cellStyle}>{booking.movie_title}</span>

            <span style={cellStyle}>{formatDateTime(booking.start_time)}</span>

            <span style={cellStyle}>
              {formatCurrency(booking.total_amount)}
            </span>

            <span
              className={`admin-status-pill ${booking.booking_status.toLowerCase()}`}
              style={{
                ...cellStyle,
                justifySelf: "start",
                maxWidth: "100%",
              }}
            >
              {booking.booking_status}
            </span>

            <button
              title="Xác nhận đơn"
              disabled={booking.booking_status === "CONFIRMED"}
              onClick={() => handleBookingStatus(booking.id, "CONFIRMED")}
              style={{
                width: "36px",
                height: "36px",
                minWidth: "36px",
                justifySelf: "center",
              }}
            >
              <CheckCircle2 size={16} />
            </button>

            <button
              title="Hủy đơn"
              disabled={booking.booking_status === "CANCELLED"}
              onClick={() => handleBookingStatus(booking.id, "CANCELLED")}
              style={{
                width: "36px",
                height: "36px",
                minWidth: "36px",
                justifySelf: "center",
              }}
            >
              <XCircle size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingsSection;