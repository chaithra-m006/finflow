FinFlow | Modern Financial Dashboard

FinFlow is a high-performance, transparent "Glassmorphism" dashboard built with React and Tailwind CSS v4. It allows users to track their financial health, visualize spending patterns, and manage transactions with a role-based interface.


Steps to get the project running locally:

1.Enter the project folder
   
   cd financial-dashboard

2.Install Dependencies:


npm install
Start the Development Server:
npm run dev
View in Browser:
Open http://localhost:5173 to see the dashboard.

3. Tech Stack
# Framework: React (Vite)

# Styling: Tailwind CSS v4 (Glassmorphism & Dark Mode)

# Charts: Recharts (Responsive Line & Pie charts)

# Icons: Lucide-React

# State Management: React Hooks (useState, useMemo, useEffect)

~~~ Core Features
1. Dashboard Analytics 
Summary Cards: Real-time calculation of Total Balance, Income, and Expenses.

Balance Trend: A time-based line chart visualizing financial movement.

Expense Breakdown: A categorical pie chart showing where money is spent.

Automated Insights: Dynamic logic that identifies the highest spending category and provides a textual summary of financial health.

2. Transaction Management 
Search & Filter: Real-time filtering by category name and transaction type (Income/Expense).

Data Persistence: Integrated with localStorage so your data survives page refreshes.

Empty States: Graceful UI handling for cases where no data matches the current filters.

3. Role-Based UI 
Viewer Mode: Read-only access to charts and transaction history.

Admin Mode: Unlocks the ability to delete transactions and view the "Add Transaction" interface.

Toggle: A seamless theme/role switcher located in the navigation bar for demonstration.

4. Design Philosophy
FinFlow utilizes a Glassmorphism aesthetic, characterized by:

Transparency: Semi-transparent cards with a 12px background blur.

Vibrancy: Strategic use of background color blobs to provide depth behind the frosted glass.

Adaptive Theme: Full support for Light and Dark modes using CSS variables and Tailwind's dark mode selectors.

# Approach & Logic
Data Flow: Data is managed in a central state within App.jsx. Computed values (like total balance or pie chart groupings) are wrapped in useMemo to ensure they only recalculate when the transaction list actually changes, optimizing performance.

Responsiveness: The grid system uses sm, md, and lg breakpoints to ensure the dashboard looks great on mobile, tablets, and wide-screen monitors.

Clean Code: Components are styled using utility-first CSS, keeping the stylesheet minimal and the logic co-located with the UI.
