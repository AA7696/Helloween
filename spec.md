# Website Specification: HELL ENERGY Clone (MERN Stack)

This specification defines the functional, design, and technical requirements for cloning the HELL ENERGY India website (`https://www.hellenergy.com/in/`) as a full-stack MERN application.

---

## 1. Project Overview
The goal is to create a high-performance, visually stunning MERN (MongoDB, Express, React, Node) stack clone of the HELL ENERGY website. The clone will reproduce the brand's premium energy aesthetic (dark themes, neon red highlights, glassmorphism, dynamic animations) while introducing a fully functional backend for content management, dynamic products display, contact inquiries, and an admin dashboard.

---

## 2. Technical Stack
* **Frontend**: React.js (Vite), React Router DOM (v6), Vanilla CSS (Custom properties, HSL colors, modern CSS layout), Lucide Icons.
* **Backend**: Node.js, Express.js.
* **Database**: MongoDB (Mongoose ODM).
* **Authentication**: JSON Web Tokens (JWT) stored securely, bcryptjs for password hashing.
* **Image/Asset Handling**: Cloudinary (or local uploads mapped via server static routes).

---

## 3. Architecture & Folder Structure
```text
/drink (Root)
│
├── /server                 # Express Backend
│   ├── /config             # DB connections, middleware config
│   ├── /controllers        # Request handlers (auth, products, news, inquiries)
│   ├── /models             # Mongoose schemas (User, Product, News, Inquiry)
│   ├── /routes             # API endpoints
│   ├── /uploads            # Temporary storage for local uploads (if applicable)
│   ├── server.js           # Server entry point
│   └── package.json
│
├── /client                 # Vite + React Frontend
│   ├── /public             # Static assets (favicons, manifest)
│   ├── /src
│   │   ├── /assets         # Images, videos, SVGs
│   │   ├── /components     # Reusable UI components (Navbar, Footer, ProductCard, Carousel)
│   │   ├── /context        # Global state (Auth, Cart/Inquiries)
│   │   ├── /pages          # Page components (Home, Products, News, Contact, AdminDashboard)
│   │   ├── /styles         # Global CSS variables, utility classes, and layouts
│   │   ├── App.jsx         # App routing and layout structure
│   │   ├── main.jsx        # App entry point
│   │   └── index.css       # Design System CSS
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 4. Key Pages & Features

### 4.1. Customer-Facing Pages
1. **Home Page**:
   - **Hero Section**: Full-screen banner with video/dynamic backgrounds, premium parallax effect, and sliding features for "HELL Carnival Edition" or "Michele Morrone - HELL City".
   - **Feature Highlights**: Fast-loading, highly animated display showcasing details (5 B-Vitamins, no preservatives, 32mg/100ml caffeine, recyclable aluminum).
   - **Product Showcase Carousel**: Slide-in cards of top/signature products (Classic, Strong Apple, Zero Strawberry, etc.) with transition effects.
   - **News Highlight Grid**: A grid layout displaying the latest 3 press releases/news cards.
   - **Social Feed Grid**: Mockup of the brand's Instagram grid with hovering overlay zoom animations.

2. **Products Page**:
   - **Sub-navigation Categories**: Categorized display (Energy Drinks, Functional Drinks, Ice Coffee). Clicking a category transitions the product list smoothly (fade-in, filter).
   - **Filter & Search Bar**: Live search by name or ingredients, sorting by caffeine level or launch date.
   - **Product Details Modal**: Clicking a product reveals a detailed overlay with detailed nutritional info, B-vitamin breakdowns, and description.

3. **News & Press Releases Page**:
   - Paginated feed of articles detailing events (e.g., "HELL Boxing Kings", "Michele Morrone Collaboration").
   - Single News View: Dedicated page showing the full article layout with cover images, rich text paragraphs, and related news recommendations.

4. **About Us & Sustainability Page**:
   - Storytelling interface outlining the brand's history (20 years) and European mega-factory.
   - Interactive sustainability cards explaining the recycling loop of the aluminum cans.

5. **Contact Us Page**:
   - Fully functional submission form (Name, Email, Message Category, Message Content).
   - Dynamic validation and success states.
   - Submissions are stored securely in MongoDB.

---

### 4.2. Admin & Content Management Features
1. **Admin Login Page**:
   - Clean, secure login form for backend administration.

2. **Admin Dashboard Interface**:
   - **Overview Tab**: Key statistics (Total Products, Total News, Unread Inquiries).
   - **Product Manager (CRUD)**:
     - View all products in a list/grid.
     - Add new products (Name, Category, Description, Caffeine Level, Vitamins list, Image URL or file upload).
     - Edit existing products.
     - Delete products.
   - **News Manager (CRUD)**:
     - Add, edit, or delete news articles (Title, Excerpt, Content, Image URL/Upload, Date).
   - **Inquiry Panel**:
     - View all customer messages sent via the contact form.
     - Mark messages as Read/Replied, and delete inquiries.

---

## 5. UI Design & Aesthetics Guidelines
* **Color Palette**:
  - Backgrounds: Dark mode default (Deep Carbon `#0b0c10`, Shadow Gray `#1f2833`).
  - Accents: Hell Red Neon (`#e50914` or HSL `357, 89%, 47%`), High-energy Green (`#39ff14`), Premium Gold (`#d4af37` / HSL `45, 60%, 53%`).
  - Text: High Contrast White (`#ffffff`), Muted Slate (`#c5a059` / `#a9b2c3`).
* **Typography**: Modern fonts (e.g., 'Outfit' or 'Inter' via Google Fonts). Heading tags (`H1`, `H2`) must be bold, aggressive, and stylized to match the energy drink branding.
* **Layout**: CSS Grid and Flexbox for absolute responsiveness.
* **Animations**: CSS Transitions for hover effects, `@keyframes` for fade-ins and sliding banners, glassmorphism for navigation header and detail cards (`backdrop-filter: blur(10px)`).

---

## 6. Database Schema Specifications

### 6.1. Product Schema
```js
{
  name: { type: String, required: true },
  category: { type: String, enum: ['Energy Drink', 'Functional Drink', 'Ice Coffee'], required: true },
  caffeine: { type: String, default: "32 mg/100 ml" },
  vitamins: [String],
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### 6.2. News Schema
```js
{
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: { type: String, default: 'HELL Team' }
}
```

### 6.3. Inquiry Schema
```js
{
  name: { type: String, required: true },
  email: { type: String, required: true },
  category: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['Unread', 'Read', 'Replied'], default: 'Unread' },
  createdAt: { type: Date, default: Date.now }
}
```

### 6.4. User Schema (Admin)
```js
{
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  createdAt: { type: Date, default: Date.now }
}
```

---

## 7. API Routing Architecture
* **Auth**:
  - `POST /api/auth/login` - Verify admin credentials and return JWT.
* **Products**:
  - `GET /api/products` - Public: List all products (with category/search queries).
  - `GET /api/products/:id` - Public: Get specific product details.
  - `POST /api/products` - Admin: Add a new product.
  - `PUT /api/products/:id` - Admin: Update an existing product.
  - `DELETE /api/products/:id` - Admin: Remove a product.
* **News**:
  - `GET /api/news` - Public: Get news list (with pagination support).
  - `GET /api/news/:id` - Public: Get a single news article.
  - `POST /api/news` - Admin: Post a news article.
  - `PUT /api/news/:id` - Admin: Edit an article.
  - `DELETE /api/news/:id` - Admin: Remove an article.
* **Inquiries**:
  - `POST /api/inquiries` - Public: Submit contact form.
  - `GET /api/inquiries` - Admin: Fetch all inquiries.
  - `PUT /api/inquiries/:id` - Admin: Update inquiry status (Read/Replied).
  - `DELETE /api/inquiries/:id` - Admin: Delete inquiry.
