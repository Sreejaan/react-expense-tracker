import { useState } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import './App.css';

export default function App() {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [category, setCategory] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const addExpense = () => {
    if (!amount || !category || !description) {
      alert("Please fill all the details!");
      return;
    }

    const newExpense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      category,
      date: new Date().toLocaleString()
    };

    setExpenses([newExpense, ...expenses]);
    setAmount('');
    setCategory('');
    setDescription('');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const filteredExpenses = expenses.filter(e => {
    const matchCategory = categoryFilter ? e.category === categoryFilter : true;
    const matchMonth = monthFilter
      ? new Date(e.date).getMonth() === parseInt(monthFilter)
      : true;
    return matchCategory && matchMonth;
  });

  const pieData = Object.values(
    filteredExpenses.reduce((acc, expense) => {
      acc[expense.category] = acc[expense.category] || { name: expense.category, value: 0 };
      acc[expense.category].value += expense.amount;
      return acc;
    }, {})
  );

  const barData = Object.values(
    filteredExpenses.reduce((acc, expense) => {
      const month = new Date(expense.date).toLocaleString('default', { month: 'short' });
      acc[month] = acc[month] || { name: month, total: 0 };
      acc[month].total += expense.amount;
      return acc;
    }, {})
  );

  return (
    <div className="app-container">
      <h1 className="title">💰 Expense Tracker</h1>

      <div className="form">
        <input
          className="input"
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
        />
        <select
          className="select"
          value={category}
          onChange={e => setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Saving">Saving</option>
          <option value="Other">Other</option>
        </select>
        <input
          className="input"
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        <button className="button" onClick={addExpense}>Add Expense</button>
      </div>

      <div className="filters">
        <select
          className="select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Food">Food</option>
          <option value="Travel">Travel</option>
          <option value="Saving">Saving</option>
          <option value="Other">Other</option>
        </select>
        <select
          className="select"
          value={monthFilter}
          onChange={e => setMonthFilter(e.target.value)}
        >
          <option value="">All Months</option>
          <option value="0">Jan</option>
          <option value="1">Feb</option>
          <option value="2">Mar</option>
          <option value="3">Apr</option>
          <option value="4">May</option>
          <option value="5">Jun</option>
          <option value="6">Jul</option>
          <option value="7">Aug</option>
          <option value="8">Sep</option>
          <option value="9">Oct</option>
          <option value="10">Nov</option>
          <option value="11">Dec</option>
        </select>
      </div>

      <ul className="expense-list">
        {filteredExpenses.map((e) => (
          <li className="expense-item" key={e.id}>
            {e.amount} | {e.category} | {e.description} | {e.date}
            <button className="delete-button" onClick={() => deleteExpense(e.id)}>❌</button>
          </li>
        ))}
      </ul>

      <div className="charts">
        <h2>Category Breakdown</h2>
        <PieChart width={300} height={300}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            fill="#8884d8"
            label
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={["#8884d8", "#82ca9d", "#ffc658", "#ff8042"][index % 4]} />
            ))}
          </Pie>
        </PieChart>

        <h2>Monthly Overview</h2>
        <BarChart width={500} height={300} data={barData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
}
