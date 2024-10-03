"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, X, Calendar, List, Edit, Trash2 } from "lucide-react";

interface Subscription {
  id: string;
  name: string;
  amount: number;
  color: string;
  date: number;
}

const SubscriptionCalendar: React.FC = () => {
  const currentDate = new Date(); // Changed from state to constant
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSubscription, setEditingSubscription] =
    useState<Subscription | null>(null);
  const [newSubscription, setNewSubscription] = useState({
    name: "",
    amount: "",
    date: "",
  });
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [hoveredSubscription, setHoveredSubscription] =
    useState<Subscription | null>(null);

  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const calculateMonthlySpend = useCallback(() => {
    const total = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);
    setMonthlySpend(total);
  }, [subscriptions]);

  useEffect(() => {
    calculateMonthlySpend();
  }, [calculateMonthlySpend]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const addSubscription = () => {
    if (
      newSubscription.name &&
      newSubscription.amount &&
      newSubscription.date
    ) {
      const newSub: Subscription = {
        id: Date.now().toString(),
        name: newSubscription.name,
        amount: parseFloat(newSubscription.amount),
        date: parseInt(newSubscription.date),
        color: getRandomColor(),
      };
      setSubscriptions([...subscriptions, newSub]);
      setNewSubscription({ name: "", amount: "", date: "" });
      setShowAddForm(false);
    }
  };

  const editSubscription = () => {
    if (editingSubscription) {
      setSubscriptions(
        subscriptions.map((sub) =>
          sub.id === editingSubscription.id ? editingSubscription : sub,
        ),
      );
      setEditingSubscription(null);
    }
  };

  const deleteSubscription = (id: string) => {
    setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
  };

  const getRandomColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderCalendarView = () => (
    <div className="grid grid-cols-7 gap-2 max-w-4xl mx-auto relative">
      {daysOfWeek.map((day) => (
        <div key={day} className="text-center text-sm font-semibold p-2">
          {day}
        </div>
      ))}
      {Array.from({ length: 42 }, (_, i) => {
        const dayNumber = i - getFirstDayOfMonth(currentDate) + 1;
        const isValidDay =
          dayNumber > 0 && dayNumber <= getDaysInMonth(currentDate);
        const subscription = subscriptions.find(
          (sub) => sub.date === dayNumber,
        );

        return (
          <div
            key={i}
            className={`aspect-square flex items-center justify-center rounded-lg relative ${
              isValidDay
                ? subscription
                  ? subscription.color
                  : "bg-gray-800"
                : "bg-transparent"
            }`}
          >
            {isValidDay && (
              <>
                <span className="text-lg">{dayNumber}</span>
                {subscription && (
                  <div
                    className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full cursor-pointer"
                    onMouseEnter={() => setHoveredSubscription(subscription)}
                    onMouseLeave={() => setHoveredSubscription(null)}
                  />
                )}
              </>
            )}
          </div>
        );
      })}
      {hoveredSubscription && (
        <div
          className="absolute bg-gray-800 text-white p-2 rounded-lg shadow-lg z-10"
          style={{ top: "100%", left: "50%", transform: "translateX(-50%)" }}
        >
          <p className="font-bold">{hoveredSubscription.name}</p>
          <p>${hoveredSubscription.amount.toFixed(2)}</p>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2 overflow-y-auto max-h-[calc(100vh-200px)] max-w-3xl mx-auto">
      {subscriptions
        .sort((a, b) => a.date - b.date)
        .map((sub) => (
          <div
            key={sub.id}
            className={`p-4 rounded-lg ${sub.color} flex justify-between items-center`}
          >
            <div>
              <div className="font-bold text-lg">{sub.name}</div>
              <div className="flex justify-between mt-2">
                <span className="text-xl font-semibold">
                  ${sub.amount.toFixed(2)}
                </span>
                <span className="ml-4">Due: {sub.date}</span>
              </div>
            </div>
            <div>
              <button
                onClick={() => setEditingSubscription(sub)}
                className="mr-2 p-2 bg-yellow-500 rounded-full"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={() => deleteSubscription(sub.id)}
                className="p-2 bg-red-500 rounded-full"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
    </div>
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col p-6 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{`${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`}</h2>
        <div className="flex items-center">
          <div className="bg-gray-700 px-4 py-2 rounded-full mr-4">
            <span className="text-sm">Monthly spend</span>
            <div className="text-xl font-bold">${monthlySpend.toFixed(2)}</div>
          </div>
          <button
            onClick={() => setView("calendar")}
            className={`mr-2 p-2 rounded-lg ${
              view === "calendar" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <Calendar size={20} />
          </button>
          <button
            onClick={() => setView("list")}
            className={`p-2 rounded-lg ${
              view === "list" ? "bg-blue-500" : "bg-gray-700"
            }`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div className="flex-grow flex items-center justify-center mb-6">
        {view === "calendar" ? renderCalendarView() : renderListView()}
      </div>

      <div className="flex justify-center">
        {!showAddForm && !editingSubscription && (
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg text-lg"
          >
            <Plus className="mr-2" /> Add Subscription
          </button>
        )}
      </div>

      {(showAddForm || editingSubscription) && (
        <div className="mt-4 bg-gray-800 p-6 rounded-lg max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">
              {editingSubscription ? "Edit Subscription" : "Add Subscription"}
            </h3>
            <button
              onClick={() => {
                setShowAddForm(false);
                setEditingSubscription(null);
              }}
              className="text-gray-400 hover:text-white"
            >
              <X size={24} />
            </button>
          </div>
          <input
            type="text"
            placeholder="Subscription name"
            value={
              editingSubscription
                ? editingSubscription.name
                : newSubscription.name
            }
            onChange={(e) =>
              editingSubscription
                ? setEditingSubscription({
                    ...editingSubscription,
                    name: e.target.value,
                  })
                : setNewSubscription({
                    ...newSubscription,
                    name: e.target.value,
                  })
            }
            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
          />
          <input
            type="number"
            placeholder="Amount"
            value={
              editingSubscription
                ? editingSubscription.amount
                : newSubscription.amount
            }
            onChange={(e) =>
              editingSubscription
                ? setEditingSubscription({
                    ...editingSubscription,
                    amount: parseFloat(e.target.value),
                  })
                : setNewSubscription({
                    ...newSubscription,
                    amount: e.target.value,
                  })
            }
            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
          />
          <input
            type="number"
            placeholder="Day of month"
            min="1"
            max="31"
            value={
              editingSubscription
                ? editingSubscription.date
                : newSubscription.date
            }
            onChange={(e) =>
              editingSubscription
                ? setEditingSubscription({
                    ...editingSubscription,
                    date: parseInt(e.target.value),
                  })
                : setNewSubscription({
                    ...newSubscription,
                    date: e.target.value,
                  })
            }
            className="w-full bg-gray-700 text-white p-3 rounded-lg mb-4"
          />
          <button
            onClick={editingSubscription ? editSubscription : addSubscription}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg"
          >
            {editingSubscription ? "Update" : "Add"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionCalendar;
