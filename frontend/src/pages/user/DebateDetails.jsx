import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { debateApi, userApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Lock,
  Unlock,
  LogOut,
  CheckCircle,
} from "lucide-react";

/** Format "HH:MM" → "h:mm AM/PM IST" */
function formatTimeIST(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period} IST`;
}

export default function DebateDetails() {
  const { id } = useParams();
  const { user, isSignedIn } = useUser();
  const [debate, setDebate] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const fetchData = async () => {
    try {
      const debRes = await debateApi.getById(id);
      if (debRes.data.success) setDebate(debRes.data.debate);

      if (user?.id) {
        const profRes = await userApi.getProfile(user.id);
        if (profRes.data.success) setProfile(profRes.data.user);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 15 seconds so auto-reveal updates show up in real time
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user?.id]);

  const hasJoined = profile?.joinedDebates?.some((d) => d._id === id);

  const handleJoin = async () => {
    if (!isSignedIn) {
      toast({
        title: "Please sign in",
        description: "You need to be logged in to join a debate.",
        variant: "destructive",
      });
      return;
    }
    setJoining(true);
    try {
      const { data } = await debateApi.join(id, user.id);
      if (data.success) {
        toast({
          title: "Joined!",
          description:
            "You have successfully joined this debate. Check your email!",
          variant: "success",
        });
        fetchData();
      }
    } catch (err) {
      toast({
        title: "Failed to join",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!confirm("Are you sure you want to leave this debate?")) return;
    setLeaving(true);
    try {
      const { data } = await debateApi.leave(id, user.id);
      if (data.success) {
        toast({
          title: "Left debate",
          description: "You have successfully left this debate.",
        });
        fetchData();
      }
    } catch (err) {
      toast({
        title: "Failed to leave",
        description: err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLeaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card className="animate-pulse">
          <CardContent className="p-8">
            <div className="h-32 bg-muted rounded" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20 text-muted-foreground">
        <p className="text-xl">Debate not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge
              variant={
                debate.status === "upcoming"
                  ? "default"
                  : debate.status === "completed"
                    ? "secondary"
                    : "destructive"
              }
            >
              {debate.status}
            </Badge>
            {hasJoined && <Badge variant="success">Joined</Badge>}
            {debate.revealStatus ? (
              <Badge variant="warning">
                <Unlock className="h-3 w-3 mr-1" /> Topic Revealed
              </Badge>
            ) : (
              <Badge variant="outline">
                <Lock className="h-3 w-3 mr-1" /> Topic Hidden
              </Badge>
            )}
          </div>
          <CardTitle className="text-xl sm:text-2xl">
            {debate.revealStatus && debate.topicId
              ? debate.topicId.title
              : "Topic Not Yet Revealed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Topic description */}
          {debate.revealStatus && debate.topicId && (
            <div className="bg-secondary/50 rounded-lg p-4 border-l-4 border-primary">
              <h3 className="font-semibold mb-2">Topic Description</h3>
              <p className="text-muted-foreground">
                {debate.topicId.description}
              </p>
            </div>
          )}

          {/* Debate info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-medium">
                  {new Date(debate.date).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
              <Clock className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Time (IST)</p>
                <p className="font-medium">{formatTimeIST(debate.time)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-secondary/30">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="font-medium">{debate.location}</p>
              </div>
            </div>
          </div>

          {/* Participants */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participants ({debate.participants?.length || 0})
            </h3>
            {debate.participants?.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {debate.participants.map((p) => (
                  <Badge
                    key={p._id}
                    variant="secondary"
                    className="py-1.5 px-3"
                  >
                    {p.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">
                No participants yet. Be the first to join!
              </p>
            )}
          </div>

          {/* Join / Leave buttons */}
          {debate.status === "upcoming" && !hasJoined && (
            <Button
              size="lg"
              className="w-full"
              onClick={handleJoin}
              disabled={joining}
            >
              {joining ? "Joining..." : "Join This Debate"}
            </Button>
          )}
          {hasJoined && debate.status === "upcoming" && (
            <div className="space-y-3">
              <div className="text-center py-3 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                You have joined this debate
              </div>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-destructive hover:text-destructive"
                onClick={handleLeave}
                disabled={leaving}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {leaving ? "Leaving..." : "Leave Debate"}
              </Button>
            </div>
          )}
          {hasJoined && debate.status === "active" && (
            <div className="text-center py-3 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium flex items-center justify-center gap-2">
              <CheckCircle className="h-5 w-5" />
              You are participating in this debate
            </div>
          )}
          {hasJoined &&
            (debate.status === "completed" ||
              debate.status === "cancelled") && (
              <div className="text-center py-3 rounded-lg bg-emerald-500/10 text-emerald-400 font-medium flex items-center justify-center gap-2">
                <CheckCircle className="h-5 w-5" />
                You participated in this debate
              </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
