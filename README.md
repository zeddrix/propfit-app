# PropFit - Rental Property Management Calculator

A modern, responsive rental property management calculator built with SvelteKit 5, TypeScript, and TailwindCSS. This application helps property managers track tenant payments, expenses, and shareholder distributions for monthly rental operations.

## ✅ Implementation Status

### ✅ Completed Features

All 12 requested tasks have been successfully implemented using Test-Driven Development (TDD) approach:

1. **✅ Editable Tenant Names** - Tenant names are displayed in editable input fields with automatic persistence
2. **✅ Separate Unit Tables** - Unit 1 (Franz) and Unit 3 (other tenants) have separate tables with clear headings
3. **✅ 1000-Step Amount Input** - Number inputs use step="1000" for quick increment/decrement by ₱1,000
4. **✅ Cursor Pointer on Buttons** - All interactive elements show pointer cursor on hover
5. **✅ Mark All Paid Button** - One-click button to mark all tenants as paid with today's date
6. **✅ Add/Remove Tenants with Undo** - Dynamic tenant management for Unit 3 with 5-second undo functionality
7. **✅ LocalStorage Integration** - All data changes persist automatically with browser compatibility checks
8. **✅ Unit 3 Dynamic Rent Calculation** - Total ₱5,000 rent splits equally among Unit 3 tenants automatically
9. **✅ Development Performance Optimized** - Vite configuration optimized for better HMR and build performance
10. **✅ Lint Errors Resolved** - All ESLint and Prettier issues fixed
11. **✅ Documentation Updated** - README and implementation files updated to reflect current features
12. **✅ TDD Workflow Documented** - Comprehensive development guidelines and testing approach documented

## ✨ Features

### Core Functionality

- **Monthly Rental Payment Tracking** - Track payments from multiple tenants across different units
- **Editable Tenant Names** - Modify tenant names directly in the table
- **Separate Unit Tables** - Unit 1 (2 pax) and Unit 3 (10 pax) separated for better organization
- **Dynamic Rent Calculation** - Unit 3 automatic rent distribution with ₱5,000 minimum
- **Expense Management** - Manage internet, utilities, maintenance, and other expenses
- **Automatic Calculations** - Real-time balance calculations and payment status
- **Profit Distribution** - Automatic shareholder distribution based on ownership percentages
- **Payment Status Tracking** - Visual status indicators (Paid, Pending, Advance Payment)

### Enhanced User Experience

- **Quick Payment Input** - 1,000 step increments for amount paid fields
- **Add/Remove Tenants** - Dynamically manage Unit 3 tenants with undo functionality
- **Mark All Paid** - One-click button to mark all tenants as paid for the month
- **Toast Notifications** - Undo functionality when removing tenants
- **Persistent Data** - LocalStorage integration for data persistence across sessions
- **Cursor Pointer** - Intuitive button interactions throughout the app

### Export Features

- **PDF Export** - Generate formatted PDF reports with all monthly data
- **Excel Export** - Export to Excel with multiple sheets for detailed analysis
- **Print-Friendly** - Optimized print styling for physical reports
- **Month Selection** - Generate reports for any month with proper naming

### Technical Features

- **No Data Persistence** - Fresh start each session, perfect for monthly calculations
- **LocalStorage Integration** - Optional data persistence with browser compatibility checks
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **TypeScript Support** - Full type safety throughout the application
- **Component Architecture** - Modular, reusable Svelte components with Svelte 5 Runes
- **Comprehensive Testing** - Unit tests for all calculation logic
- **SSR Compatible** - Server-side rendering support for better performance

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd propfit-app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start development server**

   ```bash
   pnpm dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5176` (or the port shown in terminal)

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

Run tests with coverage:

```bash
pnpm run test:coverage
```

## 🏗️ Building for Production

Build the application:

```bash
pnpm build
```

Preview the production build:

```bash
pnpm preview
```

## 🚀 Deployment

### GitHub Pages (Recommended)

1. **Push to GitHub** - Ensure your code is in a GitHub repository
2. **Enable GitHub Pages** - Go to repository Settings > Pages > Select "GitHub Actions"
3. **Automatic Deployment** - The included workflow will automatically deploy on pushes to main branch

