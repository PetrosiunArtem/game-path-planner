import { useState } from 'react';
import { Target, Clock, Zap, TrendingUp, ArrowRight, Star, AlertCircle } from 'lucide-react';

interface Goal {
  id: string;
  name: string;
  type: 'boss' | 'level' | 'achievement';
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Extreme';
}

interface RouteStep {
  id: string;
  action: string;
  description: string;
  estimatedTime: number;
  attempts: number;
  required?: string[];
}

interface Route {
  id: string;
  name: string;
  totalTime: number;
  totalAttempts: number;
  successRate: number;
  steps: RouteStep[];
  pros: string[];
  cons: string[];
}

export function RouteBuilder() {
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [routes, setRoutes] = useState<Route[] | null>(null);
  const [isBuilding, setIsBuilding] = useState(false);

  const availableGoals: Goal[] = [
    { id: '1', name: 'Победить Теневого лорда', type: 'boss', difficulty: 'Hard' },
    { id: '2', name: 'Победить Короля демонов', type: 'boss', difficulty: 'Extreme' },
    { id: '3', name: 'Пройти Огненные земли', type: 'level', difficulty: 'Medium' },
    { id: '4', name: 'Пройти Башню хаоса', type: 'level', difficulty: 'Extreme' },
    { id: '5', name: 'Получить Огненный клинок', type: 'achievement', difficulty: 'Hard' },
  ];

  const buildRoutes = () => {
    setIsBuilding(true);
    
    setTimeout(() => {
      const mockRoutes: Route[] = [
        {
          id: '1',
          name: 'Прямой путь',
          totalTime: 180,
          totalAttempts: 15,
          successRate: 65,
          steps: [
            {
              id: '1',
              action: 'Улучшить навык "Магия огня" до уровня 9',
              description: 'Повысить урон магии огня для эффективного боя',
              estimatedTime: 45,
              attempts: 5,
              required: ['Алхимия уровень 3+'],
            },
            {
              id: '2',
              action: 'Получить Огненный клинок',
              description: 'Купить или найти оружие в Огненных землях',
              estimatedTime: 60,
              attempts: 3,
              required: ['5000 золота'],
            },
            {
              id: '3',
              action: 'Пройти Огненные земли',
              description: 'Завершить уровень для открытия доступа к боссу',
              estimatedTime: 45,
              attempts: 4,
            },
            {
              id: '4',
              action: 'Сразиться с Теневым лордом',
              description: 'Финальная битва с боссом',
              estimatedTime: 30,
              attempts: 3,
              required: ['Огненный клинок', 'Магия огня 9+'],
            },
          ],
          pros: [
            'Короткий путь по времени',
            'Меньше предварительных требований',
            'Прямая стратегия атаки',
          ],
          cons: [
            'Требует хороших навыков',
            'Выше шанс неудачи',
            'Нужно много золота',
          ],
        },
        {
          id: '2',
          name: 'Безопасный путь',
          totalTime: 280,
          totalAttempts: 8,
          successRate: 92,
          steps: [
            {
              id: '1',
              action: 'Улучшить навык "Защита щитом" до уровня 8',
              description: 'Повысить защиту для выживаемости',
              estimatedTime: 60,
              attempts: 2,
            },
            {
              id: '2',
              action: 'Улучшить навык "Владение мечом" до уровня 8',
              description: 'Повысить урон ближнего боя',
              estimatedTime: 60,
              attempts: 2,
            },
            {
              id: '3',
              action: 'Получить Молот титанов',
              description: 'Купить мощное оружие у торговца',
              estimatedTime: 90,
              attempts: 1,
              required: ['12000 золота', 'Репутация: Уважение'],
            },
            {
              id: '4',
              action: 'Пройти Замерзший храм',
              description: 'Получить бонусы к защите',
              estimatedTime: 40,
              attempts: 2,
            },
            {
              id: '5',
              action: 'Сразиться с Теневым лордом',
              description: 'Битва с высокими шансами на успех',
              estimatedTime: 30,
              attempts: 1,
              required: ['Молот титанов', 'Защита 8+', 'Меч 8+'],
            },
          ],
          pros: [
            'Высокий процент успеха',
            'Меньше попыток на босса',
            'Улучшает общие навыки',
          ],
          cons: [
            'Требует больше времени',
            'Нужно больше золота',
            'Длинная подготовка',
          ],
        },
      ];

      setRoutes(mockRoutes);
      setIsBuilding(false);
    }, 1500);
  };

  const difficultyColors = {
    Easy: 'text-[#51cf66]',
    Medium: 'text-[#ffd43b]',
    Hard: 'text-[#ff8787]',
    Extreme: 'text-[#ff6b6b]',
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'boss':
        return '💀';
      case 'level':
        return '🗺️';
      case 'achievement':
        return '🏆';
      default:
        return '🎯';
    }
  };

  const selectedGoalData = availableGoals.find(g => g.id === selectedGoal);

  return (
    <div className="space-y-6">
      {/* Goal Selection */}
      <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-[#00d4ff]" />
          <h2 className="text-[#00d4ff]">Выберите цель</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
          {availableGoals.map(goal => (
            <div
              key={goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedGoal === goal.id
                  ? 'bg-[#00d4ff]/10 border-[#00d4ff]'
                  : 'bg-[#0e1117] border-[#2a2d36] hover:border-[#3a3d46]'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(goal.type)}</span>
                  <h4 className="text-[#e4e6eb]">{goal.name}</h4>
                </div>
                {selectedGoal === goal.id && (
                  <div className="w-5 h-5 bg-[#00d4ff] rounded-full flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-[#0e1117] rounded-full" />
                  </div>
                )}
              </div>
              <div className={`text-sm ${difficultyColors[goal.difficulty]}`}>
                Сложность: {goal.difficulty}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={buildRoutes}
          disabled={!selectedGoal || isBuilding}
          className="w-full px-6 py-3 bg-[#00d4ff] text-[#0e1117] rounded-lg hover:bg-[#00b8e6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isBuilding ? (
            <>
              <div className="w-5 h-5 border-2 border-[#0e1117]/20 border-t-[#0e1117] rounded-full animate-spin" />
              <span>Построение маршрутов...</span>
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" />
              <span>Построить маршруты</span>
            </>
          )}
        </button>
      </div>

      {/* Routes Display */}
      {routes && selectedGoalData && (
        <div className="space-y-6">
          {/* Goal Summary */}
          <div className="bg-[#1a1d26] border border-[#00d4ff]/30 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center text-2xl">
                {getTypeIcon(selectedGoalData.type)}
              </div>
              <div>
                <h3 className="text-[#00d4ff]">{selectedGoalData.name}</h3>
                <p className="text-sm text-[#a0a3ab]">
                  Найдено 2 альтернативных маршрута
                </p>
              </div>
            </div>
          </div>

          {/* Routes */}
          {routes.map((route, routeIndex) => (
            <div
              key={route.id}
              className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg overflow-hidden"
            >
              {/* Route Header */}
              <div className="bg-[#0e1117] border-b border-[#2a2d36] px-6 py-4">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{routeIndex === 0 ? '⚡' : '🛡️'}</span>
                      <h3 className="text-[#00d4ff]">{route.name}</h3>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end mb-1">
                      <Star className="w-4 h-4 text-[#ffd43b]" />
                      <span className="text-[#ffd43b]">{route.successRate}%</span>
                    </div>
                    <div className="text-sm text-[#a0a3ab]">Вероятность успеха</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-[#00d4ff]" />
                      <span className="text-sm text-[#a0a3ab]">Время</span>
                    </div>
                    <div className="text-[#e4e6eb]">{route.totalTime} мин</div>
                  </div>
                  <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <TrendingUp className="w-4 h-4 text-[#ffd43b]" />
                      <span className="text-sm text-[#a0a3ab]">Попытки</span>
                    </div>
                    <div className="text-[#e4e6eb]">{route.totalAttempts}</div>
                  </div>
                  <div className="bg-[#1a1d26] border border-[#2a2d36] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Target className="w-4 h-4 text-[#51cf66]" />
                      <span className="text-sm text-[#a0a3ab]">Шаги</span>
                    </div>
                    <div className="text-[#e4e6eb]">{route.steps.length}</div>
                  </div>
                </div>
              </div>

              {/* Route Steps */}
              <div className="p-6">
                <h4 className="text-[#e4e6eb] mb-4">Шаги маршрута</h4>
                <div className="space-y-3 mb-6">
                  {route.steps.map((step, stepIndex) => (
                    <div
                      key={step.id}
                      className="bg-[#0e1117] border border-[#2a2d36] rounded-lg p-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 bg-[#00d4ff] text-[#0e1117] rounded-full flex items-center justify-center flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-[#e4e6eb] mb-2">{step.action}</h5>
                          <p className="text-sm text-[#a0a3ab] mb-3">{step.description}</p>
                          
                          {step.required && step.required.length > 0 && (
                            <div className="mb-3 flex items-start gap-2">
                              <AlertCircle className="w-4 h-4 text-[#ffd43b] flex-shrink-0 mt-0.5" />
                              <div className="text-sm">
                                <span className="text-[#ffd43b]">Требования: </span>
                                <span className="text-[#a0a3ab]">{step.required.join(', ')}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4 text-[#00d4ff]" />
                              <span className="text-[#a0a3ab]">{step.estimatedTime} мин</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <TrendingUp className="w-4 h-4 text-[#ffd43b]" />
                              <span className="text-[#a0a3ab]">~{step.attempts} попыток</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {stepIndex < route.steps.length - 1 && (
                        <div className="flex justify-center mt-3">
                          <ArrowRight className="w-5 h-5 text-[#a0a3ab]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#51cf66]/5 border border-[#51cf66]/30 rounded-lg p-4">
                    <h5 className="text-[#51cf66] mb-3">Преимущества</h5>
                    <ul className="space-y-2">
                      {route.pros.map((pro, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[#e4e6eb]">
                          <span className="text-[#51cf66] flex-shrink-0">✓</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-[#ff6b6b]/5 border border-[#ff6b6b]/30 rounded-lg p-4">
                    <h5 className="text-[#ff6b6b] mb-3">Недостатки</h5>
                    <ul className="space-y-2">
                      {route.cons.map((con, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-[#e4e6eb]">
                          <span className="text-[#ff6b6b] flex-shrink-0">✗</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
