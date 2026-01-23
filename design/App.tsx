import { useState } from 'react';
import { ProfilePage } from './components/ProfilePage';
import { ProgressTracker } from './components/ProgressTracker';
import { RouteBuilder } from './components/RouteBuilder';
import { Home, User, Target, TrendingUp } from 'lucide-react';

type Tab = 'overview' | 'profile' | 'progress' | 'routes';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  return (
    <div className="min-h-screen bg-[#0e1117] text-[#e4e6eb]">
      {/* Header */}
      <header className="bg-[#1a1d26] border-b border-[#2a2d36] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00d4ff] to-[#0080ff] rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-[#00d4ff]">Game Progress Planner</h1>
                <p className="text-sm text-[#a0a3ab]">Планировщик игрового прогресса</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <aside className="w-64 flex-shrink-0">
            <nav className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-4 sticky top-24">
              <h2 className="text-sm text-[#a0a3ab] uppercase mb-3">Навигация</h2>
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                      activeTab === 'overview'
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                        : 'text-[#e4e6eb] hover:bg-[#2a2d36]'
                    }`}
                  >
                    <Home className="w-5 h-5" />
                    <span>Обзор</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                        : 'text-[#e4e6eb] hover:bg-[#2a2d36]'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span>Профиль игрока</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('progress')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                      activeTab === 'progress'
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                        : 'text-[#e4e6eb] hover:bg-[#2a2d36]'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    <span>Обновить прогресс</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('routes')}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded transition-colors ${
                      activeTab === 'routes'
                        ? 'bg-[#00d4ff]/10 text-[#00d4ff]'
                        : 'text-[#e4e6eb] hover:bg-[#2a2d36]'
                    }`}
                  >
                    <Target className="w-5 h-5" />
                    <span>Построить маршрут</span>
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'overview' && <OverviewPage />}
            {activeTab === 'profile' && <ProfilePage />}
            {activeTab === 'progress' && <ProgressTracker />}
            {activeTab === 'routes' && <RouteBuilder />}
          </main>
        </div>
      </div>
    </div>
  );
}

function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-6">
        <h2 className="text-[#00d4ff] mb-4">Добро пожаловать в Game Progress Planner</h2>
        <p className="text-[#a0a3ab] mb-6">
          Планируйте свой прогресс, отслеживайте достижения и получайте оптимальные маршруты для достижения игровых целей.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-[#00d4ff]" />
              </div>
              <div>
                <div className="text-2xl text-[#00d4ff]">12</div>
                <div className="text-sm text-[#a0a3ab]">Доступно оружия</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#ff6b6b]/10 rounded-lg flex items-center justify-center">
                <Target className="w-5 h-5 text-[#ff6b6b]" />
              </div>
              <div>
                <div className="text-2xl text-[#ff6b6b]">8/15</div>
                <div className="text-sm text-[#a0a3ab]">Побеждено боссов</div>
              </div>
            </div>
          </div>
          
          <div className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-[#51cf66]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#51cf66]" />
              </div>
              <div>
                <div className="text-2xl text-[#51cf66]">45/60</div>
                <div className="text-sm text-[#a0a3ab]">Пройдено уровней</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-6">
        <h3 className="text-[#00d4ff] mb-4">Быстрый старт</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-[#0e1117] border border-[#2a2d36] rounded-lg">
            <div className="w-6 h-6 bg-[#00d4ff] text-[#0e1117] rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">1</div>
            <div>
              <div className="text-[#e4e6eb] mb-1">Настройте свой профиль</div>
              <div className="text-sm text-[#a0a3ab]">Добавьте информацию об оружии, навыках и побежденных боссах</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#0e1117] border border-[#2a2d36] rounded-lg">
            <div className="w-6 h-6 bg-[#00d4ff] text-[#0e1117] rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">2</div>
            <div>
              <div className="text-[#e4e6eb] mb-1">Обновляйте прогресс</div>
              <div className="text-sm text-[#a0a3ab]">Отмечайте пройденные уровни и купленное снаряжение</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-[#0e1117] border border-[#2a2d36] rounded-lg">
            <div className="w-6 h-6 bg-[#00d4ff] text-[#0e1117] rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-0.5">3</div>
            <div>
              <div className="text-[#e4e6eb] mb-1">Постройте маршрут</div>
              <div className="text-sm text-[#a0a3ab]">Выберите цель и получите 2 оптимальных маршрута с прогнозами</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
