import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";
import "./admin/admin.css";
import { createRoot } from "react-dom/client";
import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Mail,
  MapPin,
  Menu,
  Minus,
  Package,
  Phone,
  Plus,
  Search,
  ShoppingBag,
  ShoppingCart,
  Truck,
  User,
  X,
} from "lucide-react";
import "./style.css";

const BACKEND_URL = "https://andhra-dry-fish.onrender.com";
const API = "https://andhra-dry-fish.onrender.com/api";

const UPI_ID = "attelnarayana@okhdfcbank";
const UPI_NAME = "Andhra Dry Fish";

const demoVisuals = {
  ADF001: "🐟",
  ADF002: "🐟",
  ADF003: "🐠",
  ADF004: "🐟",
  ADF005: "🦑",
  ADF006: "🐟",
  ADF007: "🦐",
  ADF008: "🦐",
  ADF009: "🦐",
  ADF010: "🧺",
};

/* =========================================================
   PRODUCT IMAGE HELPER
========================================================= */

function getProductImage(image) {
  if (!image) return "";

  if (
    image.startsWith("http://") ||
    image.startsWith("https://")
  ) {
    return image;
  }

  if (image.startsWith("/uploads/")) {
    return `${BACKEND_URL}${image}`;
  }

  return image;
}

/* =========================================================
   APP
========================================================= */

function App() {
  const isAdminPage =
    window.location.pathname === "/admin";

  if (isAdminPage) {
    const adminLoggedIn =
      localStorage.getItem("adf_admin");

    if (!adminLoggedIn) {
      return (
        <AdminLogin
          onLogin={() => {
            window.location.reload();
          }}
        />
      );
    }

    return (
      <AdminDashboard
        onLogout={() => {
          localStorage.removeItem("adf_admin");
          window.location.href = "/";
        }}
      />
    );
  }

  const [page, setPage] = useState("home");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] =
    useState(null);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [menuOpen, setMenuOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [trackingOrder, setTrackingOrder] = useState(null);

  useEffect(() => {
    fetch(`${API}/products`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.products || []);
        }
      })
      .catch((err) => {
        console.error("Products error:", err);
      });
  }, []);

  const categories = [
    "All",
    "Dry Fish",
    "Dry Prawns",
    "Combos",
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "All" ||
        product.category === category;

      const q = search.toLowerCase().trim();

      const matchesSearch =
        !q ||
        product.name?.toLowerCase().includes(q) ||
        product.category?.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, category, search]);

  const featuredProducts = products.filter(
    (p) => p.featured
  );

  const cartCount = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const addToCart = (product, quantity = 1) => {
    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity:
                  item.quantity + quantity,
                image:
                  product.image || item.image,
              }
            : item
        );
      }

      return [
        ...current,
        {
          ...product,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart((current) =>
        current.filter((item) => item.id !== id)
      );
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  };

  const openProduct = (product) => {
    setSelectedProduct(product);
    setPage("product");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const goTo = (target) => {
    setPage(target);
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openCategory = (value) => {
    setCategory(value);
    setPage("shop");
    setMenuOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="app">
      {/* TOP BAR */}

      <div className="topbar">
        <div className="container topbar-inner">
          <span>
            🇮🇳 Pan India Delivery Available
          </span>

          <span>
            Authentic Andhra Coastal Taste
          </span>

          <span>
            UPI QR Payment Available
          </span>
        </div>
      </div>

      {/* HEADER */}

      <header className="header">
        <div className="container header-inner">
          <button
            className="mobile-menu"
            onClick={() =>
              setMenuOpen((v) => !v)
            }
            aria-label="Open menu"
          >
            {menuOpen ? (
              <X size={24} />
            ) : (
              <Menu size={24} />
            )}
          </button>

          <button
            className="logo"
            onClick={() => goTo("home")}
          >
            <span className="logo-icon">
              🐟
            </span>

            <span>
              <strong>ANDHRA</strong>
              <small>DRY FISH</small>
            </span>
          </button>

          <nav
            className={`nav ${
              menuOpen ? "nav-open" : ""
            }`}
          >
            <button
              onClick={() => goTo("home")}
            >
              Home
            </button>

            <button
              onClick={() =>
                openCategory("Dry Fish")
              }
            >
              Dry Fish
            </button>

            <button
              onClick={() =>
                openCategory("Dry Prawns")
              }
            >
              Dry Prawns
            </button>

            <button
              onClick={() =>
                openCategory("Combos")
              }
            >
              Combos
            </button>

            <button
              onClick={() => goTo("about")}
            >
              About Us
            </button>

            <button
              onClick={() => goTo("contact")}
            >
              Contact
            </button>
            <button
  onClick={() => goTo("track-order")}
>
  Track Order
</button>
          </nav>

          <div className="header-actions">
            <div className="search-box">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    goTo("shop");
                  }
                }}
                placeholder="Search products..."
              />
            </div>

            <button
              className="icon-button"
              onClick={() => goTo("shop")}
            >
              <User size={21} />
            </button>

            <button
              className="cart-button"
              onClick={() => goTo("cart")}
              aria-label="Cart"
            >
              <ShoppingCart size={22} />

              {cartCount > 0 && (
                <span>{cartCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        {page === "home" && (
          <Home
            products={featuredProducts}
            openProduct={openProduct}
            openCategory={openCategory}
            goTo={goTo}
          />
        )}

        {page === "shop" && (
          <Shop
            products={filteredProducts}
            category={category}
            setCategory={setCategory}
            search={search}
            setSearch={setSearch}
            openProduct={openProduct}
          />
        )}

        {page === "product" &&
          selectedProduct && (
            <ProductDetails
              product={selectedProduct}
              addToCart={addToCart}
              goTo={goTo}
            />
          )}

        {page === "cart" && (
          <Cart
            cart={cart}
            updateQuantity={updateQuantity}
            goTo={goTo}
            setCart={setCart}
          />
        )}

        {page === "checkout" && (
          <Checkout
            cart={cart}
            setCart={setCart}
            setOrder={setOrder}
            goTo={goTo}
          />
        )}

        {page === "success" && (
          <OrderSuccess
            order={order}
            goTo={goTo}
            setTrackingOrder={setTrackingOrder}
          />
        )}
        {page === "track-order" && (
  <TrackOrder
    trackingOrder={trackingOrder}
    setTrackingOrder={setTrackingOrder}
    goTo={goTo}
  />
)}

        {page === "about" && <About />}

        {page === "contact" && <Contact />}
      </main>

      <Footer
        goTo={goTo}
        openCategory={openCategory}
      />
    </div>
  );
}

/* =========================================================
   HOME
========================================================= */

function Home({
  products,
  openProduct,
  openCategory,
  goTo,
}) {
  return (
    <>
      <section className="hero">
        <div className="hero-overlay" />

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              AUTHENTIC ANDHRA TASTE
            </span>

            <h1>
              అసలైన ఆంధ్ర
              <br />
              <span>ఎండు చేపల రుచి</span>
            </h1>

            <p>
              Premium sun-dried fish & prawns,
              carefully selected and hygienically
              packed for your family.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() =>
                  openCategory("Dry Fish")
                }
              >
                Shop Dry Fish
                <ArrowRight size={18} />
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  openCategory("Dry Prawns")
                }
              >
                Explore Dry Prawns
              </button>
            </div>

            <div className="hero-trust">
              <span>
                <Check size={15} />
                Quality Checked
              </span>

              <span>
                <Check size={15} />
                Hygienically Packed
              </span>

              <span>
                <Check size={15} />
                Pan India Delivery
              </span>
            </div>
          </div>

          <div className="hero-product">
            <div className="hero-fish-circle">

  {/* =====================================================
      🌊 OCEAN WATER
      ===================================================== */}

  <div className="ocean-water">

    <svg
      className="ocean-waves"
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
      aria-hidden="true"
    >

      {/* Deep water */}
      <rect
        x="0"
        y="0"
        width="600"
        height="600"
        fill="#0879b8"
      />

      {/* Back wave */}
      <path
        className="ocean-wave ocean-wave-back"
        d="
          M-100 360
          C0 300 80 330 160 370
          C250 415 330 405 410 350
          C500 290 570 315 700 365
          L700 700
          L-100 700
          Z
        "
        fill="#0ea5e9"
      />

      {/* Middle wave */}
      <path
        className="ocean-wave ocean-wave-middle"
        d="
          M-100 400
          C10 335 90 365 175 410
          C270 460 350 445 430 390
          C520 330 590 355 700 405
          L700 700
          L-100 700
          Z
        "
        fill="#0284c7"
      />

      {/* Front wave */}
      <path
        className="ocean-wave ocean-wave-front"
        d="
          M-100 450
          C0 390 90 420 170 465
          C260 515 350 500 435 445
          C525 390 600 410 700 460
          L700 700
          L-100 700
          Z
        "
        fill="#0369a1"
      />

      {/* White wave foam */}
      <path
        className="ocean-foam ocean-foam-one"
        d="
          M-100 395
          C0 335 85 365 175 410
          C265 455 350 445 430 390
          C520 335 600 355 700 405
        "
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Second foam */}
      <path
        className="ocean-foam ocean-foam-two"
        d="
          M-100 450
          C0 395 90 420 175 465
          C270 510 350 500 435 445
          C525 395 600 415 700 460
        "
        fill="none"
        stroke="rgba(255,255,255,0.30)"
        strokeWidth="6"
        strokeLinecap="round"
      />

    </svg>

    {/* Moving sunlight reflection */}
    <div className="ocean-light"></div>

  </div>


  {/* =====================================================
      🐟 FISH
      ===================================================== */}

  <div className="hero-fish">
    🐟
  </div>


  {/* =====================================================
      🦐 PRAWN
      ===================================================== */}

  <div className="hero-prawn">
    🦐
  </div>

</div>
            <div className="hero-badge">
              <strong>100%</strong>

              <span>
                Natural
                <br />
                Sun Dried
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container features-grid">
          <Feature
            icon={<SunIcon />}
            title="Naturally Sun Dried"
            text="Traditional drying process for authentic taste."
          />

          <Feature
            icon={<Package />}
            title="Hygienically Packed"
            text="Freshly packed to preserve quality and flavour."
          />

          <Feature
            icon={<Truck />}
            title="Pan India Shipping"
            text="We deliver Andhra taste right to your doorstep."
          />

          <Feature
            icon={<Check />}
            title="Quality Products"
            text="Carefully selected premium seafood products."
          />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="SHOP BY CATEGORY"
            title="Taste the Best of Andhra"
            text="Traditional coastal flavours, packed with care."
          />

          <div className="category-grid">
            <CategoryCard
              icon="🐟"
              title="Premium Dry Fish"
              text="Authentic Andhra sun-dried fish."
              onClick={() =>
                openCategory("Dry Fish")
              }
            />

            <CategoryCard
              icon="🦐"
              title="Dry Prawns"
              text="Premium dried prawns with rich flavour."
              onClick={() =>
                openCategory("Dry Prawns")
              }
            />

            <CategoryCard
              icon="🧺"
              title="Special Combos"
              text="Best value combinations for your family."
              onClick={() =>
                openCategory("Combos")
              }
            />
          </div>
        </div>
      </section>

      <section className="section section-soft">
        <div className="container">
          <SectionHeading
            eyebrow="BEST SELLERS"
            title="Our Most Loved Products"
            text="Popular choices from Andhra seafood lovers."
          />

          <ProductGrid
            products={products}
            openProduct={openProduct}
            limit={12}
          />

          <div className="center-button">
            <button
              className="outline-button"
              onClick={() => goTo("shop")}
            >
              View All Products
              <ArrowRight size={50} />
            </button>
          </div>
        </div>
      </section>

      <section className="story-banner">
        <div className="container story-grid">
          <div className="story-visual">
            <div className="story-circle">
              <span>🌊</span>
              <strong>ANDHRA</strong>
              <small>COASTAL</small>
            </div>
          </div>

          <div className="story-content">
            <span className="eyebrow">
              FROM OUR COAST TO YOUR HOME
            </span>

            <h2>
              సంప్రదాయ రుచిని
              <br />
              <span>
                మీ ఇంటికి తీసుకువస్తున్నాం
              </span>
            </h2>

            <p>
              Andhra coastal cuisine is famous
              for its bold flavours, traditional
              recipes and delicious seafood. Our
              mission is to bring that authentic
              taste to families across India.
            </p>

            <button
              className="primary-button"
              onClick={() => goTo("about")}
            >
              Our Story
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="WHY ANDHRA DRY FISH?"
            title="Authentic. Traditional. Delicious."
            text="Everything you need for the perfect Andhra seafood experience."
          />

          <div className="why-grid">
            <div className="why-card">
              <span>🌞</span>
              <h3>Traditional Drying</h3>
              <p>
                Natural drying inspired by
                traditional Andhra coastal methods.
              </p>
            </div>

            <div className="why-card">
              <span>🧂</span>
              <h3>Perfectly Prepared</h3>
              <p>
                Prepared with attention to flavour,
                texture and freshness.
              </p>
            </div>

            <div className="why-card">
              <span>📦</span>
              <h3>Fresh Packing</h3>
              <p>
                Products are packed carefully to
                help maintain their quality.
              </p>
            </div>

            <div className="why-card">
              <span>❤️</span>
              <h3>Made With Care</h3>
              <p>
                We want every order to taste like
                a meal from home.
              </p>
            </div>
          </div>
        </div>
      </section>
      
            

      
      <CustomerReviews />
      <section className="faq-section">
        <div className="container faq-container">
          <SectionHeading
            eyebrow="FAQ"
            title="Frequently Asked Questions"
            text="Quick answers before you order."
          />

          <div className="faq-list">
            <Faq
              question="Do you deliver across India?"
              answer="Yes. We offer Pan India delivery. Delivery availability and time may vary by location."
            />

            <Faq
              question="How can I pay?"
              answer="We currently accept UPI payments. Scan the QR code at checkout using Google Pay, PhonePe, Paytm, BHIM or another UPI app."
            />

            <Faq
              question="What pack sizes are available?"
              answer="Our products are available in different pack sizes including 250g, 500g and 1kg depending on the product."
            />

            <Faq
              question="How should I store dry fish?"
              answer="Keep the pack sealed and store it in a cool, dry place. Refrigeration is recommended after opening."
            />
          </div>
        </div>
      </section>
    </>
  );
}
/* =========================================================
   CUSTOMER REVIEWS
========================================================= */

