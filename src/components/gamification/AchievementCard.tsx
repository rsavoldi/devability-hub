
import type { Achievement } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Lock } from 'lucide-react';
import { Badge } from '../ui/badge';

interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const IconComponent = typeof achievement.icon === 'string' ? null : achievement.icon;

  return (
    <Card className={`flex flex-col h-full shadow-md hover:shadow-lg transition-shadow ${achievement.isUnlocked ? 'border-primary' : 'opacity-70'}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">
          {achievement.title}
        </CardTitle>
        {IconComponent ? (
          <IconComponent className={`h-6 w-6 ${achievement.isUnlocked ? 'text-primary' : 'text-muted-foreground'}`} />
        ) : (
          <span className="text-2xl">{achievement.icon}</span>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{achievement.description}</p>
        <p className="text-xs text-muted-foreground mt-2">Criteria: {achievement.criteria}</p>
      </CardContent>
      <CardFooter>
        {achievement.isUnlocked ? (
          <Badge variant="default" className="bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700">
            <CheckCircle className="mr-1 h-4 w-4" /> Unlocked
            {achievement.dateUnlocked && <span className="ml-1 text-xs">({achievement.dateUnlocked})</span>}
          </Badge>
        ) : (
          <Badge variant="secondary">
            <Lock className="mr-1 h-4 w-4" /> Locked
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
