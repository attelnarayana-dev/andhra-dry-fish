import express from "express";
import cors from "cors";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

/* =========================
   APP CONFIG
========================= */

app.use(cors());
app.use(express.json());

/* =========================
   PATHS
========================= */

const DATA_FILE = path.join(__dirname, "data.json");

const UPLOADS_DIR = path.join(
  __dirname,
  "uploads",
  "products"
);

/* Create upload directory */
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, {
    recursive: true
  });
}

/* =========================
   SERVE UPLOADED IMAGES
========================= */

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

/* =========================
   ADMIN LOGIN
========================= */

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "ADF@2026";

/* =========================
   MULTER IMAGE UPLOAD
========================= */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },

  filename: (req, file, cb) => {
    const extension =
      path.extname(file.originalname).toLowerCase();

    const safeName =
      `${Date.now()}-${Math.round(
        Math.random() * 1000000000
      )}${extension}`;

    cb(null, safeName);
  }
});

const upload = multer({
  storage,

  limits: {
    fileSize: 5 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only JPG, JPEG, PNG and WEBP images are allowed"
        )
      );
    }
  }
});

/* =========================
   DEFAULT PRODUCTS
========================= */

const products = [
  {
    id: "ADF001",
    name: "Premium Nethallu",
    category: "Dry Fish",
    price: 499,
    oldPrice: 699,
    weight: "250g",
    description:
      "Premium Andhra Nethallu, naturally dried and hygienically packed.",
    image: "/images/nethallu.jpg",
    stock: 25,
    featured: true
  },

  {
    id: "ADF002",
    name: "Nethallu Big Size",
    category: "Dry Fish",
    price: 699,
    oldPrice: 899,
    weight: "500g",
    description:
      "Large-size traditional Nethallu with authentic coastal flavour.",
    image: "/images/nethallu-big.jpg",
    stock: 20,
    featured: true
  },

  {
    id: "ADF003",
    name: "Bommidayalu Dry Fish",
    category: "Dry Fish",
    price: 799,
    oldPrice: 999,
    weight: "500g",
    description:
      "Traditional Andhra Bommidayalu carefully selected and packed.",
    image: "/images/bommidayalu.jpg",
    stock: 18,
    featured: true
  },

  {
    id: "ADF004",
    name: "Korameenu Dry Fish",
    category: "Dry Fish",
    price: 999,
    oldPrice: 1299,
    weight: "500g",
    description:
      "Premium Korameenu dry fish for authentic Andhra recipes.",
    image: "/images/korameenu.jpg",
    stock: 15,
    featured: true
  },

  {
    id: "ADF005",
    name: "Savidalu",
    category: "Dry Fish",
    price: 599,
    oldPrice: 799,
    weight: "500g",
    description:
      "Traditional Savidalu with rich coastal taste.",
    image: "/images/savidalu.jpg",
    stock: 30,
    featured: false
  },

  {
    id: "ADF006",
    name: "Jalalu Dry Fish",
    category: "Dry Fish",
    price: 649,
    oldPrice: 849,
    weight: "500g",
    description:
      "Classic Andhra dry fish, naturally dried and hygienically packed.",
    image: "/images/jalalu.jpg",
    stock: 22,
    featured: false
  },

  {
    id: "ADF007",
    name: "Premium Dry Prawns",
    category: "Dry Prawns",
    price: 1199,
    oldPrice: 1499,
    weight: "500g",
    description:
      "Premium large dry prawns perfect for Andhra-style recipes.",
    image: "/images/dry-prawns.jpg",
    stock: 20,
    featured: true
  },

  {
    id: "ADF008",
    name: "White Dry Prawns",
    category: "Dry Prawns",
    price: 899,
    oldPrice: 1099,
    weight: "250g",
    description:
      "Cleaned premium white dry prawns with natural flavour.",
    image: "/images/white-prawns.jpg",
    stock: 25,
    featured: true
  },

  {
    id: "ADF009",
    name: "Small Dry Prawns",
    category: "Dry Prawns",
    price: 599,
    oldPrice: 749,
    weight: "250g",
    description:
      "Perfect for chutney, fry and traditional Andhra recipes.",
    image: "/images/small-prawns.jpg",
    stock: 35,
    featured: false
  },

  {
    id: "ADF010",
    name: "Andhra Special Combo",
    category: "Combos",
    price: 1499,
    oldPrice: 1999,
    weight: "1kg",
    description:
      "Customer favourite combination of premium Andhra dry fish.",
    image: "/images/combo.jpg",
    stock: 10,
    featured: true
  }
];

