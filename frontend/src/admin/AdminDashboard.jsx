import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  CheckCircle2,
  ChevronDown,
  Clock3,
  Edit3,
  Eye,
  ImagePlus,
  LogOut,
  Menu,
  Package,
  Plus,
  Search,
  ShoppingBag,
  Trash2,
  Truck,
  UserRound,
  X,
} from "lucide-react";

const API = "https://andhra-dry-fish.onrender.com/api";
const SERVER_URL = "https://andhra-dry-fish.onrender.com";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ADF@2026";

const STATUS_OPTIONS = [
  "Order Placed",
  "Confirmed",
  "Packed",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
];

const CATEGORY_OPTIONS = [
  "Dry Fish",
  "Dry Prawns",
  "Combos",
];

const WEIGHT_OPTIONS = [
  "250g",
  "500g",
  "1kg",
  "2kg",
];

const EMPTY_PRODUCT = {
  name: "",
  category: "Dry Fish",
  price: "",
  oldPrice: "",
  weight: "500g",
  stock: "",
  description: "",
  featured: false,
};

export default function AdminDashboard({
  onLogout,
}) {
  /* =====================================================
     ORDERS
  ===================================================== */

  const [orders, setOrders] = useState([]);

  /* =====================================================
     PRODUCTS
  ===================================================== */

  const [products, setProducts] = useState([]);

  /* =====================================================
     LOADING
  ===================================================== */

  const [loading, setLoading] = useState(true);

  const [productsLoading, setProductsLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [productsError, setProductsError] =
    useState("");

  /* =====================================================
     SEARCH / FILTER
  ===================================================== */

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [productSearch, setProductSearch] =
    useState("");

  /* =====================================================
     ORDER MODAL
  ===================================================== */

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const [updatingOrder, setUpdatingOrder] =
    useState("");

  /* =====================================================
     MOBILE MENU
  ===================================================== */

  const [mobileMenu, setMobileMenu] =
    useState(false);

  /* =====================================================
     ACTIVE SECTION
  ===================================================== */

  const [activeSection, setActiveSection] =
    useState("orders");

  /* =====================================================
     PRODUCT MODAL
  ===================================================== */

  const [
    showProductModal,
    setShowProductModal,
  ] = useState(false);

  const [
    editingProduct,
    setEditingProduct,
  ] = useState(null);

  const [
    productForm,
    setProductForm,
  ] = useState(EMPTY_PRODUCT);

  const [
    productImage,
    setProductImage,
  ] = useState(null);

  const [
    productImagePreview,
    setProductImagePreview,
  ] = useState("");

  const [
    savingProduct,
    setSavingProduct,
  ] = useState(false);

  const [
    uploadingImage,
    setUploadingImage,
  ] = useState(false);

  /* =====================================================
     AUTH HEADERS
  ===================================================== */

  const adminAuthHeaders = {
    "Content-Type": "application/json",
    "x-admin-username": ADMIN_USERNAME,
    "x-admin-password": ADMIN_PASSWORD,
  };

  /* =====================================================
     IMAGE URL
  ===================================================== */

  const getImageUrl = (image) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/uploads/")) {
      return `${SERVER_URL}${image}`;
    }

    return image;
  };

  /* =====================================================
     LOAD ORDERS
  ===================================================== */

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/admin/orders`,
        {
          headers: adminAuthHeaders,
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load orders"
        );
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to backend."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOAD PRODUCTS
  ===================================================== */

  const loadProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await fetch(
        `${API}/products`
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to load products"
        );
      }

      setProducts(
        data.products || []
      );
    } catch (err) {
      setProductsError(
        err.message ||
          "Unable to load products."
      );
    } finally {
      setProductsLoading(false);
    }
  };

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  /* =====================================================
     STATISTICS
  ===================================================== */

  const statistics = useMemo(() => {
    const activeOrders =
      orders.filter(
        (order) =>
          order.status !==
          "Cancelled"
      );

    const totalSales =
      activeOrders.reduce(
        (sum, order) =>
          sum +
          Number(
            order.total || 0
          ),
        0
      );

    const pending =
      orders.filter((order) =>
        [
          "Order Placed",
          "Confirmed",
          "Packed",
        ].includes(
          order.status
        )
      ).length;

    const shipped =
      orders.filter((order) =>
        [
          "Shipped",
          "Out for Delivery",
        ].includes(
          order.status
        )
      ).length;

    const delivered =
      orders.filter(
        (order) =>
          order.status ===
          "Delivered"
      ).length;

    return {
      totalOrders:
        orders.length,

      totalSales,

      pending,

      shipped,

      delivered,
    };
  }, [orders]);

  /* =====================================================
     FILTER ORDERS
  ===================================================== */

  const filteredOrders = useMemo(() => {
    const searchText =
      search
        .trim()
        .toLowerCase();

    return orders.filter(
      (order) => {
        const matchesSearch =
          !searchText ||
          String(
            order.id || ""
          )
            .toLowerCase()
            .includes(
              searchText
            ) ||
          String(
            order.customer
              ?.name || ""
          )
            .toLowerCase()
            .includes(
              searchText
            ) ||
          String(
            order.customer
              ?.phone || ""
          )
            .toLowerCase()
            .includes(
              searchText
            );

        const matchesStatus =
          statusFilter ===
            "All" ||
          order.status ===
            statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );
  }, [
    orders,
    search,
    statusFilter,
  ]);

  /* =====================================================
     FILTER PRODUCTS
  ===================================================== */

  const filteredProducts =
    useMemo(() => {
      const text =
        productSearch
          .trim()
          .toLowerCase();

      if (!text) {
        return products;
      }

      return products.filter(
        (product) =>
          String(
            product.name || ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            product.category ||
              ""
          )
            .toLowerCase()
            .includes(text) ||
          String(
            product.id || ""
          )
            .toLowerCase()
            .includes(text)
      );
    }, [
      products,
      productSearch,
    ]);

  /* =====================================================
     FORMAT DATE
  ===================================================== */

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(
      date
    ).toLocaleString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  /* =====================================================
     FORMAT MONEY
  ===================================================== */

  const formatMoney = (
    amount
  ) => {
    return `₹${Number(
      amount || 0
    ).toLocaleString(
      "en-IN"
    )}`;
  };

  /* =====================================================
     STATUS CLASS
  ===================================================== */

  const getStatusClass = (
    status
  ) => {
    return String(
      status || ""
    )
      .toLowerCase()
      .replaceAll(
        " ",
        "-"
      );
  };

  /* =====================================================
     UPDATE ORDER STATUS
  ===================================================== */

  const updateStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      setUpdatingOrder(
        orderId
      );

      const response =
        await fetch(
          `${API}/admin/orders/${orderId}`,
          {
            method: "PATCH",

            headers:
              adminAuthHeaders,

            body: JSON.stringify(
              {
                status:
                  newStatus,
              }
            ),
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to update order"
        );
      }

      setOrders(
        (previous) =>
          previous.map(
            (order) =>
              order.id ===
              orderId
                ? {
                    ...order,
                    status:
                      newStatus,
                    timeline:
                      data.order
                        ?.timeline ||
                      order.timeline,
                  }
                : order
          )
      );

      if (
        selectedOrder &&
        selectedOrder.id ===
          orderId
      ) {
        setSelectedOrder(
          data.order || {
            ...selectedOrder,
            status:
              newStatus,
          }
        );
      }
    } catch (err) {
      alert(
        err.message ||
          "Unable to update order status."
      );
    } finally {
      setUpdatingOrder(
        ""
      );
    }
  };

  /* =====================================================
     WHATSAPP
  ===================================================== */

  const openWhatsApp = (
    order
  ) => {
    const phone =
      String(
        order.customer
          ?.phone || ""
      ).replace(
        /\D/g,
        ""
      );

    if (!phone) {
      alert(
        "Customer phone number not available."
      );
      return;
    }

    const message =
      `Hello ${
        order.customer
          ?.name || ""
      }, this is Andhra Dry Fish regarding your order ${
        order.id
      }. Current order status: ${
        order.status
      }. Thank you!`;

    const fullPhone =
      phone.length === 10
        ? `91${phone}`
        : phone;

    window.open(
      `https://wa.me/${fullPhone}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  /* =====================================================
     PRODUCT FORM
  ===================================================== */

  const handleProductChange = (
    field,
    value
  ) => {
    setProductForm(
      (previous) => ({
        ...previous,
        [field]: value,
      })
    );
  };

  /* =====================================================
     RESET PRODUCT FORM
  ===================================================== */

  const resetProductForm = () => {
    setProductForm({
      ...EMPTY_PRODUCT,
    });

    setProductImage(null);

    setProductImagePreview("");

    setEditingProduct(null);
  };

  /* =====================================================
     ADD PRODUCT
  ===================================================== */

  const openAddProduct = () => {
    resetProductForm();

    setShowProductModal(
      true
    );
  };

  /* =====================================================
     EDIT PRODUCT
  ===================================================== */

  const openEditProduct = (
    product
  ) => {
    setEditingProduct(
      product
    );

    setProductForm({
      name:
        product.name || "",

      category:
        product.category ||
        "Dry Fish",

      price:
        product.price ??
        "",

      oldPrice:
        product.oldPrice ??
        "",

      weight:
        product.weight ||
        "500g",

      stock:
        product.stock ??
        "",

      description:
        product.description ||
        "",

      featured:
        Boolean(
          product.featured
        ),
    });

    setProductImage(null);

    setProductImagePreview(
      product.image
        ? getImageUrl(
            product.image
          )
        : ""
    );

    setShowProductModal(
      true
    );
  };

  /* =====================================================
     IMAGE CHANGE
  ===================================================== */

  const handleImageChange = (
    event
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      !file.type.startsWith(
        "image/"
      )
    ) {
      alert(
        "Please select a valid image."
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Image must be 5MB or less."
      );
      return;
    }

    setProductImage(
      file
    );

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setProductImagePreview(
      previewUrl
    );
  };

  /* =====================================================
     SAVE PRODUCT
  ===================================================== */

  const saveProduct = async (
    event
  ) => {
    event.preventDefault();

    if (
      !productForm.name.trim()
    ) {
      alert(
        "Please enter product name."
      );
      return;
    }

    if (
      !productForm.price ||
      Number(
        productForm.price
      ) <= 0
    ) {
      alert(
        "Please enter a valid product price."
      );
      return;
    }

    if (
      productForm.stock ===
        "" ||
      Number(
        productForm.stock
      ) < 0
    ) {
      alert(
        "Please enter stock quantity."
      );
      return;
    }

    try {
      setSavingProduct(
        true
      );

      /* =================================================
         EDIT PRODUCT
      ================================================= */

      if (editingProduct) {
        const response =
          await fetch(
            `${API}/admin/products/${editingProduct.id}`,
            {
              method:
                "PATCH",

              headers:
                adminAuthHeaders,

              body: JSON.stringify(
                {
                  name:
                    productForm.name.trim(),

                  category:
                    productForm.category,

                  price:
                    Number(
                      productForm.price
                    ),

                  oldPrice:
                    productForm.oldPrice
                      ? Number(
                          productForm.oldPrice
                        )
                      : Number(
                          productForm.price
                        ),

                  weight:
                    productForm.weight,

                  stock:
                    Number(
                      productForm.stock
                    ),

                  description:
                    productForm.description.trim(),

                  featured:
                    Boolean(
                      productForm.featured
                    ),
                }
              ),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to update product"
          );
        }

        /* =================================================
           UPLOAD EDIT IMAGE
        ================================================= */

        if (productImage) {
          setUploadingImage(
            true
          );

          const formData =
            new FormData();

          formData.append(
            "image",
            productImage
          );

          const imageResponse =
            await fetch(
              `${API}/admin/products/${editingProduct.id}/image`,
              {
                method:
                  "POST",

                headers: {
                  "x-admin-username":
                    ADMIN_USERNAME,

                  "x-admin-password":
                    ADMIN_PASSWORD,
                },

                body:
                  formData,
              }
            );

          const imageData =
            await imageResponse.json();

          if (
            !imageResponse.ok ||
            !imageData.success
          ) {
            throw new Error(
              imageData.message ||
                "Product updated but image upload failed"
            );
          }
        }

        alert(
          "Product updated successfully."
        );
      }

      /* =================================================
         CREATE PRODUCT
      ================================================= */

      else {
        const response =
          await fetch(
            `${API}/admin/products`,
            {
              method:
                "POST",

              headers:
                adminAuthHeaders,

              body: JSON.stringify(
                {
                  name:
                    productForm.name.trim(),

                  category:
                    productForm.category,

                  price:
                    Number(
                      productForm.price
                    ),

                  oldPrice:
                    productForm.oldPrice
                      ? Number(
                          productForm.oldPrice
                        )
                      : Number(
                          productForm.price
                        ),

                  weight:
                    productForm.weight,

                  stock:
                    Number(
                      productForm.stock
                    ),

                  description:
                    productForm.description.trim(),

                  featured:
                    Boolean(
                      productForm.featured
                    ),
                }
              ),
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to add product"
          );
        }

        const createdProduct =
          data.product;

        /* =================================================
           UPLOAD NEW IMAGE
        ================================================= */

        if (
          productImage &&
          createdProduct?.id
        ) {
          setUploadingImage(
            true
          );

          const formData =
            new FormData();

          formData.append(
            "image",
            productImage
          );

          const imageResponse =
            await fetch(
              `${API}/admin/products/${createdProduct.id}/image`,
              {
                method:
                  "POST",

                headers: {
                  "x-admin-username":
                    ADMIN_USERNAME,

                  "x-admin-password":
                    ADMIN_PASSWORD,
                },

                body:
                  formData,
              }
            );

          const imageData =
            await imageResponse.json();

          if (
            !imageResponse.ok ||
            !imageData.success
          ) {
            throw new Error(
              imageData.message ||
                "Product added but image upload failed"
            );
          }
        }

        alert(
          "Product added successfully."
        );
      }

      setShowProductModal(
        false
      );

      resetProductForm();

      await loadProducts();
    } catch (err) {
      alert(
        err.message ||
          "Unable to save product."
      );
    } finally {
      setSavingProduct(
        false
      );

      setUploadingImage(
        false
      );
    }
  };

  /* =====================================================
     DELETE PRODUCT
  ===================================================== */

  const deleteProduct =
    async (product) => {
      const confirmed =
        window.confirm(
          `Delete "${product.name}"?\n\nThis product will be removed from the store.`
        );

      if (!confirmed) return;

      try {
        const response =
          await fetch(
            `${API}/admin/products/${product.id}`,
            {
              method:
                "DELETE",

              headers:
                adminAuthHeaders,
            }
          );

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.success
        ) {
          throw new Error(
            data.message ||
              "Unable to delete product"
          );
        }

        setProducts(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                product.id
            )
        );

        alert(
          "Product deleted successfully."
        );
      } catch (err) {
        alert(
          err.message ||
            "Unable to delete product."
        );
      }
    };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      "adf_admin"
    );

    if (onLogout) {
      onLogout();
    } else {
      window.location.href =
        "/";
    }
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="admin-dashboard">

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`admin-sidebar ${
          mobileMenu
            ? "mobile-open"
            : ""
        }`}
      >

        <div className="admin-sidebar-brand">

          <div className="admin-sidebar-logo">
            🐟
          </div>

          <div>

            <strong>
              ANDHRA DRY FISH
            </strong>

            <span>
              Admin Panel
            </span>

          </div>

        </div>

        <nav className="admin-sidebar-nav">

          <button
            className={
              activeSection ===
              "orders"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveSection(
                "orders"
              );

              setMobileMenu(
                false
              );
            }}
          >

            <ShoppingBag
              size={18}
            />

            Orders

          </button>

          <button
            className={
              activeSection ===
              "products"
                ? "active"
                : ""
            }
            onClick={() => {
              setActiveSection(
                "products"
              );

              setMobileMenu(
                false
              );
            }}
          >

            <Package
              size={18}
            />

            Products

          </button>

          <button
            className={
              activeSection ===
              "delivery"
                ? "active"
                : ""
            }
            onClick={() => {
              alert(
                "Delivery Management will be added next."
              );
            }}
          >

            <Truck
              size={18}
            />

            Delivery

          </button>

        </nav>

        <button
          className="admin-logout-button"
          onClick={
            handleLogout
          }
        >

          <LogOut
            size={18}
          />

          Logout

        </button>

      </aside>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="admin-main">

        {/* TOPBAR */}

        <header className="admin-topbar">

          <button
            className="admin-mobile-menu"
            onClick={() =>
              setMobileMenu(
                !mobileMenu
              )
            }
          >
            <Menu
              size={22}
            />
          </button>

          <div>

            <span className="admin-page-label">
              ANDHRA DRY FISH
            </span>

            <h1>
              {activeSection ===
              "products"
                ? "Products Management"
                : "Orders Dashboard"}
            </h1>

          </div>

          <div className="admin-user">

            <UserRound
              size={18}
            />

            <span>
              Admin
            </span>

          </div>

        </header>

        {/* =================================================
            ORDERS
        ================================================= */}

        {activeSection ===
          "orders" && (
          <>

            {/* STATS */}

            <section className="admin-stats-grid">

              <div className="admin-stat-card">

                <div className="admin-stat-icon">

                  <ShoppingBag
                    size={22}
                  />

                </div>

                <div>

                  <span>
                    Total Orders
                  </span>

                  <strong>
                    {
                      statistics.totalOrders
                    }
                  </strong>

                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon">
                  ₹
                </div>

                <div>

                  <span>
                    Total Sales
                  </span>

                  <strong>
                    {formatMoney(
                      statistics.totalSales
                    )}
                  </strong>

                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon">

                  <Clock3
                    size={22}
                  />

                </div>

                <div>

                  <span>
                    Pending Orders
                  </span>

                  <strong>
                    {
                      statistics.pending
                    }
                  </strong>

                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon">

                  <Truck
                    size={22}
                  />

                </div>

                <div>

                  <span>
                    Shipped
                  </span>

                  <strong>
                    {
                      statistics.shipped
                    }
                  </strong>

                </div>

              </div>

              <div className="admin-stat-card">

                <div className="admin-stat-icon">

                  <CheckCircle2
                    size={22}
                  />

                </div>

                <div>

                  <span>
                    Delivered
                  </span>

                  <strong>
                    {
                      statistics.delivered
                    }
                  </strong>

                </div>

              </div>

            </section>

            {/* ORDERS SECTION */}

            <section className="admin-orders-section">

              <div className="admin-section-heading">

                <div>

                  <span>
                    STORE MANAGEMENT
                  </span>

                  <h2>
                    Customer Orders
                  </h2>

                </div>

                <button
                  className="admin-refresh-button"
                  onClick={
                    loadOrders
                  }
                  disabled={
                    loading
                  }
                >
                  {loading
                    ? "Loading..."
                    : "Refresh Orders"}
                </button>

              </div>

              {error && (
                <div className="admin-error-box">
                  {error}
                </div>
              )}

              <div className="admin-filters">

                <div className="admin-search">

                  <Search
                    size={18}
                  />

                  <input
                    type="text"
                    placeholder="Search order, customer or phone..."
                    value={
                      search
                    }
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div className="admin-status-filter">

                  <ChevronDown
                    size={17}
                  />

                  <select
                    value={
                      statusFilter
                    }
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value
                      )
                    }
                  >

                    <option value="All">
                      All Status
                    </option>

                    {STATUS_OPTIONS.map(
                      (status) => (
                        <option
                          key={
                            status
                          }
                          value={
                            status
                          }
                        >
                          {
                            status
                          }
                        </option>
                      )
                    )}

                  </select>

                </div>

              </div>

              <div className="admin-table-wrapper">

                {loading ? (

                  <div className="admin-empty">
                    Loading orders...
                  </div>

                ) : filteredOrders.length ===
                  0 ? (

                  <div className="admin-empty">

                    <Package
                      size={38}
                    />

                    <h3>
                      No orders found
                    </h3>

                    <p>
                      Orders will appear here after customers place them.
                    </p>

                  </div>

                ) : (

                  <table className="admin-orders-table">

                    <thead>

                      <tr>

                        <th>
                          Order
                        </th>

                        <th>
                          Customer
                        </th>

                        <th>
                          Items
                        </th>

                        <th>
                          Total
                        </th>

                        <th>
                          Payment
                        </th>

                        <th>
                          Status
                        </th>

                        <th>
                          Date
                        </th>

                        <th>
                          View
                        </th>

                      </tr>

                    </thead>

                    <tbody>

                      {filteredOrders.map(
                        (order) => (

                          <tr
                            key={
                              order.id
                            }
                          >

                            <td>

                              <strong>
                                {
                                  order.id
                                }
                              </strong>

                            </td>

                            <td>

                              <div className="admin-customer-cell">

                                <strong>
                                  {
                                    order
                                      .customer
                                      ?.name ||
                                    "-"
                                  }
                                </strong>

                                <span>
                                  {
                                    order
                                      .customer
                                      ?.phone ||
                                    "-"
                                  }
                                </span>

                              </div>

                            </td>

                            <td>

                              {
                                order
                                  .items
                                  ?.length ||
                                0
                              }{" "}
                              item
                              {order
                                .items
                                ?.length ===
                              1
                                ? ""
                                : "s"}

                            </td>

                            <td>

                              <strong>
                                {formatMoney(
                                  order.total
                                )}
                              </strong>

                            </td>

                            <td>

                              <span className="admin-payment-badge">

                                {
                                  order.paymentMethod ||
                                  "UPI"
                                }

                              </span>

                            </td>

                            <td>

                              <select
                                className={`admin-status-select ${getStatusClass(
                                  order.status
                                )}`}
                                value={
                                  order.status ||
                                  "Order Placed"
                                }
                                disabled={
                                  updatingOrder ===
                                  order.id
                                }
                                onChange={(e) =>
                                  updateStatus(
                                    order.id,
                                    e.target.value
                                  )
                                }
                              >

                                {STATUS_OPTIONS.map(
                                  (status) => (

                                    <option
                                      key={
                                        status
                                      }
                                      value={
                                        status
                                      }
                                    >
                                      {
                                        status
                                      }
                                    </option>

                                  )
                                )}

                              </select>

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

                                <Eye
                                  size={17}
                                />

                                View

                              </button>

                            </td>

                          </tr>

                        )
                      )}

                    </tbody>

                  </table>

                )}

              </div>

            </section>

          </>
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {activeSection ===
          "products" && (

          <section className="admin-products-section">

            {/* PRODUCTS HEADER */}

            <div className="admin-section-heading">

              <div>

                <span>
                  STORE MANAGEMENT
                </span>

                <h2>
                  Products
                </h2>

              </div>

              <button
                className="admin-add-product-button"
                onClick={
                  openAddProduct
                }
              >

                <Plus
                  size={18}
                />

                Add Product

              </button>

            </div>

            {/* PRODUCT TOOLBAR */}

            <div className="admin-product-toolbar">

              <div className="admin-search">

                <Search
                  size={18}
                />

                <input
                  type="text"
                  placeholder="Search products..."
                  value={
                    productSearch
                  }
                  onChange={(e) =>
                    setProductSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <div className="admin-product-count">

                {
                  filteredProducts.length
                }{" "}
                Products

              </div>

            </div>

            {/* PRODUCT ERROR */}

            {productsError && (

              <div className="admin-error-box">
                {productsError}
              </div>

            )}

            {/* =================================================
                PRODUCTS LOADING
            ================================================= */}

            {productsLoading ? (

              <div className="admin-empty">
                Loading products...
              </div>

            ) : filteredProducts.length ===
              0 ? (

              <div className="admin-empty">

                <Package
                  size={38}
                />

                <h3>
                  No products found
                </h3>

                <p>
                  Add your first product to the store.
                </p>

              </div>

            ) : (

              /* =================================================
                 CATEGORY-WISE PRODUCTS
              ================================================= */

              <>

                {CATEGORY_OPTIONS.map(
                  (category) => {

                    const categoryProducts =
                      filteredProducts.filter(
                        (product) =>
                          product.category ===
                          category
                      );

                    if (
                      categoryProducts.length ===
                      0
                    ) {
                      return null;
                    }

                    const categoryIcon =
                      category ===
                      "Dry Fish"
                        ? "🐟"
                        : category ===
                          "Dry Prawns"
                        ? "🦐"
                        : "🧺";

                    return (

                      <section
                        key={
                          category
                        }
                        className="admin-product-category-section"
                      >

                        {/* CATEGORY HEADER */}

                        <div className="admin-product-category-header">

                          <div className="admin-product-category-title">

                            <div className="admin-product-category-icon">

                              {
                                categoryIcon
                              }

                            </div>

                            <div>

                              <h3>
                                {
                                  category
                                }
                              </h3>

                              <span>

                                {
                                  categoryProducts.length
                                }{" "}

                                {
                                  categoryProducts.length ===
                                  1
                                    ? "Product"
                                    : "Products"
                                }

                              </span>

                            </div>

                          </div>

                          <button
                            className="admin-category-add-button"
                            onClick={() => {

                              resetProductForm();

                              setProductForm({
                                ...EMPTY_PRODUCT,
                                category,
                              });

                              setShowProductModal(
                                true
                              );

                            }}
                          >

                            <Plus
                              size={16}
                            />

                            Add{" "}
                            {category}

                          </button>

                        </div>

                        {/* CATEGORY PRODUCT GRID */}

                        <div className="admin-products-grid">

                          {categoryProducts.map(
                            (product) => (

                              <div
                                className="admin-product-card"
                                key={
                                  product.id
                                }
                              >

                                {/* PRODUCT IMAGE */}

                                <div className="admin-product-visual">

                                  {product.image ? (

                                    <img
                                      src={getImageUrl(
                                        product.image
                                      )}
                                      alt={
                                        product.name
                                      }
                                      onError={(e) => {

                                        e.currentTarget.style.display =
                                          "none";

                                        const next =
                                          e.currentTarget
                                            .nextElementSibling;

                                        if (
                                          next
                                        ) {
                                          next.style.display =
                                            "flex";
                                        }

                                      }}
                                    />

                                  ) : null}

                                  <span
                                    className="admin-product-emoji"
                                    style={{
                                      display:
                                        product.image
                                          ? "none"
                                          : "flex",
                                    }}
                                  >

                                    {category ===
                                    "Dry Prawns"
                                      ? "🦐"
                                      : category ===
                                        "Combos"
                                      ? "🧺"
                                      : "🐟"}

                                  </span>

                                  {product.featured && (

                                    <div className="admin-featured-badge">
                                      Featured
                                    </div>

                                  )}

                                </div>

                                {/* PRODUCT CONTENT */}

                                <div className="admin-product-content">

                                  <span className="admin-product-category">

                                    {
                                      product.category
                                    }

                                  </span>

                                  <h3>

                                    {
                                      product.name
                                    }

                                  </h3>

                                  <div className="admin-product-price">

                                    <strong>

                                      {formatMoney(
                                        product.price
                                      )}

                                    </strong>

                                    {product.oldPrice &&
                                      Number(
                                        product.oldPrice
                                      ) >
                                        Number(
                                          product.price
                                        ) && (

                                        <del>

                                          {formatMoney(
                                            product.oldPrice
                                          )}

                                        </del>

                                      )}

                                  </div>

                                  <div className="admin-product-meta">

                                    <span>

                                      Weight:{" "}
                                      {
                                        product.weight
                                      }

                                    </span>

                                    <span
                                      className={
                                        Number(
                                          product.stock
                                        ) <= 5
                                          ? "low-stock"
                                          : ""
                                      }
                                    >

                                      Stock:{" "}
                                      {
                                        product.stock
                                      }

                                    </span>

                                  </div>

                                  {/* PRODUCT ACTIONS */}

                                  <div className="admin-product-actions">

                                    <button
                                      className="admin-edit-product"
                                      onClick={() =>
                                        openEditProduct(
                                          product
                                        )
                                      }
                                    >

                                      <Edit3
                                        size={16}
                                      />

                                      Edit

                                    </button>

                                    <button
                                      className="admin-delete-product"
                                      onClick={() =>
                                        deleteProduct(
                                          product
                                        )
                                      }
                                    >

                                      <Trash2
                                        size={16}
                                      />

                                      Delete

                                    </button>

                                  </div>

                                </div>

                              </div>

                            )
                          )}

                        </div>

                      </section>

                    );
                  }
                )}

              </>

            )}

          </section>

        )}

      </main>

      {/* =================================================
          ORDER DETAILS MODAL
      ================================================= */}

      {selectedOrder && (

        <div
          className="admin-modal-overlay"
          onClick={() =>
            setSelectedOrder(
              null
            )
          }
        >

          <div
            className="admin-order-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="admin-modal-header">

              <div>

                <span>
                  ORDER DETAILS
                </span>

                <h2>
                  {
                    selectedOrder.id
                  }
                </h2>

              </div>

              <button
                className="admin-modal-close"
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
              >

                <X
                  size={21}
                />

              </button>

            </div>

            {/* CUSTOMER DETAILS */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">

                <UserRound
                  size={18}
                />

                Customer Details

              </div>

              <div className="admin-detail-grid">

                <div>

                  <span>
                    Name
                  </span>

                  <strong>
                    {
                      selectedOrder
                        .customer
                        ?.name ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Phone
                  </span>

                  <strong>
                    {
                      selectedOrder
                        .customer
                        ?.phone ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Email
                  </span>

                  <strong>
                    {
                      selectedOrder
                        .customer
                        ?.email ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    City
                  </span>

                  <strong>
                    {
                      selectedOrder
                        .customer
                        ?.city ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    State
                  </span>

                  <strong>
                    {
                      selectedOrder
                        .customer
                        ?.state ||
                      "-"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Pincode
                  </span>

                  <strong>
                    {
                      selectedOrder
                        .customer
                        ?.pincode ||
                      "-"
                    }
                  </strong>

                </div>

              </div>

              <div className="admin-address-box">

                <span>
                  Delivery Address
                </span>

                <strong>
                  {
                    selectedOrder
                      .customer
                      ?.address ||
                    "-"
                  }
                </strong>

              </div>

              <button
                className="admin-whatsapp-button"
                onClick={() =>
                  openWhatsApp(
                    selectedOrder
                  )
                }
              >
                Contact Customer on WhatsApp
              </button>

            </div>

            {/* ORDER ITEMS */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">

                <Package
                  size={18}
                />

                Ordered Products

              </div>

              <div className="admin-items-list">

                {selectedOrder.items?.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="admin-order-item"
                      key={`${item.productId}-${index}`}
                    >

                      <div>

                        <strong>
                          {
                            item.name
                          }
                        </strong>

                        <span>

                          {
                            item.weight ||
                            ""
                          }{" "}
                          ×{" "}
                          {
                            item.quantity
                          }

                        </span>

                      </div>

                      <strong>

                        {formatMoney(
                          Number(
                            item.price ||
                              0
                          ) *
                            Number(
                              item.quantity ||
                                0
                            )
                        )}

                      </strong>

                    </div>

                  )
                )}

              </div>

              {/* TOTALS */}

              <div className="admin-total-box">

                <div>

                  <span>
                    Subtotal
                  </span>

                  <strong>
                    {formatMoney(
                      selectedOrder.subtotal
                    )}
                  </strong>

                </div>

                <div>

                  <span>
                    Delivery
                  </span>

                  <strong>
                    {formatMoney(
                      selectedOrder.deliveryCharge
                    )}
                  </strong>

                </div>

                <div className="grand-total">

                  <span>
                    Total
                  </span>

                  <strong>
                    {formatMoney(
                      selectedOrder.total
                    )}
                  </strong>

                </div>

              </div>

            </div>

            {/* PAYMENT DETAILS */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">

                ₹ Payment Details

              </div>

              <div className="admin-payment-detail">

                <div>

                  <span>
                    Payment Method
                  </span>

                  <strong>
                    {
                      selectedOrder.paymentMethod ||
                      "UPI"
                    }
                  </strong>

                </div>

                <div>

                  <span>
                    Amount
                  </span>

                  <strong>
                    {formatMoney(
                      selectedOrder.total
                    )}
                  </strong>

                </div>

              </div>

              <div className="admin-payment-warning">

                UPI payment is customer-confirmed at checkout.
                Automatic payment verification is not connected yet.
                Please verify the payment manually before dispatching.

              </div>

            </div>

            {/* ORDER STATUS */}

            <div className="admin-modal-section">

              <div className="admin-modal-section-title">

                <Truck
                  size={18}
                />

                Order Status

              </div>

              <select
                className={`admin-modal-status-select ${getStatusClass(
                  selectedOrder.status
                )}`}
                value={
                  selectedOrder.status ||
                  "Order Placed"
                }
                disabled={
                  updatingOrder ===
                  selectedOrder.id
                }
                onChange={(e) =>
                  updateStatus(
                    selectedOrder.id,
                    e.target.value
                  )
                }
              >

                {STATUS_OPTIONS.map(
                  (status) => (

                    <option
                      key={
                        status
                      }
                      value={
                        status
                      }
                    >
                      {
                        status
                      }
                    </option>

                  )
                )}

              </select>

            </div>

            {/* TIMELINE */}

            {selectedOrder.timeline
              ?.length > 0 && (

              <div className="admin-modal-section">

                <div className="admin-modal-section-title">

                  <Clock3
                    size={18}
                  />

                  Order Timeline

                </div>

                <div className="admin-timeline">

                  {selectedOrder.timeline.map(
                    (
                      entry,
                      index
                    ) => (

                      <div
                        className="admin-timeline-item"
                        key={
                          index
                        }
                      >

                        <div className="admin-timeline-dot" />

                        <div>

                          <strong>
                            {
                              entry.status ||
                              entry.title ||
                              "Update"
                            }
                          </strong>

                          <span>

                            {formatDate(
                              entry.date ||
                                entry.createdAt ||
                                entry.time
                            )}

                          </span>

                        </div>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </div>

        </div>

      )}

      {/* =================================================
          ADD / EDIT PRODUCT MODAL
      ================================================= */}

      {showProductModal && (

        <div
          className="admin-modal-overlay"
          onClick={() => {

            if (
              !savingProduct &&
              !uploadingImage
            ) {

              setShowProductModal(
                false
              );

              resetProductForm();

            }

          }}
        >

          <div
            className="admin-product-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div className="admin-modal-header">

              <div>

                <span>
                  STORE MANAGEMENT
                </span>

                <h2>

                  {editingProduct
                    ? "Edit Product"
                    : "Add New Product"}

                </h2>

              </div>

              <button
                className="admin-modal-close"
                disabled={
                  savingProduct ||
                  uploadingImage
                }
                onClick={() => {

                  setShowProductModal(
                    false
                  );

                  resetProductForm();

                }}
              >

                <X
                  size={21}
                />

              </button>

            </div>

            {/* FORM */}

            <form
              className="admin-product-form"
              onSubmit={
                saveProduct
              }
            >

              {/* PRODUCT IMAGE */}

              <div className="admin-image-upload-section">

                <label>
                  Product Image
                </label>

                <div className="admin-image-upload-box">

                  {productImagePreview ? (

                    <img
                      src={
                        productImagePreview
                      }
                      alt="Product preview"
                      className="admin-product-image-preview"
                    />

                  ) : (

                    <div className="admin-no-image">

                      <ImagePlus
                        size={40}
                      />

                      <span>
                        No product image
                      </span>

                    </div>

                  )}

                  <label
                    className="admin-change-image-button"
                  >

                    <ImagePlus
                      size={17}
                    />

                    {productImage
                      ? "Change Image"
                      : "Choose Image"}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={
                        handleImageChange
                      }
                      hidden
                    />

                  </label>

                  <small>
                    JPG, PNG or WEBP • Max 5MB
                  </small>

                </div>

              </div>

              {/* FORM GRID */}

              <div className="admin-form-grid">

                {/* NAME */}

                <div className="admin-form-field full">

                  <label>
                    Product Name *
                  </label>

                  <input
                    type="text"
                    placeholder="Example: Premium Nethallu"
                    value={
                      productForm.name
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "name",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* CATEGORY */}

                <div className="admin-form-field">

                  <label>
                    Category *
                  </label>

                  <select
                    value={
                      productForm.category
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "category",
                        e.target.value
                      )
                    }
                  >

                    {CATEGORY_OPTIONS.map(
                      (category) => (

                        <option
                          key={
                            category
                          }
                          value={
                            category
                          }
                        >
                          {
                            category
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* WEIGHT */}

                <div className="admin-form-field">

                  <label>
                    Weight *
                  </label>

                  <select
                    value={
                      productForm.weight
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "weight",
                        e.target.value
                      )
                    }
                  >

                    {WEIGHT_OPTIONS.map(
                      (weight) => (

                        <option
                          key={
                            weight
                          }
                          value={
                            weight
                          }
                        >
                          {
                            weight
                          }
                        </option>

                      )
                    )}

                  </select>

                </div>

                {/* PRICE */}

                <div className="admin-form-field">

                  <label>
                    Selling Price *
                  </label>

                  <input
                    type="number"
                    min="1"
                    placeholder="499"
                    value={
                      productForm.price
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "price",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* OLD PRICE */}

                <div className="admin-form-field">

                  <label>
                    Old Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="699"
                    value={
                      productForm.oldPrice
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "oldPrice",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* STOCK */}

                <div className="admin-form-field">

                  <label>
                    Stock *
                  </label>

                  <input
                    type="number"
                    min="0"
                    placeholder="25"
                    value={
                      productForm.stock
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "stock",
                        e.target.value
                      )
                    }
                  />

                </div>

                {/* DESCRIPTION */}

                <div className="admin-form-field full">

                  <label>
                    Description
                  </label>

                  <textarea
                    rows="4"
                    placeholder="Enter product description..."
                    value={
                      productForm.description
                    }
                    onChange={(e) =>
                      handleProductChange(
                        "description",
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              {/* FEATURED */}

              <label className="admin-featured-checkbox">

                <input
                  type="checkbox"
                  checked={
                    productForm.featured
                  }
                  onChange={(e) =>
                    handleProductChange(
                      "featured",
                      e.target.checked
                    )
                  }
                />

                <span>
                  Show this product as Featured / Best Seller
                </span>

              </label>

              {/* FORM ACTIONS */}

              <div className="admin-product-form-actions">

                <button
                  type="button"
                  className="admin-cancel-button"
                  disabled={
                    savingProduct ||
                    uploadingImage
                  }
                  onClick={() => {

                    setShowProductModal(
                      false
                    );

                    resetProductForm();

                  }}
                >

                  Cancel

                </button>

                <button
                  type="submit"
                  className="admin-save-product-button"
                  disabled={
                    savingProduct ||
                    uploadingImage
                  }
                >

                  {editingProduct ? (

                    <Edit3
                      size={18}
                    />

                  ) : (

                    <Plus
                      size={18}
                    />

                  )}

                  {uploadingImage
                    ? "Uploading Image..."
                    : savingProduct
                    ? "Saving..."
                    : editingProduct
                    ? "Save Changes"
                    : "Add Product"}

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}