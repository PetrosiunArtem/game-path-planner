import { useState } from 'react';
import { CheckCircle2, Circle, Calendar } from 'lucide-react';

interface ProgressItem {
  id: string;
  type: 'weapon' | 'boss' | 'level' | 'achievement';
  title: string;
  description: string;
  date: string;
  completed: boolean;
}

export function ProgressTracker() {
  const [progressItems, setProgressItems] = useState<ProgressItem[]>([
    {
      id: '1',
      type: 'level',
      title: 'Пройден уровень "Горная вершина"',
      description: 'Завершен третий уровень основной кампании',
      date: '2025-12-01',
      completed: true,
    },
    {
      id: '2',
      type: 'weapon',
      title: 'Получен Ледяной посох',
      description: 'Куплено новое магическое оружие',
      date: '2025-11-28',
      completed: true,
    },
    {
      id: '3',
      type: 'boss',
      title: 'Победа над Ледяным гигантом',
      description: 'Побежден босс средней сложности',
      date: '2025-11-25',
      completed: true,
    },
    {
      id: '4',
      type: 'level',
      title: 'Открыты Огненные земли',
      description: 'Доступен для прохождения новый уровень',
      date: '2025-12-02',
      completed: false,
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Достижение: Мастер огня',
      description: 'Навык "Магия огня" достиг уровня 7',
      date: '2025-11-30',
      completed: true,
    },
  ]);

  const [newItemType, setNewItemType] = useState<'weapon' | 'boss' | 'level' | 'achievement'>('level');
  const [newItemTitle, setNewItemTitle] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const toggleItem = (id: string) => {
    setProgressItems(progressItems.map(item =>
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const addNewItem = () => {
    if (!newItemTitle.trim()) return;

    const newItem: ProgressItem = {
      id: Date.now().toString(),
      type: newItemType,
      title: newItemTitle,
      description: 'Добавлено вручную',
      date: new Date().toISOString().split('T')[0],
      completed: true,
    };

    setProgressItems([newItem, ...progressItems]);
    setNewItemTitle('');
    setShowAddForm(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'weapon':
        return '⚔️';
      case 'boss':
        return '💀';
      case 'level':
        return '🗺️';
      case 'achievement':
        return '🏆';
      default:
        return '📌';
    }
  };



  const completedCount = progressItems.filter(item => item.completed).length;
  const completionRate = Math.round((completedCount / progressItems.length) * 100);

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[#00d4ff] mb-1">Статистика прогресса</h2>
            <p className="text-sm text-[#a0a3ab]">Общий обзор ваших достижений</p>
          </div>
          <div className="text-right">
            <div className="text-3xl text-[#00d4ff]">{completionRate}%</div>
            <div className="text-sm text-[#a0a3ab]">Выполнено</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="text-sm text-[#a0a3ab] mb-1">Всего задач</div>
            <div className="text-2xl text-[#e4e6eb]">{progressItems.length}</div>
          </div>
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="text-sm text-[#a0a3ab] mb-1">Выполнено</div>
            <div className="text-2xl text-[#51cf66]">{completedCount}</div>
          </div>
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="text-sm text-[#a0a3ab] mb-1">В процессе</div>
            <div className="text-2xl text-[#ffd43b]">{progressItems.length - completedCount}</div>
          </div>
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="text-sm text-[#a0a3ab] mb-1">Эта неделя</div>
            <div className="text-2xl text-[#00d4ff]">+3</div>
          </div>
        </div>
      </div>

      {/* Add New Progress */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[#00d4ff]">Добавить прогресс</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-[#00d4ff] text-[#0e1117] rounded hover:bg-[#00b8e6] transition-colors"
          >
            {showAddForm ? 'Отмена' : '+ Добавить'}
          </button>
        </div>

        {showAddForm && (
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4 space-y-4">
            <div>
              <label className="block text-sm text-[#a0a3ab] mb-2">Тип прогресса</label>
              <select
                value={newItemType}
                onChange={(e) => setNewItemType(e.target.value as 'level' | 'weapon' | 'boss' | 'achievement')}
                className="w-full bg-[#1a1d26] border border-[#2a2d36] rounded px-3 py-2 text-[#e4e6eb] focus:outline-none focus:border-[#00d4ff]"
              >
                <option value="level">Уровень</option>
                <option value="weapon">Оружие</option>
                <option value="boss">Босс</option>
                <option value="achievement">Достижение</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-[#a0a3ab] mb-2">Название</label>
              <input
                type="text"
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="Например: Пройден уровень..."
                className="w-full bg-[#1a1d26] border border-[#2a2d36] rounded px-3 py-2 text-[#e4e6eb] placeholder-[#5a5d66] focus:outline-none focus:border-[#00d4ff]"
              />
            </div>
            <button
              onClick={addNewItem}
              disabled={!newItemTitle.trim()}
              className="w-full px-4 py-2 bg-[#00d4ff] text-[#0e1117] rounded hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Добавить прогресс
            </button>
          </div>
        )}
      </div>

      {/* Progress Timeline */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-6">
        <h3 className="text-[#00d4ff] mb-4">История прогресса</h3>
        <div className="space-y-3">
          {progressItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4 hover:border-[#3a3d46] transition-colors"
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleItem(item.id)}
                  className="flex-shrink-0 mt-1"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-[#51cf66]" />
                  ) : (
                    <Circle className="w-6 h-6 text-[#a0a3ab]" />
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{getTypeIcon(item.type)}</span>
                      <h4 className={`${item.completed ? 'text-[#e4e6eb]' : 'text-[#a0a3ab]'} ${item.completed ? '' : 'line-through'}`}>
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#a0a3ab] flex-shrink-0">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </div>
                  <p className="text-sm text-[#a0a3ab]">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
