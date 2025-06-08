
import { mockAchievements } from '@/lib/mockData';
import { AchievementCard } from './AchievementCard';

export function AchievementsDisplay() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mockAchievements.map(achievement => (
        <AchievementCard key={achievement.id} achievement={achievement} />
      ))}
    </div>
  );
}