/* =========================
   DATABASE
========================= */

function loadDatabase() {
  if (!fs.existsSync(DATA_FILE)) {
    const database = {
      products,
      orders: []
    };

    fs.writeFileSync(
      DATA_FILE,
      JSON.stringify(database, null, 2)
    );
  }

  const database = JSON.parse(
    fs.readFileSync(DATA_FILE, "utf8")
  );

  /* Safety for old data */
  if (!Array.isArray(database.products)) {
    database.products = [];
  }

  if (!Array.isArray(database.orders)) {
    database.orders = [];
  }

  return database;
}

function saveDatabase(database) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(database, null, 2)
  );
}

/* =========================
   ADMIN AUTH
========================= */

function adminAuth(req, res, next) {
  const username =
    req.headers["x-admin-username"];

  const password =
    req.headers["x-admin-password"];

  if (
    username !== ADMIN_USERNAME ||
    password !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized admin access"
    });
  }

  next();
}

/* =========================
   BASIC
========================= */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Andhra Dry Fish API is running"
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    service: "Andhra Dry Fish API"
  });
});

/* =========================
   ADMIN LOGIN
========================= */

app.post("/api/admin/login", (req, res) => {
  const {
    username,
    password
  } = req.body;

  if (
    username === ADMIN_USERNAME &&
    password === ADMIN_PASSWORD
  ) {
    return res.json({
      success: true,
      message:
        "Admin login successful",

      admin: {
        username: ADMIN_USERNAME,
        name: "Andhra Dry Fish Admin"
      }
    });
  }

  res.status(401).json({
    success: false,
    message:
      "Invalid username or password"
  });
});

/* =========================
   GET PRODUCTS
========================= */

app.get("/api/products", (req, res) => {
  const database = loadDatabase();

  let result = database.products;

  if (req.query.category) {
    result = result.filter(
      product =>
        product.category.toLowerCase() ===
        req.query.category.toLowerCase()
    );
  }

  if (req.query.search) {
    const keyword =
      req.query.search.toLowerCase();

    result = result.filter(product =>
      `${product.name} ${product.category} ${product.description}`
        .toLowerCase()
        .includes(keyword)
    );
  }

  if (req.query.featured === "true") {
    result = result.filter(
      product => product.featured
    );
  }

  res.json({
    success: true,
    count: result.length,
    products: result
  });
});

/* =========================
   GET SINGLE PRODUCT
========================= */

app.get(
  "/api/products/:id",
  (req, res) => {
    const database = loadDatabase();

    const product =
      database.products.find(
        product =>
          product.id === req.params.id
      );

    if (!product) {
      return res.status(404).json({
        success: false,
        message:
          "Product not found"
      });
    }

    res.json({
      success: true,
      product
    });
  }
);

/* =========================
   CATEGORIES
========================= */

app.get(
  "/api/categories",
  (req, res) => {
    const database = loadDatabase();

    const categories = [
      ...new Set(
        database.products.map(
          product => product.category
        )
      )
    ];

    res.json({
      success: true,
      categories
    });
  }
);

/* =========================
   CUSTOMER ORDERS
========================= */

