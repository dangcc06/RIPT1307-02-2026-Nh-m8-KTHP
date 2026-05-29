import React, { FormEvent } from "react";
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
  handleSubmitShowtime: (event: FormEvent) => void;
  editShowtime: (showtime: ApiShowtime) => void;
  deleteShowtime: (showtimeId: number) => Promise<void>;
  formatDateTime: (value: string) => string;
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
            <div
              className="admin-table-row showtime-admin-row"
              key={showtime.id}
            >
              <strong>{showtime.movie_title}</strong>
              <span>
                {showtime.cinema_name} - {showtime.room_name}
              </span>
              <span>{formatDateTime(showtime.start_time)}</span>
              <span>{showtime.status}</span>

              <button
                title="Sửa suất chiếu"
                onClick={() => editShowtime(showtime)}
              >
                <Edit3 size={16} />
              </button>

              <button
                title="Xóa suất chiếu"
                onClick={async () => {
                  await deleteShowtime(showtime.id);
                }}
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

