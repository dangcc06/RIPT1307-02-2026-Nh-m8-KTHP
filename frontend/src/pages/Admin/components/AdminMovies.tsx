import React, { FormEvent } from "react";
import { Edit3, Plus, Trash2 } from "lucide-react";
import { notification } from "antd";
import type { ApiMovie } from "../../types/api";
import { updateAdminMovie, createAdminMovie, deleteAdminMovie } from "../../services/adminService";

interface AdminMoviesProps {
  movies: ApiMovie[];
  movieForm: any;
  setMovieForm: (form: any) => void;
  handleSubmitMovie: (event: FormEvent) => void;
  editMovie: (movie: ApiMovie) => void;
  loadAdminData: () => Promise<void>;
}

const AdminMovies: React.FC<AdminMoviesProps> = ({ 
  movies, movieForm, setMovieForm, handleSubmitMovie, editMovie, loadAdminData 
}) => {
  return (
    <div className="admin-workspace">
      <form className="form-panel admin-form" onSubmit={handleSubmitMovie}>
        <h2>{movieForm.id ? "Sửa phim" : "Thêm phim"}</h2>
        <input required placeholder="Tên phim" value={movieForm.title} onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })} />
        <input placeholder="Mô tả" value={movieForm.description} onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })} />
        <input required type="number" min="1" placeholder="Thời lượng (phút)" value={movieForm.duration} onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })} />
        <input type="date" value={movieForm.release_date} onChange={(e) => setMovieForm({ ...movieForm, release_date: e.target.value })} />
        <input placeholder="Poster URL" value={movieForm.poster_url} onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })} />
        <input placeholder="Trailer URL" value={movieForm.trailer_url} onChange={(e) => setMovieForm({ ...movieForm, trailer_url: e.target.value })} />
        <input placeholder="Ngôn ngữ" value={movieForm.language} onChange={(e) => setMovieForm({ ...movieForm, language: e.// ...existing code...
        <input type="number" min="0" max="10" step="0.1" placeholder="Đánh giá" value={movieForm.rating} onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })} />
        <select value={movieForm.status} onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}>
          <option value="NOW_SHOWING">Đang chiếu</option>
          <option value="COMING_SOON">Sắp chiếu</option>
          <option value="ENDED">Ngừng chiếu</option>
        </select>
        <button className="primary-btn form-submit">
          <Plus size={18} />
          Lưu phim
        </button>
      </form>

      <div className="data-card admin-table-card">
        <h2>Danh sách phim</h2>
        <div className="admin-table">
          {movies.map((movie) => (
            <div className="admin-table-row movie-admin-row" key={movie.id}>
              <strong>{movie.title}</strong>
              <span>{movie.status}</span>
              <span>{movie.duration || 0} phút</span>
              <button title="Sửa phim" onClick={() => editMovie(movie)}><Edit3 size={16} /></button>
              <button title="Xóa phim" onClick={async () => { 
                if (window.confirm("Xóa phim này?")) {
                  await deleteAdminMovie(movie.id); 
                  await loadAdminData(); 
                }
              }}><Trash2 size={16} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminMovies;