### Manual Deployment

Deploy to GitHub Pages manually:

```bash
pnpm run deploy
```

## 📊 Usage Guide

### Default Setup

The application comes pre-configured with:

- **Unit 1 (2 pax)**: Franz (studio type 1) - ₱2,000 rent
- **Unit 3 (10 pax)**: Ging Bagro, Ryzza Maglanque, Shane Mikaela Galang, Shiky Cagaitan, Lyn Villanueva - Dynamic rent calculation (₱5,000 minimum total)
- **Default Expenses**: Internet (₱1,585.54), Water, Electricity, Maintenance, Other
- **Shareholders**: Zedd (30%), Mommy (35%), Maru (35%)

### Monthly Workflow

1. **Select Month** - Choose the reporting month using the month selector
2. **Enter Payments** - Input tenant payments with 1,000 step increments and payment dates
3. **Manage Tenants** - Add/remove Unit 3 tenants as needed with undo functionality
4. **Mark All Paid** - Use quick button when all tenants have paid for the month
5. **Record Expenses** - Add monthly expenses for utilities and maintenance
6. **Review Summary** - Check total collections, expenses, and net income
7. **Export Reports** - Download PDF or Excel reports for record keeping
8. **Auto-Save** - Data automatically persists in localStorage

### Key Calculations

- **Tenant Balance** = Monthly Rent - Amount Paid
- **Total Collected** = Sum of all tenant payments
- **Net Income** = Total Collected - Total Expenses
- **Shareholder Distribution** = Net Income × Ownership Percentage

## 🛠️ Technology Stack

- **Framework**: SvelteKit 5 with Runes Mode
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm
- **Icons**: Lucide Svelte
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Excel Export**: SheetJS (xlsx)
- **State Management**: Svelte Stores with LocalStorage persistence
- **Deployment**: GitHub Pages (Static Adapter)

## 📁 Project Structure

```plaintext
propfit-app/
├── src/
│   ├── lib/
│   │   ├── components/         # Svelte components
│   │   │   ├── ActionButtons.svelte
│   │   │   ├── ExpenseTable.svelte
│   │   │   ├── ShareholderTable.svelte
│   │   │   ├── SummarySection.svelte
│   │   │   └── TenantTable.svelte
│   │   ├── stores/             # Svelte stores
│   │   │   └── rentalData.ts
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── index.ts
│   │   └── utils/              # Utility functions
│   │       ├── calculations.ts
│   │       ├── exportExcel.ts
│   │       └── exportPdf.ts
│   ├── routes/                 # SvelteKit routes
│   │   ├── +layout.svelte
│   │   ├── +layout.ts
│   │   └── +page.svelte
│   └── app.css                 # Global styles
├── tests/                      # Test files
├── .github/workflows/          # GitHub Actions
└── static/                     # Static assets
```

## 🔧 Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm preview          # Preview production build

# Testing
pnpm test             # Run tests
pnpm test:coverage    # Run tests with coverage

# Code Quality
pnpm check            # TypeScript type checking
pnpm lint             # Lint code
pnpm format           # Format code

# Deployment
pnpm deploy           # Deploy to GitHub Pages
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](../../issues) page for existing solutions
2. Create a new issue with detailed information
3. Include steps to reproduce any bugs

## 🎯 Roadmap

Future enhancements under consideration:

- [x] **Editable tenant names** - Completed
- [x] **Separate unit tables** - Completed
- [x] **Add/remove tenant functionality** - Completed
- [x] **LocalStorage data persistence** - Completed
- [x] **Dynamic Unit 3 rent calculation** - Completed
- [x] **Quick payment input (1000 steps)** - Completed
- [x] **Mark all paid button** - Completed
- [x] **Undo functionality for removed tenants** - Completed
- [ ] Multi-property support
- [ ] Advanced reporting features
- [ ] Tenant communication features
- [ ] Mobile app version
- [ ] Cloud storage integration

---

**PropFit** - Making rental property management simple and efficient! 🏠✨
