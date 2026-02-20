import { useEffect, useState } from "react";
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
  AlertTriangle,
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

const DATE_OPTIONS = generateDateOptions(30);

// ── Custom IST Time Picker helpers ──
function buildHourOptions() {
  const opts = [];
  for (let h = 1; h <= 12; h++) {
    opts.push({ value: String(h), label: String(h) });
  }
  return opts;
}

function buildMinuteOptions() {
  const opts = [];
  for (let m = 0; m < 60; m++) {
    opts.push({
      value: String(m).padStart(2, "0"),
      label: String(m).padStart(2, "0"),
    });
  }
  return opts;
}

const HOUR_OPTIONS = buildHourOptions();
const MINUTE_OPTIONS = buildMinuteOptions();

/** Convert 12-hour parts → "HH:MM" 24-hour string */
function to24h(hour, minute, period) {
  let h = parseInt(hour, 10);
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, "0")}:${minute}`;
}

/** Format "HH:MM" → "h:mm AM/PM IST" */
function formatTimeIST(time24) {
  if (!time24) return "";
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, "0")} ${period} IST`;
}

export default function ManageDebates() {
  const [debates, setDebates] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    date: "",
    hour: "",
    minute: "",
    period: "AM",
    location: "",
  });
  const [submitting, setSubmitting] = useState(false);

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
    // Poll every 30 seconds so auto-reveal / auto-complete updates show up
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const unusedTopicCount = topics.filter((t) => !t.isUsed).length;
  const canCreate = unusedTopicCount > 0;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!canCreate) return;

    const time24 = to24h(form.hour, form.minute, form.period);

    setSubmitting(true);
    try {
      const { data } = await debateApi.create({
        date: form.date,
        time: time24,
        location: form.location,
      });
      if (data.success) {
        fetchData();
        setForm({
          date: "",
          hour: "",
          minute: "",
          period: "AM",
          location: "",
        });
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

  const timeComplete = form.hour && form.minute && form.period;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Debates</h1>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs whitespace-nowrap">
            <Shuffle className="h-3 w-3 mr-1" />
            {unusedTopicCount} unused topic{unusedTopicCount !== 1 ? "s" : ""}
          </Badge>

          {!canCreate ? (
            <Button disabled className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              No Unused Topics
            </Button>
          ) : (
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
                    Schedule a new debate. The topic will be automatically
                    revealed at the scheduled IST time.
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
                      onValueChange={(v) => setForm({ ...form, date: v })}
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

                  {/* ── Time (IST) — custom hour : minute  AM/PM ── */}
                  <div className="space-y-2">
                    <Label>
                      <Clock className="h-4 w-4 inline mr-1" />
                      Time (IST)
                    </Label>
                    <div className="flex items-center gap-2">
                      {/* Hour */}
                      <Select
                        value={form.hour}
                        onValueChange={(v) => setForm({ ...form, hour: v })}
                      >
                        <SelectTrigger className="w-[72px]">
                          <SelectValue placeholder="HH" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {HOUR_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <span className="text-lg font-bold">:</span>

                      {/* Minute */}
                      <Select
                        value={form.minute}
                        onValueChange={(v) => setForm({ ...form, minute: v })}
                      >
                        <SelectTrigger className="w-[72px]">
                          <SelectValue placeholder="MM" />
                        </SelectTrigger>
                        <SelectContent className="max-h-48">
                          {MINUTE_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      {/* AM / PM */}
                      <Select
                        value={form.period}
                        onValueChange={(v) => setForm({ ...form, period: v })}
                      >
                        <SelectTrigger className="w-[80px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {timeComplete && (
                      <p className="text-xs text-muted-foreground">
                        Selected:{" "}
                        {formatTimeIST(
                          to24h(form.hour, form.minute, form.period),
                        )}
                      </p>
                    )}
                  </div>

                  {/* ── Location ── */}
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
                      disabled={submitting || !form.date || !timeComplete}
                    >
                      {submitting ? "Creating..." : "Create Debate"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
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
                      {!debate.revealStatus && debate.status === "upcoming" && (
                        <Badge variant="outline" className="text-xs">
                          Auto-reveals at {formatTimeIST(debate.time)}
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 shrink-0" />
                        {new Date(debate.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 shrink-0" />
                        {formatTimeIST(debate.time)}
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