app.post(
  "/api/orders",
  (req, res) => {
    try {
      const database =
        loadDatabase();

      const {
        customer,
        items
      } = req.body;

      if (
        !customer?.name ||
        !customer?.phone
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Customer name and phone are required"
        });
      }

      if (!customer.address) {
        return res.status(400).json({
          success: false,
          message:
            "Delivery address is required"
        });
      }

      if (
        !items ||
        !items.length
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Cart is empty"
        });
      }

      let subtotal = 0;

      const orderItems =
        items.map(item => {
          const product =
            database.products.find(
              p =>
                p.id ===
                item.productId
            );

          if (!product) {
            throw new Error(
              `Product ${item.productId} not found`
            );
          }

          const quantity =
            Number(item.quantity) ||
            1;

          subtotal +=
            product.price *
            quantity;

          return {
            productId:
              product.id,
            name:
              product.name,
            price:
              product.price,
            weight:
              product.weight,
            quantity
          };
        });

      const deliveryCharge =
        subtotal >= 999
          ? 0
          : 99;

      const total =
        subtotal +
        deliveryCharge;

      const now =
        new Date().toISOString();

      const order = {
        id:
          `ADF-${Date.now()}`,

        createdAt: now,

        customer,

        items:
          orderItems,

        subtotal,

        deliveryCharge,

        total,

        paymentMethod:
          "UPI",

        status:
          "Order Placed",

        timeline: [
          {
            status:
              "Order Placed",
            date: now
          }
        ]
      };

      database.orders.unshift(
        order
      );

      saveDatabase(database);

      res.status(201).json({
        success: true,
        message:
          "Order placed successfully",
        order
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

/* =========================
   GET ORDER
========================= */

app.get(
  "/api/orders/:orderId",
  (req, res) => {
    const database =
      loadDatabase();

    const order =
      database.orders.find(
        order =>
          order.id ===
          req.params.orderId
      );

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found"
      });
    }

    res.json({
      success: true,
      order
    });
  }
);

/* =========================
   ADMIN ORDERS
========================= */

app.get(
  "/api/admin/orders",
  adminAuth,
  (req, res) => {
    const database =
      loadDatabase();

    res.json({
      success: true,
      count:
        database.orders.length,
      orders:
        database.orders
    });
  }
);

/* =========================
   ADMIN ORDER STATUS
========================= */

app.patch("/api/admin/orders/:orderId", adminAuth, (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Order Placed",
      "Payment Confirmed",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status",
      });
    }

    const data = readData();

    const orderIndex = data.orders.findIndex(
      (order) => order.orderId === orderId
    );

    if (orderIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    data.orders[orderIndex].status = status;
    data.orders[orderIndex].updatedAt = new Date().toISOString();

    writeData(data);

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order: data.orders[orderIndex],
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update order status",
    });
  }
});

/* =========================================================
   ADMIN PRODUCTS
========================================================= */

/* =========================
   CREATE PRODUCT
========================= */

