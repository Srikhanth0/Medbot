import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, ChevronLeft, ChevronRight, Clock, Bell, Calendar as CalendarIcon, X } from 'lucide-react';

interface Reminder {
  id: string;
  date: Date;
  title: string;
  description: string;
  time: string;
  type: 'appointment' | 'medication' | 'checkup' | 'other';
}

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      date: new Date(2025, 7, 10), // August 10, 2025
      title: 'Doctor Appointment',
      description: 'Regular checkup with Dr. Smith',
      time: '10:00 AM',
      type: 'appointment'
    },
    {
      id: '2',
      date: new Date(2025, 7, 15), // August 15, 2025
      title: 'Take Medication',
      description: 'Blood pressure medication',
      time: '8:00 AM',
      type: 'medication'
    }
  ]);
  const [newReminder, setNewReminder] = useState({
    title: '',
    description: '',
    time: '',
    date: '',
    type: 'other' as Reminder['type']
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRemindersForDate = (date: Date) => {
    return reminders.filter(reminder => 
      reminder.date.toDateString() === date.toDateString()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAddReminder = () => {
    const reminderDate = selectedDate || (newReminder.date ? new Date(newReminder.date) : null);
    
    if (reminderDate && newReminder.title && newReminder.time) {
      const reminder: Reminder = {
        id: Date.now().toString(),
        date: reminderDate,
        title: newReminder.title,
        description: newReminder.description,
        time: newReminder.time,
        type: newReminder.type
      };
      setReminders([...reminders, reminder]);
      setNewReminder({ title: '', description: '', time: '', date: '', type: 'other' });
      setShowReminderModal(false);
      setSelectedDate(reminderDate);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-12"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayReminders = getRemindersForDate(date);
      const isSelected = selectedDate?.toDateString() === date.toDateString();
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(date)}
          className={`h-12 flex flex-col items-center justify-center cursor-pointer rounded-lg transition-all duration-200 relative ${
            isSelected
              ? 'bg-blue-500 text-white shadow-lg'
              : isToday
              ? 'bg-green-100 text-green-800 border-2 border-green-400'
              : 'hover:bg-blue-50 text-gray-700'
          }`}
        >
          <span className="text-sm font-medium">{day}</span>
          {dayReminders.length > 0 && (
            <div className="flex space-x-1 mt-1">
              {dayReminders.slice(0, 3).map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-white' : 'bg-blue-400'
                  }`}
                ></div>
              ))}
              {dayReminders.length > 3 && (
                <span className={`text-xs ${isSelected ? 'text-white' : 'text-blue-600'}`}>
                  +{dayReminders.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const getTypeColor = (type: Reminder['type']) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medication': return 'bg-green-100 text-green-800 border-green-200';
      case 'checkup': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Calendar & Reminders</h1>
          <p className="text-white">Manage your health appointments and medication schedule</p>
        </div>
        <Button
          onClick={() => setShowReminderModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Reminder</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Calendar Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNextMonth}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Days of Week */}
            <div className="grid grid-cols-7 bg-gray-50 border-b">
              {daysOfWeek.map((day) => (
                <div key={day} className="p-3 text-center text-sm font-medium text-gray-600">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 p-4">
              {renderCalendarDays()}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          {selectedDate && (
            <div className="bg-gray-700 rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CalendarIcon className="w-5 h-5 text-blue-500" />
                <h3 className="font-semibold text-gray-500">Selected Date</h3>
              </div>
              <p className="text-blue-600 font-medium">
                {selectedDate.toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          )}

          {/* Reminders for Selected Date */}
          {selectedDate && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Bell className="w-5 h-5 text-orange-500" />
                <h3 className="font-semibold text-black">Reminders</h3>
              </div>
              {getRemindersForDate(selectedDate).length > 0 ? (
                <div className="space-y-2">
                  {getRemindersForDate(selectedDate).map((reminder) => (
                    <div
                      key={reminder.id}
                      className={`p-3 rounded-lg border ${getTypeColor(reminder.type)}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm">{reminder.title}</h4>
                        <span className="text-xs flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {reminder.time}
                        </span>
                      </div>
                      {reminder.description && (
                        <p className="text-xs opacity-80">{reminder.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-black text-sm">No reminders for this date</p>
              )}
            </div>
          )}

          {/* Upcoming Reminders */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Bell className="w-5 h-5 text-green-500" />
              <h3 className="font-semibold text-black">Upcoming</h3>
            </div>
            <div className="space-y-2">
              {reminders
                .filter(reminder => reminder.date >= new Date())
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .slice(0, 5)
                .map((reminder) => (
                  <div
                    key={reminder.id}
                    className={`p-2 rounded-lg border ${getTypeColor(reminder.type)}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-xs">{reminder.title}</h4>
                      <span className="text-xs">{reminder.time}</span>
                    </div>
                    <p className="text-xs opacity-70">
                      {reminder.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {showReminderModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-700 rounded-2xl p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Add Reminder</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowReminderModal(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              {!selectedDate && (
                <div>
                  <label className="block text-sm font-medium text-white mb-1">Date</label>
                  <input
                    type="date"
                    value={newReminder.date}
                    onChange={(e) => setNewReminder({...newReminder, date: e.target.value})}
                    className="w-full p-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Title</label>
                <input
                  type="text"
                  value={newReminder.title}
                  onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter reminder title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Description</label>
                <textarea
                  value={newReminder.description}
                  onChange={(e) => setNewReminder({...newReminder, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                  placeholder="Enter description (optional)"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Time</label>
                <input
                  type="time"
                  value={newReminder.time}
                  onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-1">Type</label>
                <select
                  value={newReminder.type}
                  onChange={(e) => setNewReminder({...newReminder, type: e.target.value as Reminder['type']})}
                  className="w-full p-2 border border-black rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                >
                  <option value="other">Other</option>
                  <option value="appointment">Appointment</option>
                  <option value="medication">Medication</option>
                  <option value="checkup">Checkup</option>
                </select>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowReminderModal(false)}
                className="flex-1 text-white border-white hover:bg-white hover:text-black"
              >
                Cancel
              </Button>
              <Button
                onClick={handleAddReminder}
                className="flex-1"
                disabled={!newReminder.title || !newReminder.time || (!selectedDate && !newReminder.date)}
              >
                Add Reminder
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

