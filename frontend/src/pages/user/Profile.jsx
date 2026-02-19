import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { userApi } from "@/services/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Mail,
  User as UserIcon,
  Lock,
} from "lucide-react";

export default function Profile() {
  const { user } = useUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    userApi
      .getProfile(user.id)
      .then(({ data }) => {
        if (data.success) setProfile(data.user);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const now = new Date();
  const upcomingDebates =
    profile?.joinedDebates?.filter((d) => {
      const dt = new Date(`${d.date?.split("T")[0]}T${d.time || "23:59"}:00`);
      return dt >= now;
    }) || [];
  const pastDebates =
    profile?.joinedDebates?.filter((d) => {
      const dt = new Date(`${d.date?.split("T")[0]}T${d.time || "23:59"}:00`);
      return dt < now;
    }) || [];

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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile card */}
      <Card>
        <CardContent className="p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt={user.fullName}
                className="h-20 w-20 rounded-full object-cover ring-2 ring-primary/50"
              />
            ) : (
              <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                <UserIcon className="h-10 w-10 text-primary" />
              </div>
            )}
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold">
                {user?.fullName || profile?.name}
              </h1>
              <div className="flex items-center gap-2 text-muted-foreground mt-1">
                <Mail className="h-4 w-4" />
                {user?.primaryEmailAddress?.emailAddress || profile?.email}
              </div>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 mt-3">
                <Badge variant="secondary">
                  {profile?.joinedDebates?.length || 0} debates joined
                </Badge>
                <Badge variant="outline">
                  Member since{" "}
                  {new Date(profile?.createdAt).toLocaleDateString()}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming debates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Upcoming Debates ({upcomingDebates.length})
        </h2>
        {upcomingDebates.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No upcoming debates
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {upcomingDebates.map((debate) => (
              <Card
                key={debate._id}
                className="hover:border-primary/30 transition-colors"
              >
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2 flex items-center gap-1">
                    {debate.revealStatus && debate.topicId ? (
                      debate.topicId.title
                    ) : (
                      <>
                        <Lock className="h-4 w-4" /> Topic Hidden
                      </>
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(debate.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {debate.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {debate.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past debates */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Past Debates ({pastDebates.length})
        </h2>
        {pastDebates.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No past debates
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {pastDebates.map((debate) => (
              <Card key={debate._id} className="opacity-75">
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">
                    {debate.topicId ? debate.topicId.title : "Unknown Topic"}
                  </h3>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(debate.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {debate.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {debate.location}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
