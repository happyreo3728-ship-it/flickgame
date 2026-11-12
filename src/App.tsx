import React, { useState, useRef, useMemo } from 'react';
import {
  Users,
  Receipt,
  ArrowRight,
  Plus,
  Trash2,
  Share2,
  Check,
  Sparkles,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Hand
} from 'lucide-react';
import './App.css';

interface Member {
  id: string;
  name: string;
}

interface Expense {
  id: string;
  title: string;
  amount: number;
  payerId: string;
  splitAmongIds: string[];
}

interface Settlement {
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  amount: number;
}

const STEPS = ['メンバー', '支払い登録', '精算結果'];

export function App() {
  const [step, setStep] = useState<number>(0);
  const [members, setMembers] = useState<Member[]>([
    { id: 'm1', name: 'たろう' },
    { id: 'm2', name: 'はなこ' },
    { id: 'm3', name: 'けんた' },
  ]);
  const [newMemberName, setNewMemberName] = useState('');

  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: 'e1',
      title: '居酒屋（1次会）',
      amount: 15000,
      payerId: 'm1',
      splitAmongIds: ['m1', 'm2', 'm3'],
    },
    {
      id: 'e2',
      title: 'タクシー代',
      amount: 3600,
      payerId: 'm2',
      splitAmongIds: ['m1', 'm2', 'm3'],
    },
  ]);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [payerId, setPayerId] = useState('m1');
  const [splitAmongIds, setSplitAmongIds] = useState<string[]>(['m1', 'm2', 'm3']);
  const [copied, setCopied] = useState(false);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const minSwipeDistance = 60;

  const handleTouchStart = (e: React.TouchEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'SELECT' || tag === 'BUTTON') return;
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || touchStartX.current === null) return;
    const currentX = e.targetTouches[0].clientX;
    touchEndX.current = currentX;
    const diff = currentX - touchStartX.current;
    if ((step === 0 && diff > 0) || (step === STEPS.length - 1 && diff < 0)) {
      setSwipeOffset(diff * 0.25);
    } else {
      setSwipeOffset(diff * 0.6);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setSwipeOffset(0);
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && step < STEPS.length - 1) {
      setStep((prev) => prev + 1);
    } else if (isRightSwipe && step > 0) {
      setStep((prev) => prev - 1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const addMember = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newMemberName.trim();
    if (!trimmed) return;
    const newId = 'm' + Date.now();
    const updated = [...members, { id: newId, name: trimmed }];
    setMembers(updated);
    setSplitAmongIds((prev) => [...prev, newId]);
    if (updated.length === 1) setPayerId(newId);
    setNewMemberName('');
  };

  const removeMember = (id: string) => {
    if (members.length <= 2) {
      alert('割り勘には最低2人のメンバーが必要です！');
      return;
    }
    const updated = members.filter((m) => m.id !== id);
    setMembers(updated);
    setSplitAmongIds((prev) => prev.filter((mid) => mid !== id));
    if (payerId === id && updated.length > 0) {
      setPayerId(updated[0].id);
    }
    setExpenses((prev) =>
      prev
        .filter((exp) => exp.payerId !== id)
        .map((exp) => ({
          ...exp,
          splitAmongIds: exp.splitAmongIds.filter((mid) => mid !== id),
        }))
        .filter((exp) => exp.splitAmongIds.length > 0)
    );
  };

  const toggleSplitMember = (id: string) => {
    setSplitAmongIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = Number(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;
    if (splitAmongIds.length === 0) {
      alert('割り勘の対象メンバーを1人以上選択してください！');
      return;
    }
    const newExp: Expense = {
      id: 'e' + Date.now(),
      title: title.trim(),
      amount: Math.round(numAmount),
      payerId: payerId || members[0].id,
      splitAmongIds: [...splitAmongIds],
    };
    setExpenses([newExp, ...expenses]);
    setTitle('');
    setAmount('');
  };

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((exp) => exp.id !== id));
  };

  const { totalAmount, settlements, memberBalances } = useMemo(() => {
    const balances: Record<string, number> = {};
    members.forEach((m) => {
      balances[m.id] = 0;
    });

    let total = 0;
    expenses.forEach((exp) => {
      total += exp.amount;
      if (balances[exp.payerId] !== undefined) {
        balances[exp.payerId] += exp.amount;
      }
      const validTargets = exp.splitAmongIds.filter((id) => balances[id] !== undefined);
      if (validTargets.length > 0) {
        const share = exp.amount / validTargets.length;
        validTargets.forEach((id) => {
          balances[id] -= share;
        });
      }
    });

    const debtors: { id: string; amount: number }[] = [];
    const creditors: { id: string; amount: number }[] = [];

    Object.entries(balances).forEach(([id, bal]) => {
      if (bal < -1) debtors.push({ id, amount: -bal });
      else if (bal > 1) creditors.push({ id, amount: bal });
    });

    debtors.sort((a, b) => b.amount - a.amount);
    creditors.sort((a, b) => b.amount - a.amount);

    const result: Settlement[] = [];
    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const d = debtors[i];
      const c = creditors[j];
      const payAmount = Math.min(d.amount, c.amount);

      const fromMember = members.find((m) => m.id === d.id);
      const toMember = members.find((m) => m.id === c.id);

      if (fromMember && toMember && Math.round(payAmount) > 0) {
        result.push({
          fromId: d.id,
          fromName: fromMember.name,
          toId: c.id,
          toName: toMember.name,
          amount: Math.round(payAmount),
        });
      }

      d.amount -= payAmount;
      c.amount -= payAmount;

      if (d.amount < 1) i++;
      if (c.amount < 1) j++;
    }

    return {
      totalAmount: total,
      settlements: result,
      memberBalances: balances,
    };
  }, [members, expenses]);

  const copyResultText = () => {
    const lines = [
      '🍊 割り勘精算まとめ 🍊',
      `合計金額: ¥${totalAmount.toLocaleString()}`,
      '------------------',
    ];
    if (settlements.length === 0) {
      lines.push('精算の必要はありません！');
    } else {
      settlements.forEach((s) => {
        lines.push(`・${s.fromName} ➔ ${s.toName} : ¥${s.amount.toLocaleString()}`);
      });
    }
    navigator.clipboard.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const resetAll = () => {
    if (window.confirm('登録した支払いデータをすべてリセットしますか？')) {
      setExpenses([]);
      setStep(0);
    }
  };

  return (
    <div className="app-viewport">
      <div className="bubble-bg" aria-hidden="true">
        <div className="polka-dots" />
        <span className="bubble b1" />
        <span className="bubble b2" />
        <span className="bubble b3" />
        <span className="bubble b4" />
        <span className="bubble b5" />
        <span className="bubble b6" />
        <span className="bubble b7" />
      </div>

      <div
        className="app-shell"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <header className="app-header">
          <div className="header-top">
            <div className="brand-badge">
              <Sparkles size={18} />
              <span>わくわく割り勘</span>
            </div>
            <button className="icon-btn" onClick={resetAll} title="データリセット">
              <RefreshCw size={18} />
            </button>
          </div>
          <p className="swipe-hint">
            <Hand size={14} className="hand-anim" />
            <span>左右にフリックしてステップ移動！</span>
          </p>

          <nav className="step-tabs" role="tablist">
            {STEPS.map((label, idx) => (
              <button
                key={label}
                role="tab"
                aria-selected={step === idx}
                className={`step-tab ${step === idx ? 'active' : ''}`}
                onClick={() => setStep(idx)}
              >
                <span className="step-num">{idx + 1}</span>
                <span className="step-label">{label}</span>
              </button>
            ))}
          </nav>
        </header>

        <main className="card-stage">
          <div
            className="card-track"
            style={{
              transform: `translateX(calc(-${step * 100}% + ${swipeOffset}px))`,
              transition: isDragging ? 'none' : 'transform 0.36s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <section className="flick-card">
              <div className="card-inner">
                <div className="card-title-row">
                  <Users className="title-icon" size={22} />
                  <h2>参加メンバー ({members.length}人)</h2>
                </div>
                <p className="card-desc">飲み会や旅行に参加するメンバーを追加してください。</p>

                <form onSubmit={addMember} className="input-row">
                  <input
                    type="text"
                    placeholder="名前を入力（例：みさき）"
                    value={newMemberName}
                    onChange={(e) => setNewMemberName(e.target.value)}
                    className="orange-input"
                  />
                  <button type="submit" className="primary-btn">
                    <Plus size={20} />
                    <span>追加</span>
                  </button>
                </form>

                <div className="member-list">
                  {members.map((m, idx) => (
                    <div key={m.id} className="member-chip">
                      <div className="member-avatar">{m.name.slice(0, 1)}</div>
                      <span className="member-name">{m.name}</span>
                      <span className="member-tag">#{idx + 1}</span>
                      <button
                        type="button"
                        className="delete-chip-btn"
                        onClick={() => removeMember(m.id)}
                        aria-label={`${m.name}を削除`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="flick-card">
              <div className="card-inner">
                <div className="card-title-row">
                  <Receipt className="title-icon" size={22} />
                  <h2>立て替え・支払いの登録</h2>
                </div>

                <form onSubmit={addExpense} className="expense-form">
                  <div className="form-grid">
                    <input
                      type="text"
                      placeholder="項目（例：ホテル代、レンタカー）"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="orange-input"
                      required
                    />
                    <div className="amount-input-wrap">
                      <span className="yen-symbol">¥</span>
                      <input
                        type="number"
                        inputMode="numeric"
                        placeholder="金額"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="orange-input amount-field"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div className="payer-select-row">
                    <label htmlFor="payer-select">払った人：</label>
                    <select
                      id="payer-select"
                      value={payerId}
                      onChange={(e) => setPayerId(e.target.value)}
                      className="orange-select"
                    >
                      {members.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="split-targets">
                    <span className="split-label">割り勘する対象：</span>
                    <div className="target-pills">
                      {members.map((m) => {
                        const selected = splitAmongIds.includes(m.id);
                        return (
                          <button
                            type="button"
                            key={m.id}
                            onClick={() => toggleSplitMember(m.id)}
                            className={`target-pill ${selected ? 'selected' : ''}`}
                          >
                            {selected && <Check size={14} />}
                            <span>{m.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button type="submit" className="primary-btn full-width">
                    <Plus size={18} />
                    <span>支払いを追加する</span>
                  </button>
                </form>

                <div className="expense-history">
                  <h3>登録済みの支払い ({expenses.length}件)</h3>
                  {expenses.length === 0 ? (
                    <p className="empty-text">まだ支払いが登録されていません。</p>
                  ) : (
                    expenses.map((exp) => {
                      const payer = members.find((m) => m.id === exp.payerId);
                      return (
                        <div key={exp.id} className="expense-item">
                          <div className="exp-info">
                            <div className="exp-title">{exp.title}</div>
                            <div className="exp-meta">
                              <span className="payer-badge">{payer?.name} が立替</span>
                              <span>対象 {exp.splitAmongIds.length}人</span>
                            </div>
                          </div>
                          <div className="exp-right">
                            <span className="exp-amount">¥{exp.amount.toLocaleString()}</span>
                            <button
                              type="button"
                              className="delete-chip-btn"
                              onClick={() => removeExpense(exp.id)}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </section>

            <section className="flick-card">
              <div className="card-inner">
                <div className="total-banner">
                  <span className="total-label">イベント合計金額</span>
                  <div className="total-value">¥{totalAmount.toLocaleString()}</div>
                  <span className="per-person-sub">
                    1人あたり平均: ¥
                    {members.length > 0
                      ? Math.round(totalAmount / members.length).toLocaleString()
                      : 0}
                  </span>
                </div>

                <div className="settlement-section">
                  <h3>誰が誰にいくら払う？</h3>
                  {settlements.length === 0 ? (
                    <div className="settled-box">
                      🎉 貸し借りはありません！精算完了です。
                    </div>
                  ) : (
                    <div className="settlement-list">
                      {settlements.map((s, index) => (
                        <div key={index} className="settlement-card">
                          <div className="person-box from">
                            <span className="role-tag">払う人</span>
                            <strong>{s.fromName}</strong>
                          </div>
                          <div className="arrow-flow">
                            <span className="pay-price">¥{s.amount.toLocaleString()}</span>
                            <ArrowRight size={20} className="flow-icon" />
                          </div>
                          <div className="person-box to">
                            <span className="role-tag">受取る人</span>
                            <strong>{s.toName}</strong>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="balance-summary">
                  <h4>各自の収支バランス（＋は受取、−は支払）</h4>
                  <div className="balance-grid">
                    {members.map((m) => {
                      const bal = Math.round(memberBalances[m.id] || 0);
                      return (
                        <div key={m.id} className="balance-pill">
                          <span>{m.name}</span>
                          <strong className={bal >= 0 ? 'plus' : 'minus'}>
                            {bal >= 0 ? `+¥${bal.toLocaleString()}` : `-¥${Math.abs(bal).toLocaleString()}`}
                          </strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button type="button" className="share-btn" onClick={copyResultText}>
                  {copied ? <Check size={18} /> : <Share2 size={18} />}
                  <span>{copied ? 'コピーしました！LINE等に貼り付けできます' : '精算結果をテキストコピー'}</span>
                </button>
              </div>
            </section>
          </div>
        </main>

        <footer className="app-footer">
          <button
            type="button"
            className="nav-arrow-btn"
            disabled={step === 0}
            onClick={() => setStep((s) => Math.max(0, s - 1))}
          >
            <ChevronLeft size={20} />
            <span>前へ</span>
          </button>

          <div className="page-dots">
            {STEPS.map((_, idx) => (
              <span
                key={idx}
                className={`dot ${step === idx ? 'active' : ''}`}
                onClick={() => setStep(idx)}
              />
            ))}
          </div>

          <button
            type="button"
            className="nav-arrow-btn next"
            disabled={step === STEPS.length - 1}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            <span>次へ</span>
            <ChevronRight size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default App;