function CustomerReviews() {
  const reviews = [
    ["Ravi", "Vijayawada", "Dry fish quality చాలా బాగుంది. Taste కూడా super ga ఉంది."],
    ["Priya", "Hyderabad", "Very good quality and neat packing. Definitely ordering again."],
    ["Suresh", "Guntur", "చాలా fresh గా pack చేసి పంపించారు. ఇంట్లో అందరికీ నచ్చింది."],
    ["Lakshmi", "Chennai", "Nethallu taste is excellent. Good quality for the price."],
    ["Kiran", "Nellore", "ప్యాకింగ్ చాలా బాగుంది, smell కూడా control లో ఉంది."],
    ["Anitha", "Bengaluru", "Really tasty dry prawns. Loved the quality."],
    ["Venkat", "Ongole", "ఆంధ్ర style అసలైన రుచి వచ్చింది. చాలా బాగుంది."],
    ["Rajesh", "Hyderabad", "Fast delivery and excellent packaging. Happy with my purchase."],
    ["Srinivas", "Vijayawada", "చేప quality చాలా మంచిగా ఉంది. మళ్లీ order చేస్తాను."],
    ["Kavya", "Visakhapatnam", "Premium quality dry fish. Taste was amazing."],
    ["Mahesh", "Tenali", "చాలా మంచి quality. Price కి value ఉంది."],
    ["Swathi", "Bengaluru", "Dry prawns are clean and tasty. Highly satisfied."],
    ["Ramesh", "Kakinada", "చాలా రోజుల తర్వాత మంచి dry fish దొరికింది."],
    ["Naveen", "Hyderabad", "Good taste, good packing and quick delivery."],
    ["Padma", "Guntur", "వంటలో వేసిన తర్వాత మంచి flavour వచ్చింది. Super."],
    ["Harish", "Chennai", "The prawns were very tasty and properly packed."],
    ["Uma", "Ongole", "Quality చూసి చాలా happy అయ్యాను. Repeat order definitely."],
    ["Deepak", "Bengaluru", "Authentic Andhra taste. Exactly what I was looking for."],
    ["Jyothi", "Nellore", "చాలా neat packing. Product కూడా మంచి condition లో వచ్చింది."],
    ["Prasad", "Vijayawada", "Excellent product and very good taste."],
    ["Sandhya", "Guntur", "ఇంట్లో చేసిన dry fish curry చాలా tasty గా వచ్చింది."],
    ["Arun", "Hyderabad", "Good quality at a reasonable price. Recommended."],
    ["Vani", "Rajahmundry", "Nethallu చాలా బాగున్నాయి. Size కూడా మంచి quality."],
    ["Manoj", "Visakhapatnam", "Very happy with the order. Packing was safe and clean."],
    ["Balu", "Ongole", "ఆంధ్ర coastal taste నిజంగా వచ్చింది. చాలా బాగుంది."],
    ["Rekha", "Chennai", "Dry prawns quality is really good. Will order again."],
    ["Srikanth", "Vijayawada", "చాలా tasty గా ఉన్నాయి. మా family మొత్తం enjoy చేశారు."],
    ["Neha", "Bengaluru", "Fresh stock and excellent taste. Totally satisfied."],
    ["Vamsi", "Hyderabad", "Product exactly as shown. Good experience."],
    ["Sujatha", "Guntur", "చాలా neat packing మరియు quality. Thank you."],
    ["Rohit", "Chennai", "The taste is authentic and the product quality is impressive."],
    ["Anusha", "Nellore", "చాలా clean గా ఉన్నాయి. Cooking కి చాలా బాగున్నాయి."],
    ["Satish", "Hyderabad", "Good product, good service and on-time delivery."],
    ["Bhavani", "Vijayawada", "Dry fish curryకి చాలా మంచి taste వచ్చింది."],
    ["Karthik", "Bengaluru", "I really liked the quality. Worth buying again."],
    ["Teja", "Guntur", "మా అమ్మకి చాలా నచ్చింది. మళ్లీ order చేయమన్నారు."],
    ["Rani", "Visakhapatnam", "Excellent dry prawns with good packing."],
    ["Chandu", "Ongole", "Taste చాలా authentic గా ఉంది. Highly recommended."],
    ["Pooja", "Hyderabad", "Very satisfied with the product and delivery."],
    ["Raju", "Kakinada", "చాలా మంచి quality, మంచి taste. Super product."],
    ["Sneha", "Bengaluru", "The packaging was neat and the product arrived safely."],
    ["Krishna", "Vijayawada", "చేపలు చాలా బాగున్నాయి. Curry చాలా tasty గా వచ్చింది."],
    ["Ajay", "Chennai", "Great quality and authentic Andhra flavour."],
    ["Divya", "Guntur", "Price reasonable ga ఉంది and quality excellent."],
    ["Naveena", "Hyderabad", "చాలా happy. Product quality ఊహించిన దానికంటే బాగుంది."],
    ["Rakesh", "Bengaluru", "One of the best dry fish products I have tried."],
    ["Manga", "Nellore", "Packing చాలా neat. Taste కూడా చాలా బాగుంది."],
    ["Praveen", "Visakhapatnam", "Good quality, tasty product and smooth delivery."],
    ["Srinu", "Ongole", "అసలైన ఆంధ్ర dry fish taste. Definitely repeat order."],
    ["Keerthi", "Hyderabad", "Excellent taste and quality. Very happy with my purchase."],
  ];

  return (
    <section className="reviews-section section-soft">
      <div className="container">
        <SectionHeading
          eyebrow="CUSTOMER FEEDBACK"
          title="Our Customers Love the Taste ❤️"
          text="customer feedback — authentic Andhra taste and quality."
        />

        <div className="reviews-summary">
          <div className="reviews-rating-main">
            <strong>★★★★★</strong>
            <div>
              <div className="big-stars">★★★★★</div>
              <span>Customer Feedback</span>
            </div>
          </div>

          <div className="review-stat">
            <strong>🐟</strong>
            <span>Dry Fish</span>
          </div>

          <div className="review-stat">
            <strong>🦐</strong>
            <span>Dry Prawns</span>
          </div>

          <div className="review-stat">
            <strong>📦</strong>
            <span>Carefully Packed</span>
          </div>
        </div>

        <div className="reviews-grid">
          {reviews.map(([name, location, text], index) => (
            <article
              className="review-card"
              key={`${name}-${index}`}
            >
              <div className="review-top">
                <div className="review-avatar">
                  {name.charAt(0)}
                </div>

                <div className="review-customer">
                  <strong>{name}</strong>
                  <span>📍 {location}</span>
                </div>

                <span className="review-stars">
                  ★★★★★
                </span>
              </div>

              <p>“{text}”</p>

              <div className="verified-review">
                <Check size={14} />
                
              </div>
            </article>
          ))}
        </div>

        <div className="reviews-bottom">
          <span>⭐ Authentic Andhra Taste</span>
          <span>📦 Carefully Packed</span>
          <span>🚚 Pan India Delivery</span>
        </div>
      </div>
    </section>
  );
}
/* =========================================================
   FEATURE
========================================================= */

