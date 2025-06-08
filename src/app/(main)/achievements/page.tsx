
import { AchievementsDisplay } from '@/components/gamification/AchievementsDisplay';
import { Trophy } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <div className="container mx-auto py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight flex items-center justify-center">
          <Trophy className="w-10 h-10 mr-3 text-primary" />
          Your Achievements <span role="img" aria-label="trophy">🏆</span>
        </h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Track your progress and celebrate your accomplishments.
        </p>
      </header>
      <AchievementsDisplay />
    </div>
  );
}