app.post(
  "/api/admin/products",
  adminAuth,
  (req, res) => {
    try {
      const database =
        loadDatabase();

      const price =
        Number(req.body.price);

      const oldPrice =
        Number(
          req.body.oldPrice ||
          price
        );

      const product = {
        id:
          `ADF${Date.now()}`,

        name:
          String(
            req.body.name || ""
          ).trim(),

        category:
          String(
            req.body.category ||
              "Dry Fish"
          ).trim(),

        price,

        oldPrice,

        weight:
          req.body.weight ||
          "500g",

        description:
          req.body.description ||
          "",

        image:
          req.body.image ||
          "/images/default.jpg",

        stock:
          Number(
            req.body.stock || 0
          ),

        featured:
          req.body.featured === true ||
          req.body.featured === "true"
      };

      if (
        !product.name ||
        !product.category ||
        !product.price ||
        product.price <= 0
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Name, category and valid price are required"
        });
      }

      database.products.push(
        product
      );

      saveDatabase(database);

      res.status(201).json({
        success: true,
        message:
          "Product created",
        product
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

/* =========================
   EDIT PRODUCT
========================= */

app.patch(
  "/api/admin/products/:id",
  adminAuth,
  (req, res) => {
    try {
      const database =
        loadDatabase();

      const product =
        database.products.find(
          product =>
            product.id ===
            req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found"
        });
      }

      if (
        req.body.name !==
        undefined
      ) {
        product.name =
          String(
            req.body.name
          ).trim();
      }

      if (
        req.body.category !==
        undefined
      ) {
        product.category =
          String(
            req.body.category
          ).trim();
      }

      if (
        req.body.price !==
        undefined
      ) {
        const price =
          Number(
            req.body.price
          );

        if (
          !Number.isFinite(price) ||
          price <= 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid product price"
          });
        }

        product.price =
          price;
      }

      if (
        req.body.oldPrice !==
        undefined
      ) {
        const oldPrice =
          Number(
            req.body.oldPrice
          );

        if (
          !Number.isFinite(
            oldPrice
          ) ||
          oldPrice < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid old price"
          });
        }

        product.oldPrice =
          oldPrice;
      }

      if (
        req.body.weight !==
        undefined
      ) {
        product.weight =
          req.body.weight;
      }

      if (
        req.body.description !==
        undefined
      ) {
        product.description =
          req.body.description;
      }

      if (
        req.body.stock !==
        undefined
      ) {
        const stock =
          Number(
            req.body.stock
          );

        if (
          !Number.isFinite(
            stock
          ) ||
          stock < 0
        ) {
          return res.status(400).json({
            success: false,
            message:
              "Invalid stock"
          });
        }

        product.stock =
          stock;
      }

      if (
        req.body.featured !==
        undefined
      ) {
        product.featured =
          req.body.featured ===
            true ||
          req.body.featured ===
            "true";
      }

      if (
        req.body.image !==
        undefined &&
        req.body.image
      ) {
        product.image =
          req.body.image;
      }

      saveDatabase(database);

      res.json({
        success: true,
        message:
          "Product updated successfully",
        product
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

/* =========================
   UPLOAD PRODUCT IMAGE
========================= */

app.post(
  "/api/admin/products/:id/image",
  adminAuth,
  upload.single("image"),
  (req, res) => {
    try {
      const database =
        loadDatabase();

      const product =
        database.products.find(
          product =>
            product.id ===
            req.params.id
        );

      if (!product) {
        if (req.file) {
          fs.unlinkSync(
            req.file.path
          );
        }

        return res.status(404).json({
          success: false,
          message:
            "Product not found"
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Product image is required"
        });
      }

      /* Delete previous uploaded image */
      if (
        product.image &&
        product.image.startsWith(
          "/uploads/products/"
        )
      ) {
        const oldFileName =
          path.basename(
            product.image
          );

        const oldFilePath =
          path.join(
            UPLOADS_DIR,
            oldFileName
          );

        if (
          fs.existsSync(
            oldFilePath
          )
        ) {
          fs.unlinkSync(
            oldFilePath
          );
        }
      }

      const imageUrl =
        `/uploads/products/${req.file.filename}`;

      product.image =
        imageUrl;

      saveDatabase(database);

      res.json({
        success: true,
        message:
          "Product image uploaded successfully",
        image:
          imageUrl,
        product
      });

    } catch (error) {
      if (req.file) {
        try {
          fs.unlinkSync(
            req.file.path
          );
        } catch {}
      }

      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

/* =========================
   DELETE PRODUCT
========================= */

app.delete(
  "/api/admin/products/:id",
  adminAuth,
  (req, res) => {
    try {
      const database =
        loadDatabase();

      const product =
        database.products.find(
          product =>
            product.id ===
            req.params.id
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message:
            "Product not found"
        });
      }

      /* Delete uploaded image */
      if (
        product.image &&
        product.image.startsWith(
          "/uploads/products/"
        )
      ) {
        const fileName =
          path.basename(
            product.image
          );

        const filePath =
          path.join(
            UPLOADS_DIR,
            fileName
          );

        if (
          fs.existsSync(filePath)
        ) {
          fs.unlinkSync(
            filePath
          );
        }
      }

      database.products =
        database.products.filter(
          product =>
            product.id !==
            req.params.id
        );

      saveDatabase(database);

      res.json({
        success: true,
        message:
          "Product deleted successfully"
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message
      });
    }
  }
);

/* =========================
   MULTER ERROR HANDLER
========================= */

app.use(
  (
    error,
    req,
    res,
    next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Image size must be 5MB or less"
        });
      }

      return res.status(400).json({
        success: false,
        message:
          error.message
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message:
          error.message
      });
    }

    next();
  }
);

/* =========================
   START SERVER
========================= */

loadDatabase();

app.listen(
  PORT,
  () => {
    console.log("");
    console.log(
      "======================================"
    );
    console.log(
      "🐟 ANDHRA DRY FISH API"
    );
    console.log(
      "======================================"
    );
    console.log(
      `🚀 Server: http://localhost:${PORT}`
    );
    console.log(
      `❤️ Health: http://localhost:${PORT}/api/health`
    );
    console.log(
      `🐟 Products: http://localhost:${PORT}/api/products`
    );
    console.log(
      "🔐 Admin: /api/admin/login"
    );
    console.log(
      "🖼️ Uploads: /uploads/products/"
    );
    console.log(
      "======================================"
    );
    console.log("");
  }
);