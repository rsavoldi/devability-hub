
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockUserProfile, mockAchievements, mockLessons, mockExercises } from "@/lib/mockData";
import { Award, BookOpen, CheckCircle, Edit3, Target, UserCircle, Trophy as TrophyIcon } from "lucide-react"; // Renamed Trophy
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button"; // Added Button import
import { Label } from "@/components/ui/label"; // Added Label import


export default function ProfilePage() {
  const { name, avatarUrl, points, completedLessons, completedExercises, unlockedAchievements } = mockUserProfile;

  const totalLessons = mockLessons.length;
  const totalExercises = mockExercises.length;
  const totalAchievements = mockAchievements.length;

  const lessonProgress = totalLessons > 0 ? (completedLessons.length / totalLessons) * 100 : 0;
  const exerciseProgress = totalExercises > 0 ? (completedExercises.length / totalExercises) * 100 : 0;
  const achievementProgress = totalAchievements > 0 ? (unlockedAchievements.length / totalAchievements) * 100 : 0;

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight flex items-center">
            <UserCircle className="w-10 h-10 mr-3 text-primary" />
            User Profile
        </h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader className="items-center text-center">
            <Avatar className="h-24 w-24 mb-4 border-2 border-primary">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="text-3xl">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-2xl">{name}</CardTitle>
            <CardDescription>Learner Extraordinaire</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center text-2xl font-semibold text-primary mb-4">
              <Award className="h-7 w-7 mr-2" />
              {points} Points
            </div>
            <Button variant="outline" className="w-full">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile (not implemented)
            </Button>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Progress Overview</CardTitle>
            <CardDescription>Your learning journey at a glance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="lesson-progress" className="flex items-center text-sm font-medium"><BookOpen className="mr-2 h-4 w-4 text-primary"/>Lessons Completed</Label>
                <span className="text-sm text-muted-foreground">{completedLessons.length} / {totalLessons}</span>
              </div>
              <Progress value={lessonProgress} id="lesson-progress" aria-label={`${lessonProgress.toFixed(0)}% lessons completed`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="exercise-progress" className="flex items-center text-sm font-medium"><Target className="mr-2 h-4 w-4 text-primary"/>Exercises Mastered</Label>
                <span className="text-sm text-muted-foreground">{completedExercises.length} / {totalExercises}</span>
              </div>
              <Progress value={exerciseProgress} id="exercise-progress" aria-label={`${exerciseProgress.toFixed(0)}% exercises completed`} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <Label htmlFor="achievement-progress" className="flex items-center text-sm font-medium"><TrophyIcon className="mr-2 h-4 w-4 text-primary"/>Achievements Unlocked</Label>
                <span className="text-sm text-muted-foreground">{unlockedAchievements.length} / {totalAchievements}</span>
              </div>
              <Progress value={achievementProgress} id="achievement-progress" aria-label={`${achievementProgress.toFixed(0)}% achievements unlocked`} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest accomplishments.</CardDescription>
        </CardHeader>
        <CardContent>
            {unlockedAchievements.length > 0 ? (
                 <ul className="space-y-3">
                    {mockAchievements.filter(ach => unlockedAchievements.includes(ach.id)).slice(0,3).map(ach =>(
                        <li key={ach.id} className="flex items-center p-3 border rounded-md bg-muted/50">
                            <CheckCircle className="h-5 w-5 mr-3 text-green-500"/>
                            <div>
                                <p className="font-medium">{ach.title}</p>
                                <p className="text-sm text-muted-foreground">Unlocked on {ach.dateUnlocked}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-muted-foreground">No recent achievements to display. Keep learning!</p>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
