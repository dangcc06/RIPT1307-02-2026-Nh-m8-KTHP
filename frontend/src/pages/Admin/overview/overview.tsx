import React from "react";
import { BarChart3, Clapperboard, CreditCard, Users } from "lucide-react";
import { formatCurrency } from "../../../utils/format";

type OverviewProps = {
  stats: any;
  maxMonthlyRevenue: number;
  maxWeeklyRevenue: number;
};

const Overview: React.FC<OverviewProps> = ({ stats, maxMonthlyRevenue, maxWeeklyRevenue }) => {
  return (
    <>
      <div className="stats-grid admin-stats">
        <div className="data-card admin-stat-card">
          <Clapperboard size={22} />
          <h2>{stats?.total_movies || 0}</h2>
          <p>Phim</p>
        </div>

        <div className="data-card admin-stat-card">
          <CreditCard size={22} />
          <h2>{stats?.total_bookings || 0}</h2>
          <p>Đơn hàng</p>
        </div>

        <div className="data-card admin-stat-card">
          <Users size={22} />
          <h2>{stats?.today_tickets || 0}</h2>
          <p>Vé hôm nay</p>
        </div>

        <div className="data-card admin-stat-card">
          <BarChart3 size={22} />
          <h2>{formatCurrency(stats?.today_revenue || 0)}</h2>
          <p>Doanh thu hôm nay</p>
        </div>

        <div className="data-card admin-stat-card">
          <Users size={22} />
          <h2>{stats?.total_users || 0}</h2>
          <p>Người dùng</p>
        </div>

        <div className="data-card admin-stat-card">
          <BarChart3 size={22} />
          <h2>{formatCurrency(stats?.total_revenue || 0)}</h2>
          <p>Tổng doanh thu</p>
        </div>
      </div>

      <div className="admin-dashboard-grid">
        <div className="data-card admin-chart-card">
          <h2>Doanh thu 7 ngày gần nhất</h2>
          <div className="revenue-chart">
            {(stats?.last_7d_revenue || []).map((item: any) => (
              <div className="revenue-bar-item" key={item.day}>
                <div className="revenue-bar-track">
                  <span
                    style={{
                      height: `${Math.max(
                        (Number(item.revenue) / maxWeeklyRevenue) * 100,
                        6
                      )}%`,
                    }}
                  />
                </div>
                <small>{item.day}</small>
                <strong>{formatCurrency(item.revenue)}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="data-card admin-chart-card">
          <h2>Hiệu suất đặt vé</h2>

          <div className="status-stack">
            {(stats?.booking_status || []).map((item: any) => {
              const total = Number(stats?.total_bookings || 1);
              const percent = Math.round((Number(item.total) / total) * 100);

              return (
                <div className="status-meter" key={item.status}>
                  <div>
                    <span>{item.status}</span>
                    <strong>{item.total} đơn</strong>
                  </div>

                  <div className="status-track">
                    <span style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="data-card admin-chart-card">
          <h2>Top rạp theo doanh thu</h2>
          <div className="stack">
            {(stats?.top_cinemas || []).map((cinema: any, index: number) => (
              <div className="rank-row" key={cinema.id}>
                <span>{index + 1}</span>
                <strong>{cinema.cinema_name}</strong>
                <em>{formatCurrency(cinema.revenue)}</em>
              </div>
            ))}
          </div>
          <h2 style={{ marginTop: 24 }}>Top combo bán chạy</h2>
          <div className="stack">
            {(stats?.top_combos || []).map((combo: any, index: number) => (
              <div className="rank-row" key={combo.id}>
                <span>{index + 1}</span>
                <strong>{combo.name}</strong>
                <em>{combo.total_quantity} cái</em>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Overview;

