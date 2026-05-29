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

const BookingsSection: React.FC<BookingsSectionProps> = ({
  bookings,
  handleBookingStatus,
}) => {
  return (
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
              className={`admin-status-pill ${
                booking.booking_status.toLowerCase()
              }`}
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
  );
};

export default BookingsSection;

