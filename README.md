# PropFit - Rental Property Management Calculator

A modern, responsive rental property management calculator built with SvelteKit, TypeScript, and TailwindCSS. This application helps property managers track tenant payments, expenses, and shareholder distributions for monthly rental operations.

## ✨ Features

### Core Functionality

- **Monthly Rental Payment Tracking** - Track payments from multiple tenants
- **Expense Management** - Manage internet, utilities, maintenance, and other expenses
- **Automatic Calculations** - Real-time balance calculations and payment status
- **Profit Distribution** - Automatic shareholder distribution based on ownership percentages
- **Payment Status Tracking** - Visual status indicators (Paid, Pending, Advance Payment)

### Export Features

- **PDF Export** - Generate formatted PDF reports with all monthly data
- **Excel Export** - Export to Excel with multiple sheets for detailed analysis
- **Print-Friendly** - Optimized print styling for physical reports
- **Month Selection** - Generate reports for any month with proper naming

### Technical Features

- **No Data Persistence** - Fresh start each session, perfect for monthly calculations
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **TypeScript Support** - Full type safety throughout the application
- **Component Architecture** - Modular, reusable Svelte components
- **Comprehensive Testing** - Unit tests for all calculation logic

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

- **6 Tenants**: Franz (Unit 1), Ging Bagro, Ryzza Maglanque, Shane Mikaela Galang, Shiky Cagaitan, Lyn Villanueva (all Unit 3)
- **Default Expenses**: Internet (₱1,585.54), Water, Electricity, Maintenance, Other
- **Shareholders**: Zedd (30%), Mommy (35%), Maru (35%)

### Monthly Workflow

1. **Select Month** - Choose the reporting month using the month selector
2. **Enter Payments** - Input tenant payments and payment dates
3. **Record Expenses** - Add monthly expenses for utilities and maintenance
4. **Review Summary** - Check total collections, expenses, and net income
5. **Export Reports** - Download PDF or Excel reports for record keeping
6. **Reset for Next Month** - Use reset button to start fresh for next month

### Key Calculations

- **Tenant Balance** = Monthly Rent - Amount Paid
- **Total Collected** = Sum of all tenant payments
- **Net Income** = Total Collected - Total Expenses
- **Shareholder Distribution** = Net Income × Ownership Percentage

## 🛠️ Technology Stack

- **Framework**: SvelteKit
- **Language**: TypeScript
- **Styling**: TailwindCSS v4
- **Testing**: Vitest + Testing Library
- **Package Manager**: pnpm
- **Icons**: Lucide Svelte
- **PDF Generation**: jsPDF + jsPDF-AutoTable
- **Excel Export**: SheetJS (xlsx)
- **Deployment**: GitHub Pages (Static Adapter)

## 📁 Project Structure

```
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

- [ ] Data persistence options (localStorage, cloud storage)
- [ ] Multi-property support
- [ ] Advanced reporting features
- [ ] Tenant communication features
- [ ] Mobile app version

---

**PropFit** - Making rental property management simple and efficient! 🏠✨
