import React from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import type { ApiShowtime, ApiMovie } from "../../../types/api";

type ShowtimeForm = {
  id: string;
  movie_id: string;
  room_id: string;
  start_time: string;
  end_time: string;
  status: ApiShowtime["status"] | string;
};

type ShowtimesSectionProps = {
  showtimes: ApiShowtime[];
  movies: ApiMovie[];
  showtimeForm: ShowtimeForm;
  setShowtimeForm: (form: ShowtimeForm) => void;
  handleSubmitShowtime: (event: React.FormEvent<HTMLFormElement>) => void;
  editShowtime: (showtime: ApiShowtime) => void;
  deleteShowtime: (showtimeId: number) => Promise<void>;
  formatDateTime: (value: string) => string;
};

const cellStyle: React.CSSProperties = {
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const actionButtonStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  minWidth: "36px",
  justifySelf: "center",
};

const ShowtimesSection: React.FC<ShowtimesSectionProps> = ({
  showtimes,
  movies,
  showtimeForm,
  setShowtimeForm,
  handleSubmitShowtime,
  editShowtime,
  deleteShowtime,
  formatDateTime,
}) => {
  return (
    <div
      className="admin-workspace"
      style={{
        width: "100%",
        maxWidth: "100%",
        minWidth: 0,
        boxSizing: "border-box",
      }}
    >
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

      <div
        className="admin-table-card"
        style={{
          width: "100%",
          maxWidth: "100%",
          minWidth: 0,
          overflow: "hidden",
          boxSizing: "border-box",
        }}
      >
        <h2>Danh sách suất chiếu</h2>

        <div
          className="admin-table"
          style={{
            width: "100%",
            maxWidth: "100%",
            overflowX: "auto",
            boxSizing: "border-box",
          }}
        >
          {showtimes.map((showtime) => (
            <div
              className="admin-table-row showtime-admin-row"
              key={showtime.id}
              style={{
                width: "100%",
                minWidth: "680px",
                boxSizing: "border-box",
                display: "grid",
                alignItems: "center",
                gap: "12px",
                gridTemplateColumns: "1.6fr 1.6fr 1.2fr 0.8fr 40px 40px",
              }}
            >
              <strong style={cellStyle}>{showtime.movie_title}</strong>

              <span style={cellStyle}>
                {showtime.cinema_name} - {showtime.room_name}
              </span>

              <span style={cellStyle}>
                {formatDateTime(showtime.start_time)}
              </span>

              <span style={cellStyle}>{showtime.status}</span>

              <button
                title="Sửa suất chiếu"
                onClick={() => editShowtime(showtime)}
                style={actionButtonStyle}
              >
                <Edit3 size={16} />
              </button>

              <button
                title="Xóa suất chiếu"
                onClick={async () => {
                  await deleteShowtime(showtime.id);
                }}
                style={actionButtonStyle}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShowtimesSection;