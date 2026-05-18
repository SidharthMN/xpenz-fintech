# Xpenz — AWS Cloud Expense Tracker

A cloud-native fintech expense tracking dashboard built with **React Vite + Tailwind CSS + Chart.js**, connected to a fully serverless AWS backend (Lambda + API Gateway + DynamoDB).

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🏗 Build for Production

```bash
npm run build
# Output in /dist — deploy to S3 or GitHub Pages
```

## 💻 Electron Desktop

```bash
npm run electron:dev
```

Open the desktop wrapper while Vite runs in development.

```bash
npm run electron:serve
```

Build the production desktop bundle:

```bash
npm run electron:build
```

---

## ☁️ AWS Backend

| Service        | Details                                              |
|----------------|------------------------------------------------------|
| API Gateway    | `https://o3sqoe6ba1.execute-api.ap-south-1.amazonaws.com/prod` |
| DynamoDB Table | `expenses` (PK: `userId`, SK: `expenseId`)           |
| Region         | `ap-south-1` (Mumbai)                                |
| Runtime        | Node.js 22.x Lambda                                  |

### Endpoints

| Method | Route           | Purpose                    |
|--------|-----------------|----------------------------|
| `GET`  | `/get-expenses` | Fetch all expenses          |
| `POST` | `/add-expense`  | Add a new expense           |

---

## 📁 Project Structure

```
xpenz/
├── src/
│   ├── api.js                   # AWS API calls + data utils
│   ├── App.jsx                  # Root layout & state
│   ├── main.jsx                 # Entry point
│   ├── index.css                # Tailwind + custom styles
│   ├── hooks/
│   │   └── useExpenses.js       # Data fetching hook
│   └── components/
│       ├── Sidebar.jsx          # Purple sidebar nav
│       ├── StatsCard.jsx        # KPI cards
│       ├── BarChart.jsx         # Monthly bar chart
│       ├── DonutCharts.jsx      # Category donut charts
│       ├── TransactionsTable.jsx # Searchable expense list
│       └── AddExpenseModal.jsx  # Add expense form
├── index.html
├── vite.config.js
├── tailwind.config.js
└── package.json
```

---

## 🔧 Customise

- **Add new expense categories**: edit `CATEGORY_COLORS` and `ALL_CATEGORIES` in `src/api.js`
- **Change default user**: update `DEFAULT_USER` in `src/api.js`
- **Add income API**: hook it into `useExpenses.js` and replace the illustrative calculation

## 🔐 Environment

- Use `.env` for real Firebase credentials.
- Do not commit `.env` or any secret keys.
- Preserve `.env.example` as the template for shared repo setup.

---

## 🎨 Tech Stack

- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Chart.js 4** + **react-chartjs-2**
- **react-icons**
- **AWS Lambda** + **API Gateway** + **DynamoDB**

- ## 📦 GitHub Repository

https://github.com/SidharthMN/xpenz-fintech

## 🌐 Live Demo

https://xpenz-fintech.netlify.app/
