import { useEffect, useState, useMemo } from "react";
import { topicApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FileText,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ManageTopics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [usedCollapsed, setUsedCollapsed] = useState(true);

  const fetchTopics = () => {
    topicApi
      .getAll()
      .then(({ data }) => {
        if (data.success) setTopics(data.topics);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const unusedTopics = useMemo(() => topics.filter((t) => !t.isUsed), [topics]);
  const usedTopics = useMemo(() => topics.filter((t) => t.isUsed), [topics]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await topicApi.create(form);
      if (data.success) {
        setTopics([data.topic, ...topics]);
        setForm({ title: "", description: "" });
        setOpen(false);
        toast({ title: "Topic created", variant: "success" });
      }
    } catch (err) {
      toast({
        title: "Failed to create topic",
        description: err.response?.data?.message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this topic?")) return;
    try {
      await topicApi.delete(id);
      setTopics(topics.filter((t) => t._id !== id));
      toast({ title: "Topic deleted", variant: "success" });
    } catch (err) {
      toast({ title: "Failed to delete", variant: "destructive" });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Manage Topics</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> New Topic
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Topic</DialogTitle>
              <DialogDescription>Add a new debate topic.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description</Label>
                <Textarea
                  id="desc"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  required
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Topic"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
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
      ) : topics.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FileText className="h-12 w-12 mb-4" />
            <p className="text-lg">No topics yet</p>
            <p className="text-sm">Create your first debate topic</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {/* ── Available (Unused) Topics ── */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                {unusedTopics.length}
              </Badge>
              Available Topics
            </h2>
            {unusedTopics.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <p className="text-sm">
                    No available topics. Add more so debates can be created.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {unusedTopics.map((topic) => (
                  <Card
                    key={topic._id}
                    className="hover:border-primary/30 transition-colors"
                  >
                    <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-base sm:text-lg font-semibold truncate">
                            {topic.title}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            Available
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {topic.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Created{" "}
                          {new Date(topic.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(topic._id)}
                        className="text-destructive hover:text-destructive shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* ── Used Topics ── */}
          {usedTopics.length > 0 && (
            <div>
              <button
                onClick={() => setUsedCollapsed(!usedCollapsed)}
                className="w-full text-left text-lg font-semibold mb-3 flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {usedCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
                <Badge variant="secondary" className="text-xs">
                  {usedTopics.length}
                </Badge>
                Used Topics
              </button>
              {!usedCollapsed && (
                <div className="grid gap-4">
                  {usedTopics.map((topic) => (
                    <Card
                      key={topic._id}
                      className="opacity-60 hover:border-primary/30 transition-colors"
                    >
                      <CardContent className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-semibold truncate">
                              {topic.title}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Used
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm">
                            {topic.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Created{" "}
                            {new Date(topic.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
