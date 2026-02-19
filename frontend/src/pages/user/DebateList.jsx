import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { debateApi, userApi } from "@/services/api";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Users, Search, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function DebateList() {
  const { user } = useUser();
  const [debates, setDebates] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      debateApi.getAll(),
      user?.id
        ? userApi.getProfile(user.id)
        : Promise.resolve({ data: { success: true, user: null } }),
    ])
      .then(([debRes, profRes]) => {
        if (debRes.data.success) setDebates(debRes.data.debates);
        if (profRes.data.success) setProfile(profRes.data.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const joinedIds = new Set(profile?.joinedDebates?.map((d) => d._id) || []);

  const getStatus = (debate) => {
    if (debate.status === "cancelled")
      return { label: "Cancelled", variant: "destructive" };
    if (debate.status === "completed")
      return { label: "Completed", variant: "secondary" };
    if (joinedIds.has(debate._id))
      return { label: "Joined", variant: "success" };
    if (debate.revealStatus)
      return { label: "Topic Revealed", variant: "warning" };
    return { label: "Upcoming", variant: "default" };
  };

  const filtered = debates.filter((d) => {
    const q = search.toLowerCase();
    return (
      d.location.toLowerCase().includes(q) ||
      d.topicId?.title?.toLowerCase().includes(q) ||
      d.time.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-muted rounded w-48 animate-pulse" />
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-16 bg-muted rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">All Debates</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search debates..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4" />
            <p className="text-lg">No debates found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((debate) => {
            const status = getStatus(debate);
            return (
              <Link key={debate._id} to={`/debates/${debate._id}`}>
                <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold flex items-center gap-1">
                            {debate.revealStatus && debate.topicId ? (
                              debate.topicId.title
                            ) : (
                              <>
                                <Lock className="h-4 w-4" /> Topic Hidden
                              </>
                            )}
                          </h3>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {new Date(debate.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            {debate.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {debate.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            {debate.participants?.length || 0} joined
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4 shrink-0"
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