function Feature({ icon, title, text }) {
  return (
    <div className="feature">
      <div className="feature-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <span className="sun-icon">
      ☀️
    </span>
  );
}

/* =========================================================
   CATEGORY
========================================================= */

function CategoryCard({
  icon,
  title,
  text,
  onClick,
}) {
  return (
    <button
      className="category-card"
      onClick={onClick}
    >
      <div className="category-image">
        <span>{icon}</span>
      </div>

      <div className="category-info">
        <h3>{title}</h3>
        <p>{text}</p>

        <span className="category-link">
          Shop Now
          <ArrowRight size={16} />
        </span>
      </div>
    </button>
  );
}

/* =========================================================
   SECTION HEADING
========================================================= */

function SectionHeading({
  eyebrow,
  title,
  text,
}) {
  return (
    <div className="section-heading">
      <span className="eyebrow">
        {eyebrow}
      </span>

      <h2>{title}</h2>

      {text && <p>{text}</p>}
    </div>
  );
}

/* =========================================================
   PRODUCT GRID
========================================================= */

function ProductGrid({
  products,
  openProduct,
  limit,
}) {
  const visibleProducts = limit
    ? products.slice(0, limit)
    : products;

  if (!visibleProducts.length) {
    return (
      <div className="empty-products">
        <div>🐟</div>

        <h3>Products loading...</h3>

        <p>
          Please make sure the backend is
          running on port 5000.
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {visibleProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          openProduct={openProduct}
        />
      ))}
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({
  product,
  openProduct,
}) {
  const discount =
    product.oldPrice &&
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100
        )
      : null;

  const visual =
    demoVisuals[product.id] || "🐟";

  return (
    <article className="product-card premium-product-card">
      <button
        className="product-image premium-product-image"
        onClick={() =>
          openProduct(product)
        }
        aria-label={`View ${product.name}`}
      >
        {discount && (
          <span className="discount-badge">
            {discount}% OFF
          </span>
        )}

        {product.featured && (
          <span className="featured-badge">
            BEST SELLER
          </span>
        )}

        {product.image ? (
          <img
            src={getProductImage(product.image)}
            alt={product.name}
            className="product-real-image"
            onError={(e) => {
              e.currentTarget.style.display =
                "none";

              const fallback =
                e.currentTarget.parentElement.querySelector(
                  ".product-image-fallback"
                );

              if (fallback) {
                fallback.style.display =
                  "flex";
              }
            }}
          />
        ) : null}

        <span
          className="product-emoji premium-product-emoji product-image-fallback"
          style={{
            display: product.image
              ? "none"
              : "flex",
          }}
        >
          {visual}
        </span>

        <span className="product-image-label">
          Naturally Sun Dried
        </span>

        <span className="quick-view">
          View Product
          <ArrowRight size={15} />
        </span>
      </button>

      <div className="product-info premium-product-info">
        <div className="product-top-line">
          <span className="product-category">
            {product.category}
          </span>

          {product.stock !== undefined &&
            product.stock <= 5 && (
              <span className="low-stock">
                Only {product.stock} left
              </span>
            )}
        </div>

        <button
          className="product-name premium-product-name"
          onClick={() =>
            openProduct(product)
          }
        >
          {product.name}
        </button>

        <div className="rating premium-rating">
          <span>★★★★★</span>
          <small>Premium Quality</small>
        </div>

        <div className="price-row premium-price-row">
          <div className="price-group">
            <strong>
              ₹{product.price}
            </strong>

            {product.oldPrice && (
              <del>
                ₹{product.oldPrice}
              </del>
            )}
          </div>

          {product.weight && (
            <span className="product-weight">
              {product.weight}
            </span>
          )}
        </div>

        <button
          className="add-button premium-add-button"
          onClick={() =>
            openProduct(product)
          }
        >
          <ShoppingBag size={17} />
          View & Add to Cart
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   SHOP
========================================================= */

function Shop({
  products,
  category,
  setCategory,
  search,
  setSearch,
  openProduct,
}) {
  return (
    <section className="shop-page section">
      <div className="container">
        <div className="page-header">
          <div>
            <span className="eyebrow">
              OUR COLLECTION
            </span>

            <h1>
              Shop Andhra Dry Fish
            </h1>

            <p>
              Premium dry fish and prawns
              delivered across India.
            </p>
          </div>

          <div className="shop-search">
            <Search size={18} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search dry fish, prawns..."
            />
          </div>
        </div>

        <div className="filter-bar">
          <div className="category-filters">
            {[
              "All",
              "Dry Fish",
              "Dry Prawns",
              "Combos",
            ].map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          <span className="product-count">
            {products.length} Products
          </span>
        </div>

        <ProductGrid
          products={products}
          openProduct={openProduct}
        />
      </div>
    </section>
  );
}

/* =========================================================
   PRODUCT DETAILS
========================================================= */

function ProductDetails({
  product,
  addToCart,
  goTo,
}) {
  const [quantity, setQuantity] =
    useState(1);

  const [added, setAdded] =
    useState(false);

  const discount =
    product.oldPrice &&
    product.oldPrice > product.price
      ? Math.round(
          ((product.oldPrice -
            product.price) /
            product.oldPrice) *
            100
        )
      : null;

  const handleAdd = () => {
    addToCart(product, quantity);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1800);
  };

  return (
    <section className="product-details-page section premium-details-page">
      <div className="container">
        <button
          className="back-button"
          onClick={() => goTo("shop")}
        >
          <ChevronLeft size={18} />
          Back to Shop
        </button>

        <div className="details-grid premium-details-grid">
          <div className="details-image premium-details-image">
            {discount && (
              <span className="discount-badge">
                {discount}% OFF
              </span>
            )}

            {product.featured && (
              <span className="details-featured">
                BEST SELLER
              </span>
            )}

            <div className="details-visual">
              {product.image ? (
                <img
                  src={getProductImage(
                    product.image
                  )}
                  alt={product.name}
                  className="details-real-image"
                  onError={(e) => {
                    e.currentTarget.style.display =
                      "none";

                    const fallback =
                      e.currentTarget.parentElement.querySelector(
                        ".details-image-fallback"
                      );

                    if (fallback) {
                      fallback.style.display =
                        "flex";
                    }
                  }}
                />
              ) : null}

              <span
                className="details-emoji details-image-fallback"
                style={{
                  display: product.image
                    ? "none"
                    : "flex",
                }}
              >
                {demoVisuals[product.id] ||
                  "🐟"}
              </span>
            </div>

            <div className="image-label premium-image-label">
              <span>🌞</span>
              Naturally Sun Dried
            </div>

            <div className="details-trust-row">
              <span>
                ✓ Quality Checked
              </span>

              <span>
                ✓ Hygienically Packed
              </span>
            </div>
          </div>

          <div className="details-content premium-details-content">
            <span className="product-category">
              {product.category}
            </span>

            <h1>{product.name}</h1>

            <div className="details-rating">
              <span>★★★★★</span>
              <span>Premium Quality</span>
            </div>

            <div className="details-price premium-details-price">
              <strong>
                ₹{product.price}
              </strong>

              {product.oldPrice && (
                <del>
                  ₹{product.oldPrice}
                </del>
              )}

              {discount && (
                <span className="save-badge">
                  Save {discount}%
                </span>
              )}
            </div>

            <p className="details-description">
              Enjoy the authentic taste of
              Andhra coastal cuisine. Our{" "}
              {product.name} is carefully
              selected, traditionally prepared
              and packed with care to preserve
              its natural flavour and quality.
            </p>

            <div className="product-highlights">
              <div>
                <span>🌞</span>
                <strong>
                  Natural Drying
                </strong>
                <small>
                  Traditional preparation
                </small>
              </div>

              <div>
                <span>📦</span>
                <strong>
                  Fresh Packing
                </strong>
                <small>
                  Carefully packed
                </small>
              </div>

              <div>
                <span>🚚</span>
                <strong>
                  Pan India
                </strong>
                <small>
                  Doorstep delivery
                </small>
              </div>
            </div>

            <div className="detail-divider" />

            <div className="detail-row premium-detail-row">
              <span>Pack Size</span>

              <strong>
                {product.weight ||
                  "500g"}
              </strong>
            </div>

            <div className="detail-row premium-detail-row">
              <span>Availability</span>

              <strong className="available">
                ✓ In Stock
              </strong>
            </div>

            <div className="quantity-section premium-quantity-section">
              <span>Quantity</span>

              <div className="quantity-control premium-quantity-control">
                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.max(1, q - 1)
                    )
                  }
                  aria-label="Decrease quantity"
                >
                  <Minus size={30} />
                </button>

                <strong>{quantity}</strong>

                <button
                  onClick={() =>
                    setQuantity((q) =>
                      Math.min(
                        product.stock || 10,
                        q + 1
                      )
                    )
                  }
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="details-actions">
              <button
                className={`large-add-button premium-large-add ${
                  added ? "added" : ""
                }`}
                onClick={handleAdd}
              >
                {added ? (
                  <>
                    <Check size={20} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>

              <button
                className="buy-now-button premium-buy-now"
                onClick={() => {
                  addToCart(
                    product,
                    quantity
                  );

                  goTo("cart");
                }}
              >
                Buy Now
              </button>
            </div>

            <div className="delivery-info premium-delivery-info">
              <div>
                <Truck size={21} />

                <span>
                  <strong>
                    Pan India Delivery
                  </strong>

                  <small>
                    Delivered safely to
                    your doorstep
                  </small>
                </span>
              </div>

              <div>
                <Package size={21} />

                <span>
                  <strong>
                    Secure Packaging
                  </strong>

                  <small>
                    Packed carefully for
                    freshness
                  </small>
                </span>
              </div>
            </div>

            <div className="details-note">
              <Check size={17} />

              <span>
                Free delivery on orders
                above ₹999
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CART
========================================================= */

function Cart({
  cart,
  updateQuantity,
  goTo,
  setCart,
}) {
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const delivery =
    subtotal === 0 || subtotal >= 999
      ? 0
      : 99;

  const total = subtotal + delivery;

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  if (!cart.length) {
    return (
      <section className="empty-page section premium-empty-cart-page">
        <div className="container">
          <div className="empty-cart premium-empty-cart">
            <div className="empty-cart-icon">
              <ShoppingCart size={48} />
            </div>

            <span className="eyebrow">
              ANDHRA DRY FISH
            </span>

            <h1>
              Your Cart is Empty
            </h1>

            <p>
              Your favourite Andhra dry fish
              and prawns are waiting for you.
            </p>

            <button
              className="primary-button"
              onClick={() => goTo("shop")}
            >
              Start Shopping
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="cart-page section premium-cart-page">
      <div className="container">
        <div className="cart-header">
          <div>
            <span className="eyebrow">
              YOUR ORDER
            </span>

            <h1>Shopping Cart</h1>

            <p>
              {itemCount}{" "}
              {itemCount === 1
                ? "item"
                : "items"}{" "}
              in your cart
            </p>
          </div>

          <button
            className="continue-shopping top-continue"
            onClick={() => goTo("shop")}
          >
            <ChevronLeft size={17} />
            Continue Shopping
          </button>
        </div>

        <div className="cart-layout premium-cart-layout">
          <div className="cart-items premium-cart-items">
            <div className="cart-items-top">
              <strong>
                Your Items
              </strong>

              <span>
                {itemCount} items
              </span>
            </div>

            {cart.map((item) => (
              <div
                className="cart-item premium-cart-item"
                key={item.id}
              >
                <button
                  className="cart-item-image premium-cart-image"
                  onClick={() =>
                    goTo("shop")
                  }
                  aria-label={`View ${item.name}`}
                >
                  {item.featured && (
                    <span className="cart-best-badge">
                      BEST
                    </span>
                  )}

                  {item.image ? (
                    <img
                      src={getProductImage(
                        item.image
                      )}
                      alt={item.name}
                      className="cart-real-image"
                      onError={(e) => {
                        e.currentTarget.style.display =
                          "none";

                        const fallback =
                          e.currentTarget.parentElement.querySelector(
                            ".cart-image-fallback"
                          );

                        if (fallback) {
                          fallback.style.display =
                            "flex";
                        }
                      }}
                    />
                  ) : null}

                  <span
                    className="cart-image-fallback"
                    style={{
                      display: item.image
                        ? "none"
                        : "flex",
                    }}
                  >
                    {demoVisuals[item.id] ||
                      "🐟"}
                  </span>
                </button>

                <div className="cart-item-info premium-cart-info">
                  <span className="cart-category">
                    {item.category}
                  </span>

                  <h3>{item.name}</h3>

                  <div className="cart-meta">
                    <span>
                      {item.weight ||
                        "500g"}
                    </span>

                    <span>•</span>

                    <span>
                      Premium Quality
                    </span>
                  </div>

                  <div className="cart-item-price">
                    ₹{item.price}
                    <small>
                      {" "}
                      / pack
                    </small>
                  </div>
                </div>

                <div className="cart-item-actions premium-cart-actions">
                  <div className="quantity-control premium-cart-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity -
                            1
                        )
                      }
                      aria-label="Decrease quantity"
                    >
                      <Minus size={14} />
                    </button>

                    <strong>
                      {item.quantity}
                    </strong>

                    <button
                      onClick={() =>
                        updateQuantity(
                          item.id,
                          item.quantity +
                            1
                        )
                      }
                      aria-label="Increase quantity"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <strong className="item-total">
                    ₹
                    {item.price *
                      item.quantity}
                  </strong>

                  <button
                    className="remove-button premium-remove-button"
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        0
                      )
                    }
                    aria-label={`Remove ${item.name}`}
                  >
                    <X size={17} />
                  </button>
                </div>
              </div>
            ))}

            <div className="cart-bottom-note">
              <Check size={17} />

              <span>
                Your order will be carefully
                packed and shipped across India.
              </span>
            </div>

            <button
              className="continue-shopping"
              onClick={() => goTo("shop")}
            >
              <ChevronLeft size={18} />
              Continue Shopping
            </button>
          </div>

          <OrderSummary
            subtotal={subtotal}
            delivery={delivery}
            total={total}
            goTo={() =>
              goTo("checkout")
            }
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   ORDER SUMMARY
========================================================= */

function OrderSummary({
  subtotal,
  delivery,
  total,
  goTo,
}) {
  const amountForFreeDelivery =
    Math.max(0, 999 - subtotal);

  return (
    <aside className="order-summary premium-order-summary">
      <div className="summary-heading">
        <span className="eyebrow">
          CHECKOUT
        </span>

        <h2>Order Summary</h2>
      </div>

      {delivery > 0 && (
        <div className="free-delivery-progress">
          <div className="free-delivery-icon">
            🚚
          </div>

          <div>
            <strong>
              Add ₹
              {amountForFreeDelivery} more
            </strong>

            <span>
              to unlock FREE delivery
            </span>
          </div>
        </div>
      )}

      {delivery === 0 &&
        subtotal > 0 && (
          <div className="free-delivery-success">
            <Check size={18} />

            <span>
              You unlocked FREE delivery!
            </span>
          </div>
        )}

      <div className="summary-lines">
        <div className="summary-line">
          <span>Subtotal</span>

          <strong>
            ₹{subtotal}
          </strong>
        </div>

        <div className="summary-line">
          <span>Delivery</span>

          <strong
            className={
              delivery === 0
                ? "free-text"
                : ""
            }
          >
            {delivery === 0
              ? "FREE"
              : `₹${delivery}`}
          </strong>
        </div>
      </div>

      <div className="summary-divider" />

      <div className="summary-total">
        <span>Total Amount</span>

        <strong>
          ₹{total}
        </strong>
      </div>

      <p className="tax-note">
        Final amount shown at checkout
      </p>

      <button
        className="checkout-button premium-checkout-button"
        onClick={goTo}
      >
        Proceed to Checkout
        <ArrowRight size={18} />
      </button>

      <div className="cod-note premium-cod-note">
        <Check size={17} />

        <div>
          <strong>
            UPI QR Payment
          </strong>

          <small>
            Scan QR and pay securely
          </small>
        </div>
      </div>

      <div className="secure-checkout">
        <Package size={17} />

        Secure & Hygienic Packaging
      </div>
    </aside>
  );
}

/* =========================================================
   CHECKOUT
========================================================= */

function Checkout({
  cart,
  setCart,
  setOrder,
  goTo,
}) {
  const [form, setForm] =
    useState({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
    });

  const [loading, setLoading] =
    useState(false);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [locationMessage, setLocationMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.quantity,
    0
  );

  const delivery =
    subtotal >= 999 ? 0 : 99;

  const total = subtotal + delivery;

  const itemCount = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  const change = (e) => {
    const { name, value } =
      e.target;

    if (name === "phone") {
      setForm({
        ...form,
        phone: value
          .replace(/\D/g, "")
          .slice(0, 10),
      });

      return;
    }

    if (name === "pincode") {
      setForm({
        ...form,
        pincode: value
          .replace(/\D/g, "")
          .slice(0, 6),
      });

      return;
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  /* =======================================================
     GPS LOCATION
  ======================================================= */

  const useLiveLocation = () => {
    setLocationMessage("");
    setError("");

    if (!navigator.geolocation) {
      setLocationMessage(
        "Location is not supported by this browser. Please enter your address manually."
      );

      return;
    }

    setLocationLoading(true);

    setLocationMessage(
      "Detecting your location..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const {
          latitude,
          longitude,
          accuracy,
        } = position.coords;

        console.log(
          "GPS Location:",
          {
            latitude,
            longitude,
            accuracy,
          }
        );

        setLocationMessage(
          "✓ GPS location detected. Please enter and verify your complete delivery address."
        );

        setLocationLoading(false);
      },

      (locationError) => {
        console.error(
          "GPS error:",
          locationError
        );

        let message =
          "Unable to detect your location.";

        if (locationError.code === 1) {
          message =
            "Location permission was denied. Please allow location access in your browser.";
        } else if (
          locationError.code === 2
        ) {
          message =
            "Your location could not be determined. Please try again.";
        } else if (
          locationError.code === 3
        ) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationMessage(message);
        setLocationLoading(false);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 60000,
      }
    );
  };

  /* =======================================================
     PLACE ORDER
  ======================================================= */

  const placeOrder = async (e) => {
    e.preventDefault();

    setError("");

    if (!cart.length) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    if (!form.name.trim()) {
      setError(
        "Please enter your full name."
      );

      return;
    }

    if (
      !/^[6-9]\d{9}$/.test(
        form.phone
      )
    ) {
      setError(
        "Please enter a valid 10-digit Indian mobile number."
      );

      return;
    }

    if (!form.address.trim()) {
      setError(
        "Please enter your complete delivery address."
      );

      return;
    }

    if (!form.city.trim()) {
      setError(
        "Please enter your city."
      );

      return;
    }

    if (!form.state.trim()) {
      setError(
        "Please enter your state."
      );

      return;
    }

    if (
      !/^\d{6}$/.test(
        form.pincode
      )
    ) {
      setError(
        "Please enter a valid 6-digit pincode."
      );

      return;
    }

    setLoading(true);

    const payload = {
      customer: form,

      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        weight: item.weight,
        image: item.image || "",
      })),

      paymentMethod: "UPI",
    };

    try {
      const response =
        await fetch(
          `${API}/orders`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              payload
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
            "Order failed"
        );
      }

      setOrder(data.order);

      setCart([]);

      goTo("success");
    } catch (err) {
      console.error(err);

      setError(
        "Unable to place the order. Please check that the backend is running and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <section className="empty-page section premium-checkout-empty">
        <div className="container">
          <div className="empty-cart premium-empty-cart">
            <div className="empty-cart-icon">
              <ShoppingCart size={45} />
            </div>

            <span className="eyebrow">
              CHECKOUT
            </span>

            <h1>
              Your Cart is Empty
            </h1>

            <p>
              Please add products to your
              cart before continuing to
              checkout.
            </p>

            <button
              className="primary-button"
              onClick={() => goTo("shop")}
            >
              Start Shopping
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="checkout-page section premium-checkout-page">
      <div className="container">
        <div className="checkout-header">
          <div>
            <span className="eyebrow">
              SECURE CHECKOUT
            </span>

            <h1>
              Complete Your Order
            </h1>

            <p>
              Just a few details and your
              Andhra favourites will be on
              their way to you.
            </p>
          </div>

          <div className="checkout-security">
            <div>
              <Check size={16} />
              Secure Order
            </div>

            <div>
              <Truck size={16} />
              Pan India Delivery
            </div>
          </div>
        </div>

        <form
          className="checkout-layout premium-checkout-layout"
          onSubmit={placeOrder}
        >
          <div className="checkout-form premium-checkout-form">
            {/* DELIVERY DETAILS */}

            <div className="form-card premium-form-card">
              <div className="form-card-heading premium-form-heading">
                <div className="number">
                  1
                </div>

                <div>
                  <span className="form-step-label">
                    DELIVERY DETAILS
                  </span>

                  <h2>
                    Where should we deliver?
                  </h2>

                  <p>
                    Enter your delivery
                    details or use your live
                    location.
                  </p>
                </div>
              </div>

              {/* LIVE LOCATION */}

              <div className="live-location-box">
                <div className="live-location-left">
                  <div className="live-location-icon">
                    <MapPin size={20} />
                  </div>

                  <div>
                    <strong>
                      Use your live location
                    </strong>

                    <span>
                      Detect GPS location and
                      verify your delivery
                      address manually
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="live-location-button"
                  onClick={
                    useLiveLocation
                  }
                  disabled={
                    locationLoading
                  }
                >
                  {locationLoading ? (
                    <>
                      <span className="location-spinner" />
                      Detecting...
                    </>
                  ) : (
                    <>
                      <MapPin size={16} />
                      Use My Location
                    </>
                  )}
                </button>
              </div>

              {locationMessage && (
                <div
                  className={`location-message ${
                    locationMessage.startsWith(
                      "✓"
                    )
                      ? "location-success"
                      : ""
                  }`}
                >
                  {locationMessage}
                </div>
              )}

              <div className="form-grid premium-form-grid">
                <label>
                  <span>
                    Full Name{" "}
                    <b>*</b>
                  </span>

                  <input
                    name="name"
                    value={form.name}
                    onChange={change}
                    required
                    autoComplete="name"
                    placeholder="Enter your full name"
                  />
                </label>

                <label>
                  <span>
                    Mobile Number{" "}
                    <b>*</b>
                  </span>

                  <input
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    value={form.phone}
                    onChange={change}
                    required
                    autoComplete="tel"
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />

                  <small className="field-hint">
                    We'll use this number
                    for delivery updates.
                  </small>
                </label>

                <label className="full">
                  <span>
                    Email Address
                  </span>

                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={change}
                    autoComplete="email"
                    placeholder="your@email.com"
                  />
                </label>

                <label className="full">
                  <span>
                    Complete Address{" "}
                    <b>*</b>
                  </span>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={change}
                    required
                    autoComplete="street-address"
                    placeholder="House / Flat No., Street, Area, Landmark"
                    rows="4"
                  />
                </label>

                <label>
                  <span>
                    City <b>*</b>
                  </span>

                  <input
                    name="city"
                    value={form.city}
                    onChange={change}
                    required
                    autoComplete="address-level2"
                    placeholder="Your city"
                  />
                </label>

                <label>
                  <span>
                    State <b>*</b>
                  </span>

                  <input
                    name="state"
                    value={form.state}
                    onChange={change}
                    required
                    autoComplete="address-level1"
                    placeholder="Your state"
                  />
                </label>

                <label>
                  <span>
                    Pincode <b>*</b>
                  </span>

                  <input
                    name="pincode"
                    value={form.pincode}
                    onChange={change}
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    placeholder="6-digit pincode"
                    maxLength="6"
                  />
                </label>
              </div>
            </div>

            {/* UPI PAYMENT */}

            <div className="form-card premium-form-card">
              <div className="form-card-heading premium-form-heading">
                <div className="number">
                  2
                </div>

                <div>
                  <span className="form-step-label">
                    PAYMENT
                  </span>

                  <h2>
                    Pay Using UPI
                  </h2>

                  <p>
                    Scan the QR code using
                    any UPI app.
                  </p>
                </div>
              </div>

              <div className="upi-payment-card">
                <div className="upi-payment-header">
                  <div className="upi-icon">
                    ₹
                  </div>

                  <div>
                    <strong>
                      UPI QR Payment
                    </strong>

                    <span>
                      Google Pay • PhonePe •
                      Paytm • BHIM
                    </span>
                  </div>
                </div>

                <div className="upi-qr-wrapper">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(
                      `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
                        UPI_NAME
                      )}&am=${total}&cu=INR`
                    )}`}
                    alt="UPI QR Code"
                    className="upi-qr"
                  />

                  <strong>
                    Scan & Pay ₹{total}
                  </strong>

                  <span className="upi-id">
                    UPI ID: {UPI_ID}
                  </span>
                </div>

                <div className="upi-instructions">
                  <div>
                    <span>1</span>
                    <p>
                      Open your UPI app
                    </p>
                  </div>

                  <div>
                    <span>2</span>
                    <p>
                      Scan the QR code
                    </p>
                  </div>

                  <div>
                    <span>3</span>
                    <p>
                      Pay ₹{total}
                    </p>
                  </div>
                </div>

                <div className="upi-paid-note">
                  <Check size={18} />

                  <div>
                    <strong>
                      After payment
                    </strong>

                    <small>
                      Complete your payment
                      and then click "I Have
                      Paid — Place Order"
                      below.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="checkout-error premium-checkout-error">
                <X size={18} />

                <span>{error}</span>
              </div>
            )}

            <div className="checkout-final-note">
              <Check size={18} />

              <p>
                By placing this order, you
                confirm that the delivery
                details provided above are
                correct.
              </p>
            </div>
          </div>

          {/* CHECKOUT SUMMARY */}

          <aside className="checkout-summary premium-checkout-summary">
            <div className="checkout-summary-title">
              <div>
                <span className="eyebrow">
                  YOUR ORDER
                </span>

                <h2>
                  Order Summary
                </h2>
              </div>

              <span className="checkout-item-count">
                {itemCount}{" "}
                {itemCount === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="checkout-products premium-checkout-products">
              {cart.map((item) => (
                <div
                  className="checkout-product premium-checkout-product"
                  key={item.id}
                >
                  <div className="mini-product-image premium-mini-image">
                    {item.image ? (
                      <img
                        src={getProductImage(
                          item.image
                        )}
                        alt={item.name}
                        className="checkout-real-image"
                        onError={(e) => {
                          e.currentTarget.style.display =
                            "none";

                          const fallback =
                            e.currentTarget.parentElement.querySelector(
                              ".checkout-image-fallback"
                            );

                          if (fallback) {
                            fallback.style.display =
                              "flex";
                          }
                        }}
                      />
                    ) : null}

                    <span
                      className="checkout-image-fallback"
                      style={{
                        display: item.image
                          ? "none"
                          : "flex",
                      }}
                    >
                      {demoVisuals[item.id] ||
                        "🐟"}
                    </span>
                  </div>

                  <div className="checkout-product-details">
                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.weight ||
                        "500g"}{" "}
                      × {item.quantity}
                    </span>

                    <small>
                      Premium Quality
                    </small>
                  </div>

                  <b>
                    ₹
                    {item.price *
                      item.quantity}
                  </b>
                </div>
              ))}
            </div>

            <div className="checkout-summary-lines">
              <div className="summary-line">
                <span>
                  Subtotal
                </span>

                <strong>
                  ₹{subtotal}
                </strong>
              </div>

              <div className="summary-line">
                <span>
                  Delivery
                </span>

                <strong
                  className={
                    delivery === 0
                      ? "free-text"
                      : ""
                  }
                >
                  {delivery === 0
                    ? "FREE"
                    : `₹${delivery}`}
                </strong>
              </div>
            </div>

            {delivery > 0 && (
              <div className="checkout-free-note">
                🚚 Add ₹
                {999 - subtotal} more
                for FREE delivery
              </div>
            )}

            {delivery === 0 && (
              <div className="checkout-free-success">
                <Check size={16} />
                FREE delivery unlocked
              </div>
            )}

            <div className="checkout-summary-divider" />

            <div className="checkout-total-row">
              <span>
                Total Amount
              </span>

              <strong>
                ₹{total}
              </strong>
            </div>

            <div className="cod-summary-card">
              <div className="cod-summary-icon">
                ₹
              </div>

              <div>
                <strong>
                  UPI Payment
                </strong>

                <span>
                  Scan QR & pay ₹{total}
                </span>
              </div>
            </div>

            <button
              className="checkout-button premium-place-order"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="checkout-spinner" />

                  Placing Your Order...
                </>
              ) : (
                <>
                  I Have Paid — Place Order
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="checkout-guarantees">
              <div>
                <Check size={15} />
                Secure order
              </div>

              <div>
                <Truck size={15} />
                Pan India delivery
              </div>

              <div>
                <Package size={15} />
                Hygienic packaging
              </div>
            </div>

            <p className="secure-note premium-secure-note">
              🔒 Your personal information is
              used only to process and deliver
              your order.
            </p>

            <p
              style={{
                marginTop: "10px",
                fontSize: "11px",
                lineHeight: "5px",
                color: "#777",
                textAlign: "center",
              }}
            >
              UPI payment is completed directly
              through your UPI app. Please make
              sure the payment is successful
              before placing the order.
            </p>
          </aside>
        </form>
      </div>
    </section>
  );
}

/* =========================================================
   ORDER SUCCESS
========================================================= */

function OrderSuccess({
  order,
  goTo,
  setTrackingOrder,
}) {
  const orderId =
    order?.orderId ||
    order?.id ||
    "ADF-DEMO";

  const customer =
    order?.customer || {};

  const items =
    order?.items || [];

  const total =
    order?.total || 0;

  const whatsappText =
    encodeURIComponent(
      `Hello Andhra Dry Fish! I placed an order.\n\n` +
        `Order ID: ${orderId}\n` +
        `Name: ${
          customer.name || ""
        }\n` +
        `Total: ₹${total}\n` +
        `Payment: UPI`
    );

  const whatsappUrl =
    `https://wa.me/?text=${whatsappText}`;

  return (
    <section className="success-page section premium-success-page">
      <div className="container">
        <div className="success-card premium-success-card">
          {/* SUCCESS HEADER */}

          <div className="success-top">
            <div className="success-icon premium-success-icon">
              <Check
                size={43}
                strokeWidth={3}
              />
            </div>

            <span className="eyebrow">
              ORDER CONFIRMED
            </span>

            <h1>
              Thank You,{" "}
              {customer.name ||
                "Customer"}! 🎉
            </h1>

            <p>
              Your Andhra Dry Fish order
              has been successfully placed.
              We are getting it ready for
              you.
            </p>
          </div>

          {/* ORDER ID */}

          <div className="premium-order-number">
            <div>
              <span>
                ORDER ID
              </span>

              <strong>
                {orderId}
              </strong>
            </div>

            <button
              type="button"
              onClick={() => {
                if (
                  navigator.clipboard
                ) {
                  navigator.clipboard.writeText(
                    orderId
                  );
                }
              }}
            >
              Copy ID
            </button>
          </div>

          {/* STATUS */}

          <div className="order-timeline">
            <div className="timeline-step active">
              <div className="timeline-icon">
                <Check size={15} />
              </div>

              <div>
                <strong>
                  Order Placed
                </strong>

                <small>
                  Your order is confirmed
                </small>
              </div>
            </div>

            <div className="timeline-line active-line" />

            <div className="timeline-step">
              <div className="timeline-icon">
                <Package size={15} />
              </div>

              <div>
                <strong>
                  Preparing
                </strong>

                <small>
                  Our team will pack your
                  order
                </small>
              </div>
            </div>

            <div className="timeline-line" />

            <div className="timeline-step">
              <div className="timeline-icon">
                <Truck size={15} />
              </div>

              <div>
                <strong>
                  On the Way
                </strong>

                <small>
                  Delivered to your
                  doorstep
                </small>
              </div>
            </div>
          </div>

          {/* ORDER DETAILS */}

          <div className="success-details-grid">
            <div className="success-detail-card">
              <div className="success-detail-heading">
                <Package size={18} />

                <strong>
                  Order Details
                </strong>
              </div>

              <div className="success-products">
                {items.length > 0 ? (
                  items.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        className="success-product"
                        key={`${
                          item.productId ||
                          item.id ||
                          index
                        }`}
                      >
                        <div className="success-product-image">
                          {item.image ? (
                            <img
                              src={getProductImage(
                                item.image
                              )}
                              alt={item.name}
                              className="success-real-image"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";

                                const fallback =
                                  e.currentTarget.parentElement.querySelector(
                                    ".success-image-fallback"
                                  );

                                if (fallback) {
                                  fallback.style.display =
                                    "flex";
                                }
                              }}
                            />
                          ) : null}

                          <span
                            className="success-image-fallback"
                            style={{
                              display: item.image
                                ? "none"
                                : "flex",
                            }}
                          >
                            {demoVisuals[
                              item.productId
                            ] ||
                              demoVisuals[
                                item.id
                              ] ||
                              "🐟"}
                          </span>
                        </div>

                        <div>
                          <strong>
                            {item.name}
                          </strong>

                          <span>
                            {item.weight ||
                              "500g"}{" "}
                            ×{" "}
                            {item.quantity}
                          </span>
                        </div>

                        <b>
                          ₹
                          {item.price *
                            item.quantity}
                        </b>
                      </div>
                    )
                  )
                ) : (
                  <div className="success-product">
                    <div className="success-product-image">
                      🐟
                    </div>

                    <div>
                      <strong>
                        Andhra Dry Fish
                        Order
                      </strong>

                      <span>
                        Premium Quality
                      </span>
                    </div>

                    <b>
                      ₹{total}
                    </b>
                  </div>
                )}
              </div>

              <div className="success-total">
                <span>
                  Total Amount
                </span>

                <strong>
                  ₹{total}
                </strong>
              </div>

              <div className="success-payment">
                <span>
                  Payment Method
                </span>

                <strong>
                  ₹ UPI Payment
                </strong>
              </div>
            </div>

            {/* DELIVERY DETAILS */}

            <div className="success-detail-card">
              <div className="success-detail-heading">
                <MapPin size={18} />

                <strong>
                  Delivery Details
                </strong>
              </div>

              <div className="customer-address">
                <strong>
                  {customer.name ||
                    "Customer"}
                </strong>

                {customer.phone && (
                  <span>
                    📱{" "}
                    {customer.phone}
                  </span>
                )}

                {customer.address && (
                  <span>
                    {customer.address}
                  </span>
                )}

                <span>
                  {[
                    customer.city,
                    customer.state,
                    customer.pincode,
                  ]
                    .filter(Boolean)
                    .join(", ")}
                </span>
              </div>

              <div className="delivery-estimate">
                <Truck size={19} />

                <div>
                  <strong>
                    Pan India Delivery
                  </strong>

                  <span>
                    Our team will contact
                    you regarding delivery.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* WHATSAPP */}

          <div className="whatsapp-confirmation">
            <div className="whatsapp-icon">
              💬
            </div>

            <div className="whatsapp-copy">
              <strong>
                Get your order details on
                WhatsApp
              </strong>

              <span>
                Send your order ID and
                confirmation details to
                WhatsApp for easy reference.
              </span>
            </div>

            <button
              type="button"
              className="whatsapp-order-button"
              onClick={() =>
                window.open(
                  whatsappUrl,
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              WhatsApp Confirmation
            </button>
          </div>

          {/* ACTIONS */}

          <div className="success-buttons premium-success-buttons">

  <button
    className="primary-button"
    onClick={() => {
      setTrackingOrder(order);
      goTo("track-order");
    }}
  >
    <Truck size={18} />
    Track My Order
  </button>

  <button
    className="outline-button"
    onClick={() => goTo("home")}
  >
    Continue Shopping
    <ArrowRight size={18} />
  </button>

  <button
    className="outline-button"
    onClick={() => goTo("shop")}
  >
    Explore Products
  </button>

</div>
          <div className="success-footer-note">
            <Check size={15} />

            Thank you for choosing
            Andhra Dry Fish.
          </div>
        </div>
      </div>
    </section>
  );
}
/* =========================================================
   TRACK ORDER
========================================================= */

