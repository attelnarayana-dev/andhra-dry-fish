import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  LogOut,
  Menu,
  Package,
  Phone,
  Search,
  ShoppingBag,
  Truck,
  UserRound,
  X
} from "lucide-react";

const API = "http://localhost:5000/api";

const STATUSES = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled"
];

export default function AdminDashboard({
  onLogout
}) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [selectedOrder, setSelectedOrder] =
    useState(null);
  const [updating, setUpdating] =
    useState(false);
  const [sidebarOpen, setSidebarOpen] =
    useState(false);
  const [error, setError] = useState("");

  const getHeaders = () => {
    const admin = JSON.parse(
      localStorage.getItem("adf_admin") ||
        "{}"
    );

    return {
      "Content-Type": "application/json",
      "x-admin-username":
        admin.username || "",
      "x-admin-password":
        "ADF@2026"
    };
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/admin/orders`,
        {
          headers: getHeaders()
        }
      );

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load orders"
        );
      }

      setOrders(data.orders || []);

    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const totalSales = orders
      .filter(
        order =>
          order.status !== "Cancelled"
      )
      .reduce(
        (sum, order) =>
          sum + Number(order.total || 0),
        0
      );

    return {
      totalOrders: orders.length,

      totalSales,

      pending: orders.filter(
        order =>
          [
            "Order Placed",
            "Confirmed",
            "Packed"
          ].includes(order.status)
      ).length,

      shipped: orders.filter(
        order =>
          [
            "Shipped",
            "Out for Delivery"
          ].includes(order.status)
      ).length,

      delivered: orders.filter(
        order =>
          order.status === "Delivered"
      ).length
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const keyword =
      search.trim().toLowerCase();

    return orders.filter(order => {
      const matchesSearch =
        !keyword ||
        order.id
          ?.toLowerCase()
          .includes(keyword) ||
        order.customer?.name
          ?.toLowerCase()
          .includes(keyword) ||
        order.customer?.phone
          ?.includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        order.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    orders,
    search,
    statusFilter
  ]);

  const updateStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdating(true);

      const response = await fetch(
        `${API}/admin/orders/${orderId}`,
        {
          method: "PATCH",
          headers: getHeaders(),
          body: JSON.stringify({
            status
          })
        }
      );

      if (response.status === 401) {
        onLogout();
        return;
      }

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to update order"
        );
      }

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? data.order
            : order
        )
      );

      setSelectedOrder(data.order);

    } catch (error) {
      alert(error.message);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = date => {
    if (!date) return "-";

    return new Date(date).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }
    );
  };

  const getStatusClass = status => {
    if (status === "Delivered")
      return "delivered";

    if (
      status === "Cancelled"
    )
      return "cancelled";

    if (
      [
        "Shipped",
        "Out for Delivery"
      ].includes(status)
    )
      return "shipped";

    if (
      [
        "Confirmed",
        "Packed"
      ].includes(status)
    )
      return "confirmed";

    return "placed";
  };

  const handleLogout = () => {
    localStorage.removeItem(
      "adf_admin"
    );

    onLogout();
  };

  return (
    <div className="admin-layout">

      <aside
        className={`admin-sidebar ${
          sidebarOpen
            ? "admin-sidebar-open"
            : ""
        }`}
      >

        <div className="admin-sidebar-brand">
          <div>🐟</div>

          <section>
            <strong>
              ANDHRA DRY FISH
            </strong>

            <span>
              ADMIN PANEL
            </span>
          </section>
        </div>

        <nav>
          <button className="active">
            <ShoppingBag size={19} />
            Dashboard
          </button>

          <button
            onClick={() =>
              document
                .getElementById(
                  "admin-orders"
                )
                ?.scrollIntoView()
            }
          >
            <Package size={19} />
            Orders
          </button>
        </nav>

        <button
          className="admin-sidebar-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>

      </aside>

      {sidebarOpen && (
        <div
          className="admin-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      <main className="admin-main">

        <header className="admin-topbar">

          <button
            className="admin-mobile-menu"
            onClick={() =>
              setSidebarOpen(true)
            }
          >
            <Menu size={23} />
          </button>

          <div>
            <span>
              ANDHRA DRY FISH
            </span>

            <h1>
              Dashboard
            </h1>
          </div>

          <button
            className="admin-top-logout"
            onClick={handleLogout}
          >
            <LogOut size={17} />
            Logout
          </button>

        </header>

        {error && (
          <div className="admin-page-error">
            {error}
          </div>
        )}

        <section className="admin-stats">

          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingBag />}
            className="blue"
          />

          <StatCard
            title="Total Sales"
            value={`₹${stats.totalSales.toLocaleString(
              "en-IN"
            )}`}
            icon={<span>₹</span>}
            className="green"
          />

          <StatCard
            title="Pending Orders"
            value={stats.pending}
            icon={<Clock3 />}
            className="orange"
          />

          <StatCard
            title="Shipped"
            value={stats.shipped}
            icon={<Truck />}
            className="purple"
          />

          <StatCard
            title="Delivered"
            value={stats.delivered}
            icon={<CheckCircle2 />}
            className="success"
          />

        </section>

        <section
          className="admin-orders-section"
          id="admin-orders"
        >

          <div className="admin-section-heading">

            <div>
              <span>
                ORDER MANAGEMENT
              </span>

              <h2>
                Customer Orders
              </h2>
            </div>

            <button
              onClick={loadOrders}
              className="admin-refresh"
            >
              Refresh
            </button>

          </div>

          <div className="admin-filters">

            <div className="admin-search">
              <Search size={18} />

              <input
                type="text"
                placeholder="Search order, customer or phone..."
                value={search}
                onChange={e =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="admin-status-filter">

              <select
                value={statusFilter}
                onChange={e =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                {STATUSES.map(status => (
                  <option
                    key={status}
                    value={status}
                  >
                    {status}
                  </option>
                ))}
              </select>

              <ChevronDown size={16} />

            </div>

          </div>

          {loading ? (
            <div className="admin-loading">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="admin-empty">
              <Package size={42} />

              <h3>
                No orders found
              </h3>

              <p>
                New customer orders will
                appear here.
              </p>
            </div>
          ) : (

            <div className="admin-orders-table-wrap">

              <table className="admin-orders-table">

                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  {filteredOrders.map(
                    order => (
                      <tr key={order.id}>

                        <td>
                          <strong>
                            {order.id}
                          </strong>
                        </td>

                        <td>
                          <div className="admin-customer-cell">
                            <strong>
                              {
                                order
                                  .customer
                                  ?.name
                              }
                            </strong>

                            <span>
                              {
                                order
                                  .customer
                                  ?.phone
                              }
                            </span>
                          </div>
                        </td>

                        <td>
                          {order.items?.length ||
                            0}{" "}
                          item(s)
                        </td>

                        <td>
                          <strong>
                            ₹
                            {Number(
                              order.total ||
                                0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="upi-badge">
                            UPI
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-status ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </td>

                        <td>
                          <span className="admin-date">
                            {formatDate(
                              order.createdAt
                            )}
                          </span>
                        </td>

                        <td>
                          <button
                            className="admin-view-button"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </section>

      </main>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          updating={updating}
          onClose={() =>
            setSelectedOrder(null)
          }
          onUpdateStatus={
            updateStatus
          }
          formatDate={formatDate}
          getStatusClass={
            getStatusClass
          }
        />
      )}

    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  className
}) {
  return (
    <div
      className={`admin-stat-card ${className}`}
    >
      <div className="admin-stat-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

function OrderModal({
  order,
  updating,
  onClose,
  onUpdateStatus,
  formatDate,
  getStatusClass
}) {
  const phone =
    order.customer?.phone || "";

  const whatsappText = encodeURIComponent(
    `Hello ${order.customer?.name || ""}, this is Andhra Dry Fish regarding your order ${order.id}. Current order status: ${order.status}.`
  );

  return (
    <div
      className="admin-modal-backdrop"
      onClick={onClose}
    >

      <div
        className="admin-order-modal"
        onClick={e =>
          e.stopPropagation()
        }
      >

        <div className="admin-modal-header">

          <div>
            <span>
              ORDER DETAILS
            </span>

            <h2>
              {order.id}
            </h2>
          </div>

          <button onClick={onClose}>
            <X size={22} />
          </button>

        </div>

        <div className="admin-modal-content">

          <div className="admin-detail-card">

            <div className="admin-detail-title">
              <UserRound size={18} />
              Customer Details
            </div>

            <p>
              <strong>Name:</strong>{" "}
              {order.customer?.name}
            </p>

            <p>
              <strong>Phone:</strong>{" "}
              {phone}
            </p>

            <p>
              <strong>Email:</strong>{" "}
              {order.customer?.email ||
                "-"}
            </p>

            <p>
              <strong>Address:</strong>{" "}
              {order.customer?.address}
            </p>

            <p>
              <strong>City:</strong>{" "}
              {order.customer?.city ||
                "-"}
            </p>

            <p>
              <strong>State:</strong>{" "}
              {order.customer?.state ||
                "-"}
            </p>

            <p>
              <strong>Pincode:</strong>{" "}
              {order.customer?.pincode ||
                "-"}
            </p>

            <a
              className="admin-whatsapp"
              href={`https://wa.me/91${phone}?text=${whatsappText}`}
              target="_blank"
              rel="noreferrer"
            >
              <Phone size={17} />
              WhatsApp Customer
            </a>

          </div>

          <div className="admin-detail-card">

            <div className="admin-detail-title">
              <Package size={18} />
              Order Items
            </div>

            {order.items?.map(
              (item, index) => (
                <div
                  className="admin-order-item"
                  key={`${item.productId}-${index}`}
                >
                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.weight} ×{" "}
                      {item.quantity}
                    </span>
                  </div>

                  <strong>
                    ₹
                    {(
                      Number(
                        item.price
                      ) *
                      Number(
                        item.quantity
                      )
                    ).toLocaleString(
                      "en-IN"
                    )}
                  </strong>
                </div>
              )
            )}

            <div className="admin-total-row">
              <span>Subtotal</span>
              <strong>
                ₹
                {Number(
                  order.subtotal || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="admin-total-row">
              <span>Delivery</span>
              <strong>
                {Number(
                  order.deliveryCharge ||
                    0
                ) === 0
                  ? "FREE"
                  : `₹${order.deliveryCharge}`}
              </strong>
            </div>

            <div className="admin-total-row grand">
              <span>Total</span>
              <strong>
                ₹
                {Number(
                  order.total || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

          </div>

          <div className="admin-detail-card">

            <div className="admin-detail-title">
              ₹ Payment
            </div>

            <div className="admin-payment-box">

              <span>
                Payment Method
              </span>

              <strong>
                UPI
              </strong>

            </div>

            <small className="admin-payment-warning">
              UPI payment is recorded as
              selected by the customer.
              Automatic payment verification
              is not implemented yet.
            </small>

          </div>

          <div className="admin-detail-card">

            <div className="admin-detail-title">
              Update Order Status
            </div>

            <div className="admin-current-status">
              Current Status

              <span
                className={`admin-status ${getStatusClass(
                  order.status
                )}`}
              >
                {order.status}
              </span>
            </div>

            <select
              className="admin-status-select"
              value={order.status}
              disabled={updating}
              onChange={e =>
                onUpdateStatus(
                  order.id,
                  e.target.value
                )
              }
            >
              {STATUSES.map(status => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

          </div>

          <div className="admin-detail-card">

            <div className="admin-detail-title">
              Order Timeline
            </div>

            <div className="admin-timeline">

              {order.timeline?.map(
                (event, index) => (
                  <div
                    className="admin-timeline-item"
                    key={`${event.status}-${index}`}
                  >
                    <div className="admin-timeline-dot" />

                    <div>
                      <strong>
                        {event.status}
                      </strong>

                      <span>
                        {formatDate(
                          event.date
                        )}
                      </span>
                    </div>
                  </div>
                )
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}