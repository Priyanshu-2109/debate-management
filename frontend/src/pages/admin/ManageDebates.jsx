import { useEffect, useState, useMemo } from "react";
import { debateApi, topicApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Clock,
  Shuffle,
} from "lucide-react";

// Generate date options for the next N days
function generateDateOptions(days = 30) {
  const options = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const value = d.toISOString().split("T")[0];
    const label = d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    options.push({
      value,
      label:
        i === 0 ? `Today - ${label}` : i === 1 ? `Tomorrow - ${label}` : label,
    });
  }
  return options;
}

// All 48 thirty-minute slots across the day
function buildAllTimeOptions() {
  const options = [];
  for (let m = 0; m < 24 * 60; m += 30) {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    const value = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    options.push({
      value,
      label: `${displayHour}:${String(mins).padStart(2, "0")} ${ampm}`,
      minutes: m,
    });
  }
  return options;
}

const DATE_OPTIONS = generateDateOptions(30);
const ALL_TIME_OPTIONS = buildAllTimeOptions();

export default function ManageDebates() {
  const [debates, setDebates] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ date: "", time: "", location: "" });
  const [submitting, setSubmitting] = useState(false);

  // For today: only current time onward; for future dates: all slots
  const timeOptions = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (form.date !== todayStr) return ALL_TIME_OPTIONS;
    const now = new Date();
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    // Round up to the next 30-min boundary so the current slot is included
    const cutoff = Math.ceil(nowMinutes / 30) * 30;
    return ALL_TIME_OPTIONS.filter((opt) => opt.minutes >= cutoff);
  }, [form.date]);

  const fetchData = async () => {
    try {
      const [debRes, topRes] = await Promise.all([
        debateApi.getAll(),
        topicApi.getAll(),
      ]);
      if (debRes.data.success) setDebates(debRes.data.debates);
      if (topRes.data.success) setTopics(topRes.data.topics);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await debateApi.create(form);
      if (data.success) {
        fetchData();
        setForm({ date: "", time: "", location: "" });
        setOpen(false);
        toast({ title: "Debate created", variant: "success" });
      }
    } catch (err) {
      toast({
        title: "Failed to create debate",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReveal = async (id) => {
    try {
      const { data } = await debateApi.reveal(id);
      if (data.success) {
        fetchData();
        toast({
          title: "Topic revealed!",
          description:
            data.message ||
            "A random topic was assigned and participants notified.",
          variant: "success",
        });
      }
    } catch (err) {
      toast({
        title: "Failed to reveal",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this debate?")) return;
    try {
      await debateApi.delete(id);
      setDebates(debates.filter((d) => d._id !== id));
      toast({ title: "Debate deleted", variant: "success" });
    } catch (err) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await debateApi.update(id, { status });
      fetchData();
      toast({ title: `Status updated to ${status}`, variant: "success" });
    } catch (err) {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      upcoming: "default",
      active: "success",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={map[status] || "default"}>{status}</Badge>;
  };

  const unusedTopicCount = topics.filter((t) => !t.isUsed).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Debates</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            <Shuffle className="h-3 w-3 mr-1" />
            {unusedTopicCount} unused topic{unusedTopicCount !== 1 ? "s" : ""}
          </Badge>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" /> New Debate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Debate</DialogTitle>
                <DialogDescription>
                  Schedule a new debate. A random topic will be assigned when
                  you reveal.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                {/* ── Date ── */}
                <div className="space-y-2">
                  <Label>
                    <Calendar className="h-4 w-4 inline mr-1" />
                    Date
                  </Label>
                  <Select
                    value={form.date}
                    onValueChange={(v) => {
                      // If switching to today, clear a time that may now be in the past
                      const todayStr = new Date().toISOString().split("T")[0];
                      const keepTime =
                        v !== todayStr
                          ? form.time
                          : (() => {
                              const now = new Date();
                              const cutoff =
                                Math.ceil(
                                  (now.getHours() * 60 + now.getMinutes()) / 30,
                                ) * 30;
                              const [h, m] = form.time.split(":").map(Number);
                              return h * 60 + m >= cutoff ? form.time : "";
                            })();
                      setForm({ ...form, date: v, time: keepTime });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a date" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {DATE_OPTIONS.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* ── Time ── */}
                <div className="space-y-2">
                  <Label>
                    <Clock className="h-4 w-4 inline mr-1" />
                    Time
                  </Label>
                  <Select
                    value={form.time}
                    onValueChange={(v) => setForm({ ...form, time: v })}
                    disabled={!form.date}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          form.date ? "Select a time" : "Select a date first"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      {timeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    placeholder="e.g. Room 101, Main Hall"
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    required
                  />
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={submitting || !form.date || !form.time}
                  >
                    {submitting ? "Creating..." : "Create Debate"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-48 mb-2" />
                <div className="h-3 bg-muted rounded w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : debates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Calendar className="h-12 w-12 mb-4" />
            <p className="text-lg">No debates yet</p>
            <p className="text-sm">Create your first debate</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {debates.map((debate) => (
            <Card
              key={debate._id}
              className="hover:border-primary/30 transition-colors"
            >
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-semibold truncate">
                        {debate.revealStatus && debate.topicId
                          ? debate.topicId.title
                          : "Topic Not Assigned Yet"}
                      </h3>
                      {getStatusBadge(debate.status)}
                      {debate.revealStatus && (
                        <Badge variant="success">Revealed</Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {new Date(debate.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        {debate.time}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 shrink-0" />
                        {debate.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4 shrink-0" />
                      {debate.participants?.length || 0} participants
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Select
                      value={debate.status}
                      onValueChange={(v) => handleStatusChange(debate._id, v)}
                    >
                      <SelectTrigger className="w-[130px] h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    {!debate.revealStatus && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReveal(debate._id)}
                        title="Randomly assign an unused topic and reveal it"
                      >
                        <Shuffle className="h-4 w-4 mr-1" /> Reveal
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(debate._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
