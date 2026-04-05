import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie 
} from 'recharts';
import { LayoutDashboard, ReceiptText, ShieldCheck, User, TrendingUp, Wallet, ArrowUpCircle, ArrowDownCircle, Search ,Sun,Moon} from 'lucide-react';

const INITIAL_TRANSACTIONS = [
  { id: 1, date: '2024-03-01', amount: 5000, category: 'Salary', type: 'income' },
  { id: 2, date: '2024-03-02', amount: 150, category: 'Food', type: 'expense' },
  { id: 3, date: '2024-03-05', amount: 200, category: 'Entertainment', type: 'expense' },
  { id: 4, date: '2024-03-07', amount: 1200, category: 'Freelance', type: 'income' },
  { id: 5, date: '2024-03-10', amount: 800, category: 'Rent', type: 'expense' },
  { id: 6, date: '2024-03-12', amount: 60, category: 'Food', type: 'expense' },
  { id: 7, date: '2024-03-15', amount: 100, category: 'Shopping', type: 'expense' },
];

export default function App() {
  // --- STATE ---
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('my_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [role, setRole] = useState('viewer'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // --- THEME STATE & USEEFFECT (Requirement 6 Enhancement) ---
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  useEffect(() => {
    // This is the key to activating Tailwind's 'dark:' classes
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('my_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // --- LOGIC & FILTERING ---
  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((a, b) => a + b.amount, 0);
    
    const categoryTotals = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
        return acc;
      }, {});
      const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
  name,
  value
}));
    
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];

    return { income, expenses, balance: income - expenses, topCategory ,pieData};
  }, [transactions]);

  const deleteTransaction = (id) => {
    if (role !== 'admin') return;
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    // Body is now dark-mode aware
    <div className="min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans pb-12 transition-colors duration-300 relative overflow-hidden">
      
      {/* --- Vibrant Gradient Background Blobs (Essential for Transparent UI) --- */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-1/2 -right-60 w-[500px] h-[500px] bg-blue-600/15 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[-100px] left-20 w-80 h-80 bg-red-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER & ROLE TOGGLE (Now uses .glass-card) */}
      <nav className="glass-card sticky top-0 z-50 px-6 py-4 mb-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg">
              <TrendingUp size={20} />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tighter">Fin<span className='text-blue-500'>Flow</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme}
              className="glass-card p-3 rounded-xl text-[var(--text-secondary)] hover:text-blue-500 transition active:scale-95"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Role Switcher */}
            <div className="flex items-center gap-4 bg-black/5 dark:bg-white/5 p-1.5 rounded-full px-4 border border-black/5 dark:border-white/5">
              <span className="text-[11px] font-bold text-[var(--text-secondary)] uppercase flex items-center gap-1.5 tracking-wider">
                {role === 'admin' ? <ShieldCheck size={15}/> : <User size={15}/>} {role}
              </span>
              <button 
                onClick={() => setRole(role === 'admin' ? 'viewer' : 'admin')}
                className="text-xs glass-card border-none px-4 py-1.5 rounded-full font-semibold transition hover:bg-white/10 dark:hover:bg-white/5 active:scale-95"
              >
                Switch to {role === 'admin' ? 'Viewer' : 'Admin'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* SUMMARY CARDS (With subtle accent borders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass-card p-7 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-blue-500 group-hover:w-full transition-all duration-300 opacity-80" />
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl"><Wallet size={22}/></div>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-950 px-3 py-1.5 rounded-full">+12.5%</span>
            </div>
            <p className="text-sm text-[var(--text-secondary)] font-medium tracking-tight relative z-10">Total Balance</p>
            <h2 className="text-4xl font-extrabold mt-1 tracking-tighter relative z-10">${stats.balance.toLocaleString()}</h2>
          </div>

          <div className="glass-card p-7 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-emerald-500 group-hover:w-full transition-all duration-300 opacity-80" />
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl w-fit mb-5 relative z-10"><ArrowUpCircle size={22}/></div>
            <p className="text-sm text-[var(--text-secondary)] font-medium tracking-tight relative z-10">Monthly Income</p>
            <h2 className="text-4xl font-extrabold mt-1 text-emerald-600 dark:text-emerald-400 tracking-tighter relative z-10">${stats.income.toLocaleString()}</h2>
          </div>

          <div className="glass-card p-7 rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 h-full w-1.5 bg-red-500 group-hover:w-full transition-all duration-300 opacity-80" />
            <div className="p-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-xl w-fit mb-5 relative z-10"><ArrowDownCircle size={22}/></div>
            <p className="text-sm text-[var(--text-secondary)] font-medium tracking-tight relative z-10">Total Expenses</p>
            <h2 className="text-4xl font-extrabold mt-1 text-red-600 dark:text-red-400 tracking-tighter relative z-10">${stats.expenses.toLocaleString()}</h2>
          </div>
        </div>

        {/* CHARTS & INSIGHTS */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
  
  {/* Line Chart - Span 2 columns for more width */}
  <div className="glass-card p-7 rounded-3xl h-96 lg:col-span-2">
    <h3 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-6 flex items-center gap-2 tracking-wider">
      <TrendingUp size={16} className='text-blue-500'/> Balance Trend
    </h3>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={transactions} margin={{ top: 5, right: 20, left: 0, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
        <XAxis 
          dataKey="date" 
          fontSize={10} 
          tickMargin={12} 
          axisLine={false} 
          tickLine={false} 
          stroke="var(--text-secondary)"
          interval="preserveStartEnd" // This prevents crowding
          minTickGap={30}             // This ensures space between dates
        />
        <YAxis fontSize={10} axisLine={false} tickLine={false} stroke="var(--text-secondary)" />
        <Tooltip 
          contentStyle={{ 
            background: 'var(--card-bg)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '16px', 
            border: '1px solid var(--card-border)', 
            color: 'var(--text-primary)'
          }} 
        />
        <Line type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={4} dot={{ r: 4, fill: '#3b82f6' }} />
      </LineChart>
    </ResponsiveContainer>
  </div>

  {/* Pie Chart - Categorical Visualization (Requirement 1) */}
  <div className="glass-card p-7 rounded-3xl h-96">
    <h3 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase mb-6 tracking-wider">Expense Breakdown</h3>
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={stats.pieData}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {stats.pieData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4]} />
          ))}
        </Pie>
        <Tooltip 
           contentStyle={{ 
            background: 'var(--card-bg)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '12px', 
            border: 'none'
          }} 
        />
      </PieChart>
    </ResponsiveContainer>
    {/* Simple Legend */}
    <div className="flex flex-wrap gap-2 justify-center mt-[-40px]">
      {stats.pieData.map((entry, index) => (
        <div key={index} className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full" style={{ background: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b'][index % 4] }} />
          <span className="text-[10px] text-[var(--text-secondary)]">{entry.name}</span>
        </div>
      ))}
    </div>
  </div>
</div>

          <div className="glass-card p-7 rounded-3xl mb-8">
            <h3 className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider ">Insights (Requirement 4)</h3>
            <div className="space-y-5">
              <div className="flex items-center justify-between p-5 bg-black/5 dark:bg-white/5 rounded-2xl border border-black/5 dark:border-white/5">
                <div>
                  <p className="text-xs text-[var(--text-secondary)] uppercase font-bold tracking-tight">Highest Spending Category</p>
                  <p className="text-xl font-bold mt-1 tracking-tight">{stats.topCategory ? stats.topCategory[0] : 'N/A'}</p>
                </div>
                <div className="text-right text-red-600 dark:text-red-400 text-xl font-bold tracking-tight">${stats.topCategory ? stats.topCategory[1] : 0}</div>
              </div>
              <div className="p-5 glass-card border border-blue-500/20 bg-blue-600/5 rounded-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/50"/>
                <p className="text-sm text-[var(--text-primary)] relative z-10">
                  💡 <strong>Useful Observation:</strong> Your income is {stats.income > stats.expenses ? <span className='text-emerald-500 font-semibold'>higher</span> : <span className='text-red-500 font-semibold'>lower</span>} than your expenses. You have saved <strong className='text-blue-500'>${stats.balance.toLocaleString()}</strong> this period.
                </p>
              </div>
            </div>
          </div>
        

        {/* TRANSACTIONS TABLE (With subtle transparency) */}
        <div className="glass-card rounded-3xl overflow-hidden mb-12">
          <div className="p-7 border-b border-[var(--card-border)] flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] rounded-xl border border-black/5 dark:border-white/5"><ReceiptText size={20} /></div>
              <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <div className="relative flex-grow md:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={17} />
                <input 
                  type="text" 
                  placeholder="Search by category..." 
                  className="pl-12 pr-4 py-3 bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none placeholder:text-[var(--text-secondary)] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select 
                className="bg-black/5 dark:bg-white/5 border-none rounded-xl text-sm px-5 py-3 outline-none cursor-pointer focus:ring-2 focus:ring-blue-500 transition-all"
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
              
              {role === 'admin' && (
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-700 transition active:scale-95 whitespace-nowrap shadow-lg shadow-blue-500/30">
                  + Add
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-black/5 dark:bg-white/5 text-[var(--text-secondary)] text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="px-7 py-5">Date</th>
                  <th className="px-7 py-5">Category</th>
                  <th className="px-7 py-5">Type</th>
                  <th className="px-7 py-5">Amount</th>
                  {role === 'admin' && <th className="px-7 py-5 text-center">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--card-border)]">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={role === 'admin' ? 5 : 4} className="px-7 py-24 text-center">
                       <div className="flex flex-col items-center gap-3 text-[var(--text-secondary)] italic">
                          <Search size={48} strokeWidth={1} />
                          <p className='text-sm mt-2'>No transactions found matching your criteria.</p>
                       </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition duration-150 relative z-10">
                      <td className="px-7 py-5 text-sm font-medium tracking-tight text-[var(--text-secondary)]">{t.date}</td>
                      <td className="px-7 py-5 font-semibold text-[var(--text-primary)] tracking-tight">{t.category}</td>
                      <td className="px-7 py-5">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.type === 'income' ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className={`px-7 py-5 font-extrabold text-lg tracking-tight ${t.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[var(--text-primary)]'}`}>
                        {t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString()}
                      </td>
                      {role === 'admin' && (
                        <td className="px-7 py-5 text-center">
                          <button 
                            onClick={() => deleteTransaction(t.id)}
                            className="text-red-400 hover:text-red-600 dark:hover:text-red-300 font-bold text-xs transition px-3 py-1.5 rounded-full glass-card hover:border-red-500/30"
                          >
                            DELETE
                          </button>
                        </td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}