function TrackOrder({
  trackingOrder,
  setTrackingOrder,
  goTo,
}) {
  const [orderId, setOrderId] = useState(
    trackingOrder?.orderId || ""
  );

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [searchedOrder, setSearchedOrder] =
    useState(trackingOrder || null);

  const statuses = [
    "Order Placed",
    "Payment Confirmed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const currentStatus =
    searchedOrder?.status ||
    "Order Placed";

  const currentIndex =
    statuses.indexOf(currentStatus);

  const getStatusIndex = () => {
    if (currentIndex >= 0) {
      return currentIndex;
    }

    if (currentStatus === "Cancelled") {
      return -1;
    }

    return 0;
  };

  const statusIndex =
    getStatusIndex();

  const searchOrder = async (e) => {
    e.preventDefault();

    setError("");

    const cleanOrderId =
      orderId.trim();

    if (!cleanOrderId) {
      setError(
        "Please enter your Order ID."
      );

      return;
    }

    setLoading(true);

    try {
      const response =
        await fetch(
          `${API}/orders/${encodeURIComponent(
            cleanOrderId
          )}`
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.order
      ) {
        throw new Error(
          data.message ||
            "Order not found"
        );
      }

      setSearchedOrder(
        data.order
      );

      setTrackingOrder(
        data.order
      );
    } catch (err) {
      console.error(
        "Track order error:",
        err
      );

      setSearchedOrder(null);

      setError(
        "Order not found. Please check your Order ID and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshOrder = async () => {
    if (!searchedOrder?.orderId) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response =
        await fetch(
          `${API}/orders/${encodeURIComponent(
            searchedOrder.orderId
          )}`
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to refresh order"
        );
      }

      setSearchedOrder(
        data.order
      );

      setTrackingOrder(
        data.order
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to refresh order status."
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) {
      return "";
    }

    try {
      return new Date(
        date
      ).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  const items =
    searchedOrder?.items || [];

  const customer =
    searchedOrder?.customer || {};

  const total =
    searchedOrder?.total || 0;

  return (
    <section className="track-order-page section">
      <div className="container">

        {/* HEADER */}

        <div className="page-header centered">
          <span className="eyebrow">
            ORDER TRACKING
          </span>

          <h1>
            Track Your Order
          </h1>

          <p>
            Enter your Order ID to see
            the latest status of your
            Andhra Dry Fish order.
          </p>
        </div>

        {/* SEARCH */}

        <div className="track-search-card">

          <form
            className="track-search-form"
            onSubmit={searchOrder}
          >
            <div className="track-input-wrap">
              <Search size={20} />

              <input
                value={orderId}
                onChange={(e) =>
                  setOrderId(
                    e.target.value
                  )
                }
                placeholder="Enter Order ID e.g. ADF..."
              />
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="checkout-spinner" />
                  Searching...
                </>
              ) : (
                <>
                  Track Order
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {error && (
            <div className="track-error">
              <X size={18} />
              <span>{error}</span>
            </div>
          )}

          <div className="track-help">
            <Package size={17} />

            <span>
              Your Order ID can be found
              on your order confirmation
              page.
            </span>
          </div>
        </div>

        {/* ORDER RESULT */}

        {searchedOrder && (
          <div className="tracked-order">

            {/* ORDER HEADER */}

            <div className="tracked-order-header">

              <div>
                <span className="eyebrow">
                  ORDER DETAILS
                </span>

                <h2>
                  {searchedOrder.orderId}
                </h2>

                {searchedOrder.createdAt && (
                  <p>
                    Ordered on{" "}
                    {formatDate(
                      searchedOrder.createdAt
                    )}
                  </p>
                )}
              </div>

              <button
                className="outline-button"
                onClick={
                  refreshOrder
                }
                disabled={loading}
              >
                {loading
                  ? "Refreshing..."
                  : "↻ Refresh Status"}
              </button>
            </div>

            {/* CURRENT STATUS */}

            <div className="current-order-status">

              <div className="current-status-icon">
                {currentStatus ===
                "Delivered" ? (
                  <Check size={30} />
                ) : currentStatus ===
                  "Cancelled" ? (
                  <X size={30} />
                ) : (
                  <Truck size={30} />
                )}
              </div>

              <div>
                <span>
                  CURRENT STATUS
                </span>

                <strong>
                  {currentStatus}
                </strong>

                <small>
                  {currentStatus ===
                    "Order Placed" &&
                    "Your order has been received successfully."}

                  {currentStatus ===
                    "Payment Confirmed" &&
                    "Your payment has been confirmed."}

                  {currentStatus ===
                    "Processing" &&
                    "Our team is preparing your order."}

                  {currentStatus ===
                    "Packed" &&
                    "Your order has been packed carefully."}

                  {currentStatus ===
                    "Shipped" &&
                    "Your order has been handed over for delivery."}

                  {currentStatus ===
                    "Out for Delivery" &&
                    "Your order is on the way to your address."}

                  {currentStatus ===
                    "Delivered" &&
                    "Your order has been delivered successfully."}

                  {currentStatus ===
                    "Cancelled" &&
                    "This order has been cancelled."}
                </small>
              </div>
            </div>

            {/* TIMELINE */}

            {currentStatus !==
              "Cancelled" && (
              <div className="customer-order-timeline">

                {statuses.map(
                  (
                    status,
                    index
                  ) => {
                    const completed =
                      index <=
                      statusIndex;

                    const active =
                      index ===
                      statusIndex;

                    return (
                      <div
                        className={`customer-timeline-item ${
                          completed
                            ? "completed"
                            : ""
                        } ${
                          active
                            ? "current"
                            : ""
                        }`}
                        key={status}
                      >

                        <div className="customer-timeline-marker">

                          {completed ? (
                            <Check
                              size={15}
                            />
                          ) : (
                            <span>
                              {index + 1}
                            </span>
                          )}

                        </div>

                        <div className="customer-timeline-content">

                          <strong>
                            {status}
                          </strong>

                          <span>
                            {status ===
                              "Order Placed" &&
                              "Order received"}

                            {status ===
                              "Payment Confirmed" &&
                              "Payment verified"}

                            {status ===
                              "Processing" &&
                              "Being prepared"}

                            {status ===
                              "Packed" &&
                              "Packed safely"}

                            {status ===
                              "Shipped" &&
                              "Shipped from our side"}

                            {status ===
                              "Out for Delivery" &&
                              "On the way"}

                            {status ===
                              "Delivered" &&
                              "Delivered successfully"}
                          </span>

                        </div>

                        {index <
                          statuses.length -
                            1 && (
                          <div
                            className={`customer-timeline-line ${
                              index <
                              statusIndex
                                ? "active"
                                : ""
                            }`}
                          />
                        )}

                      </div>
                    );
                  }
                )}

              </div>
            )}

            {/* ORDER + DELIVERY */}

            <div className="tracked-order-grid">

              {/* PRODUCTS */}

              <div className="tracked-card">

                <div className="tracked-card-heading">
                  <Package size={19} />

                  <h3>
                    Your Products
                  </h3>
                </div>

                <div className="tracked-products">

                  {items.length ? (
                    items.map(
                      (
                        item,
                        index
                      ) => (
                        <div
                          className="tracked-product"
                          key={`track-${
                            item.productId ||
                            item.id ||
                            index
                          }`}
                        >

                          <div className="tracked-product-image">

                            {item.image ? (
                              <img
                                src={getProductImage(
                                  item.image
                                )}
                                alt={
                                  item.name
                                }
                              />
                            ) : (
                              <span>
                                {demoVisuals[
                                  item.productId
                                ] ||
                                  "🐟"}
                              </span>
                            )}

                          </div>

                          <div className="tracked-product-info">

                            <strong>
                              {item.name}
                            </strong>

                            <span>
                              {item.weight ||
                                "500g"}{" "}
                              ×{" "}
                              {item.quantity}
                            </span>

                          </div>

                          <strong>
                            ₹
                            {item.price *
                              item.quantity}
                          </strong>

                        </div>
                      )
                    )
                  ) : (
                    <p>
                      Product details
                      unavailable.
                    </p>
                  )}

                </div>

                <div className="tracked-total">
                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{total}
                  </strong>
                </div>

              </div>

              {/* DELIVERY */}

              <div className="tracked-card">

                <div className="tracked-card-heading">
                  <MapPin size={19} />

                  <h3>
                    Delivery Address
                  </h3>
                </div>

                <div className="tracked-address">

                  <strong>
                    {customer.name ||
                      "Customer"}
                  </strong>

                  {customer.phone && (
                    <span>
                      📱{" "}
                      {customer.phone}
                    </span>
                  )}

                  {customer.address && (
                    <span>
                      {customer.address}
                    </span>
                  )}

                  <span>
                    {[
                      customer.city,
                      customer.state,
                      customer.pincode,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </span>

                </div>

                <div className="tracked-delivery-box">
                  <Truck size={20} />

                  <div>
                    <strong>
                      Pan India Delivery
                    </strong>

                    <span>
                      Your order will be
                      delivered safely to
                      your doorstep.
                    </span>
                  </div>
                </div>

                <div className="tracked-payment-box">
                  <Check size={18} />

                  <div>
                    <strong>
                      Payment
                    </strong>

                    <span>
                      {searchedOrder.paymentMethod ||
                        "UPI"}
                    </span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* BOTTOM */}

        <div className="track-bottom-actions">

          <button
            className="outline-button"
            onClick={() =>
              goTo("shop")
            }
          >
            Continue Shopping
            <ArrowRight size={18} />
          </button>

          <button
            className="outline-button"
            onClick={() =>
              goTo("home")
            }
          >
            Back to Home
          </button>

        </div>

      </div>
    </section>
  );
}
/* =========================================================
   ABOUT
========================================================= */

function About() {
  return (
    <section className="about-page section">
      <div className="container">
        <div className="page-header centered">
          <span className="eyebrow">
            OUR STORY
          </span>

          <h1>
            About Andhra Dry Fish
          </h1>

          <p>
            Bringing the authentic taste of
            Andhra's coastal cuisine to homes
            across India.
          </p>
        </div>

        <div className="about-story">
          <div className="about-visual">
            <div className="about-fish">
              🐟
            </div>

            <div className="about-prawn">
              🦐
            </div>

            <span>
              Authentic Andhra Taste
            </span>
          </div>

          <div className="about-copy">
            <span className="eyebrow">
              FROM THE ANDHRA COAST
            </span>

            <h2>
              Tradition in
              <br />
              <span>Every Bite</span>
            </h2>

            <p>
              Andhra cuisine is known for its
              bold flavours and love for seafood.
              Dry fish has been a part of coastal
              Andhra food traditions for generations.
            </p>

            <p>
              Andhra Dry Fish is built around one
              simple idea: make authentic coastal
              flavours easier for families
              everywhere to enjoy.
            </p>

            <p>
              We focus on quality products,
              careful preparation, hygienic
              packaging and dependable delivery.
            </p>

            <div className="about-values">
              <div>
                <strong>01</strong>
                <span>
                  Quality First
                </span>
              </div>

              <div>
                <strong>02</strong>
                <span>
                  Authentic Taste
                </span>
              </div>

              <div>
                <strong>03</strong>
                <span>
                  Customer Care
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="about-features">
          <div>
            <span>🌞</span>

            <h3>
              Traditional Methods
            </h3>

            <p>
              Inspired by Andhra coastal food
              traditions.
            </p>
          </div>

          <div>
            <span>❤️</span>

            <h3>
              Made With Care
            </h3>

            <p>
              Every order is prepared and
              packed carefully.
            </p>
          </div>

          <div>
            <span>🇮🇳</span>

            <h3>
              Across India
            </h3>

            <p>
              Authentic Andhra taste delivered
              nationwide.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   CONTACT
========================================================= */

function Contact() {
  return (
    <section className="contact-page section">
      <div className="container">
        <div className="page-header centered">
          <span className="eyebrow">
            GET IN TOUCH
          </span>

          <h1>
            Contact Us
          </h1>

          <p>
            Have a question about our products
            or your order? We are here to help.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-card">
            <div className="contact-icon">
              <Phone size={23} />
            </div>

            <h3>Call Us</h3>

            <p>
              Speak to our customer support
              team.
            </p>

            <a href="tel:+918179975476">
              +91 8179975476
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <Mail size={23} />
            </div>

            <h3>Email Us</h3>

            <p>
              Send us your questions anytime.
            </p>

            <a href="mailto:hello@andhradryfish.in">
              hello@andhradryfish.in
            </a>
          </div>

          <div className="contact-card">
            <div className="contact-icon">
              <MapPin size={23} />
            </div>

            <h3>
              Our Location
            </h3>

            <p>
              Andhra Pradesh, India
            </p>

            <span>
              Pan India Delivery
            </span>
          </div>
        </div>

        <div className="contact-bottom">
          <div>
            <span className="eyebrow">
              WHATSAPP ORDERS
            </span>

            <h2>
              Want to order directly?
            </h2>

            <p>
              You can also contact us through
              WhatsApp for product enquiries
              and orders.
            </p>

            <a
              className="whatsapp-button"
              href="https://wa.me/918179975476"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>
          </div>

          <div className="contact-map">
            <span>📍</span>

            <strong>
              ANDHRA PRADESH
            </strong>

            <small>
              Authentic Coastal Taste
            </small>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   FAQ
========================================================= */

function Faq({
  question,
  answer,
}) {
  const [open, setOpen] =
    useState(false);

  return (
    <div
      className={`faq ${
        open ? "open" : ""
      }`}
    >
      <button
        onClick={() =>
          setOpen((v) => !v)
        }
      >
        <span>{question}</span>

        {open ? (
          <X size={20} />
        ) : (
          <Plus size={20} />
        )}
      </button>

      {open && (
        <p>{answer}</p>
      )}
    </div>
  );
}

/* =========================================================
   FOOTER
========================================================= */

function Footer({
  goTo,
  openCategory,
}) {
  return (
    <footer className="footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <button
            className="logo footer-logo"
            onClick={() =>
              goTo("home")
            }
          >
            <span className="logo-icon">
              🐟
            </span>

            <span>
              <strong>
                ANDHRA
              </strong>

              <small>
                DRY FISH
              </small>
            </span>
          </button>

          <p>
            Authentic Andhra dry fish and dry
            prawns, bringing coastal flavours
            to your home.
          </p>

          <div className="socials">
            <a
              href="#"
              aria-label="Instagram"
            />

            <a
              href="#"
              aria-label="Facebook"
            />

            <a
              href="mailto:hello@andhradryfish.in"
              aria-label="Email"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>

        <div className="footer-column">
          <h3>Shop</h3>

          <button
            onClick={() =>
              openCategory("Dry Fish")
            }
          >
            Dry Fish
          </button>

          <button
            onClick={() =>
              openCategory("Dry Prawns")
            }
          >
            Dry Prawns
          </button>

          <button
            onClick={() =>
              openCategory("Combos")
            }
          >
            Combos
          </button>

          <button
            onClick={() =>
              goTo("shop")
            }
          >
            All Products
          </button>
        </div>

        <div className="footer-column">
          <h3>
            Information
          </h3>

          <button
            onClick={() =>
              goTo("about")
            }
          >
            About Us
          </button>

          <button
            onClick={() =>
              goTo("contact")
            }
          >
            Contact
          </button>

          <button
            onClick={() =>
              goTo("home")
            }
          >
            FAQ
          </button>

          <button
            onClick={() =>
              goTo("home")
            }
          >
            Shipping Policy
          </button>
        </div>

        <div className="footer-column">
          <h3>Contact</h3>

          <span>
            <Phone size={16} />
            +91 8179975476
          </span>

          <span>
            <Mail size={16} />
            andhradryfish.in
          </span>

          <span>
            <MapPin size={16} />
            Andhra Pradesh, India
          </span>

          <span>
            <Truck size={16} />
            Pan India Delivery
          </span>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            ©{" "}
            {new Date().getFullYear(2018)}{" "}
            Andhra Dry Fish. All Rights
            Reserved.
          </span>

          <div>
            <button>
              Privacy Policy
            </button>

            <button>
              Terms & Conditions
            </button>

            <button>
              Refund Policy
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================
   APP MOUNT
========================================================= */

export default App;

createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);