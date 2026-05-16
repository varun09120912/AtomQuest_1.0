import React, { useState, useEffect, useRef, useContext } from 'react';
import { MessageSquare, Send, X, Bot, Sparkles, Command } from 'lucide-react';
import { AppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export default function AtomBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm AtomBot, your efficiency assistant. How can I help you today?", sender: 'bot', timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { currentUser, goals, saveGoals, users, notifications, saveNotifications, auditLog, saveAuditLog } = useContext(AppContext);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const addMessage = (text, sender = 'bot') => {
    setMessages(prev => [...prev, { id: Date.now(), text, sender, timestamp: Date.now() }]);
  };

  const processCommand = (text) => {
    const cmd = text.toLowerCase();
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      
      // 1. HELP / CAPABILITIES
      if (cmd.includes('help') || cmd.includes('what can you do')) {
        let helpText = "I can help you manage goals and track progress. ";
        if (currentUser.role === 'admin') helpText += "As an Admin, I can export reports, view company analytics, and manage cycles.";
        else if (currentUser.role === 'manager') helpText += "As a Manager, I can approve team goals, send reminders, and view team check-ins.";
        else helpText += "As an Employee, I can check your goal status, submit your sheet, and view your notifications.";
        addMessage(helpText);
        return;
      }

      // 2. PRIVILEGE CHECK: APPROVALS
      if (cmd.includes('approve')) {
        if (currentUser.role === 'employee') {
          addMessage("Nice try! 😉 I'm afraid I can't do that. Only your manager or an HR admin can approve goals. Would you like me to send your manager a nudge instead?");
          return;
        }

        // Logic for Manager/Admin
        const targetName = text.split('approve')[1]?.trim();
        if (!targetName || targetName.toLowerCase() === 'all') {
          // Approve all pending for my team (if manager) or all (if admin)
          const myTeamIds = currentUser.role === 'admin' ? users.map(u => u.id) : users.filter(u => u.managerId === currentUser.id).map(u => u.id);
          const pending = goals.filter(g => myTeamIds.includes(g.employeeId) && g.status === 'pending');
          
          if (pending.length === 0) {
            addMessage("I checked the system—there are no pending goals requiring approval at the moment. You're all caught up!");
          } else {
            const updated = goals.map(g => pending.some(p => p.id === g.id) ? { ...g, status: 'approved', updatedAt: Date.now() } : g);
            saveGoals(updated);
            addMessage(`Done! I've approved all ${pending.length} pending goals for your team. I've also sent them notifications.`);
            
            // Send notifications to unique employees
            const uniqueEmpIds = [...new Set(pending.map(p => p.employeeId))];
            const newNotifs = uniqueEmpIds.map(id => ({
              id: 'n' + Date.now() + Math.random(),
              userId: id,
              title: '🎉 Goals Approved!',
              message: `${currentUser.name} used AtomBot to approve your goals. They are now active.`,
              type: 'goal_approved',
              timestamp: Date.now(),
              read: false
            }));
            saveNotifications([...notifications, ...newNotifs]);
          }
        } else {
          // Find specific user
          const targetUser = users.find(u => u.name.toLowerCase().includes(targetName.toLowerCase()));
          if (!targetUser) {
             addMessage(`I couldn't find an employee named "${targetName}". Please check the spelling.`);
          } else if (currentUser.role !== 'admin' && targetUser.managerId !== currentUser.id) {
             addMessage(`I can only approve goals for your direct reports. ${targetUser.name} reports to someone else.`);
          } else {
             const pending = goals.filter(g => g.employeeId === targetUser.id && g.status === 'pending');
             if (pending.length === 0) {
               addMessage(`${targetUser.name} doesn't have any goals pending approval right now.`);
             } else {
               const updated = goals.map(g => g.employeeId === targetUser.id && g.status === 'pending' ? { ...g, status: 'approved' } : g);
               saveGoals(updated);
               addMessage(`Perfect. I've approved ${targetUser.name}'s goal sheet.`);
             }
          }
        }
        return;
      }

      // 3. NAVIGATION COMMANDS
      if (cmd.includes('show analytics') || cmd.includes('view charts')) {
        if (currentUser.role !== 'admin') {
          addMessage("Confidential access required. Company-wide analytics are only available to HR Admins.");
        } else {
          addMessage("Opening the Analytics dashboard for you now...");
          navigate('/dashboard/analytics');
        }
        return;
      }

      // 4. EMPLOYEE: STATUS CHECK
      if (cmd.includes('my status') || cmd.includes('how am i doing')) {
        const myGoals = goals.filter(g => g.employeeId === currentUser.id);
        const totalWeight = myGoals.reduce((s, g) => s + Number(g.weightage), 0);
        const approved = myGoals.filter(g => g.status === 'approved').length;
        
        addMessage(`You have ${myGoals.length} goals defined with a total weightage of ${totalWeight}%. ${approved} of your goals are currently approved.`);
        if (totalWeight < 100) addMessage("Note: You need to reach 100% weightage before you can submit your sheet.");
        return;
      }

      // 5. EXPORT COMMAND
      if (cmd.includes('export') || cmd.includes('download audit')) {
        if (currentUser.role !== 'admin') {
          addMessage("Only Admins can export system audit logs for security reasons.");
        } else {
          addMessage("I'm navigating you to the Audit Trail where you can use the Export CSV utility.");
          navigate('/dashboard/audit');
        }
        return;
      }

      // DEFAULT FALLBACK
      addMessage("I'm not quite sure how to do that yet. You can ask me to 'approve all', 'check my status', or 'help' for a list of commands.");

    }, 800);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    addMessage(input, 'user');
    processCommand(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-96 h-[500px] rounded-3xl shadow-2xl border border-slate-100 mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-dark p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-primary-500 p-2 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">AtomBot</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Smart Assistant</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar" ref={scrollRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-primary-600 text-white rounded-tr-none' 
                    : 'bg-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
          </div>

          {/* Suggestions Bar */}
          <div className="px-6 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-slate-50 bg-slate-50/50">
             <button onClick={() => processCommand('Help')} className="text-[10px] whitespace-nowrap bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center gap-1">
               <Command size={10} /> Help
             </button>
             {currentUser.role !== 'employee' && (
                <button onClick={() => processCommand('Approve all')} className="text-[10px] whitespace-nowrap bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-500 hover:border-primary-500 hover:text-primary-600 transition-all flex items-center gap-1">
                  <Sparkles size={10} /> Approve All
                </button>
             )}
             <button onClick={() => processCommand('My status')} className="text-[10px] whitespace-nowrap bg-white border border-slate-200 px-3 py-1 rounded-full font-bold text-slate-500 hover:border-primary-500 hover:text-primary-600 transition-all">
               Check My Status
             </button>
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500 transition-all outline-none"
              placeholder="Type a command..."
              value={input}
              onChange={e => setInput(e.target.value)}
            />
            <button type="submit" className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition-all shadow-md shadow-primary-500/20">
              <Send size={18} />
            </button>
          </form>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-dark' : 'bg-primary-600'
        }`}
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        {!isOpen && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-background rounded-full"></div>
        )}
      </button>
    </div>
  );
}
