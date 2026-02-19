import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { debateApi, userApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, ArrowRight, Hand } from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    Promise.all([userApi.getProfile(user.id), debateApi.getAll()])
      .then(([profileRes, debatesRes]) => {
        if (profileRes.data.success) setProfile(profileRes.data.user);
        if (debatesRes.data.success) setDebates(debatesRes.data.debates);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const joinedIds = new Set(profile?.joinedDebates?.map((d) => d._id) || []);
  const now = new Date();

  // Compare full date+time so today's debates aren't excluded
  const upcomingDebates = debates.filter((d) => {
    if (d.status !== "upcoming") return false;
    const debateDateTime = new Date(
      `${d.date.split("T")[0]}T${d.time || "23:59"}:00`,
    );
    return debateDateTime >= now;
  });
  const joinedDebates = debates.filter((d) => joinedIds.has(d._id));
  const pastDebates = debates.filter((d) => d.status === "completed");

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-8 bg-muted rounded w-64 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-20 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          Welcome back, {user?.firstName || "there"}!
          <Hand className="h-7 w-7 text-primary" />
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your debate activity.
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Debates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-400">
              {upcomingDebates.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Joined Debates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-400">
              {joinedDebates.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Past Debates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-400">
              {pastDebates.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming debates preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Upcoming Debates</h2>
          <Link to="/debates">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        {upcomingDebates.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No upcoming debates
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {upcomingDebates.slice(0, 4).map((debate) => (
              <Link key={debate._id} to={`/debates/${debate._id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold">
                        {debate.revealStatus && debate.topicId
                          ? debate.topicId.title
                          : "Topic Hidden"}
                      </h3>
                      {joinedIds.has(debate._id) && (
                        <Badge variant="success">Joined</Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(debate.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" />
                        {debate.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" />
                        {debate.location}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
