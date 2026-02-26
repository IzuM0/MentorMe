import { useState, useEffect } from "react";
import { DashboardLayout } from "../../components/layout/DashboardLayout";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Link } from "react-router";
import { Calendar, Clock, Video, X, Star, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import {
  RatingModal,
  type SessionInfo,
  type RatingSubmission,
} from "../../components/ui/RatingModal";
import { EmptyState } from "../../components/ui/EmptyState";
import { SkeletonCard } from "../../components/ui/SkeletonCard";
import {
  fetchSessions,
  updateSessionStatus,
  submitSessionRating,
  type SessionListItem,
} from "../../../lib/api";

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop";

export default function MenteeSessions() {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratedSessionIds, setRatedSessionIds] = useState<Set<string>>(new Set());
  const [ratingModalSession, setRatingModalSession] = useState<{
    id: string;
    mentor: string;
    topic: string;
    date: string;
  } | null>(null);

  useEffect(() => {
    fetchSessions()
      .then(setSessions)
      .catch(() => {
        toast.error("Failed to load sessions");
        setSessions([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcomingSessions = sessions.filter((s) => {
    const scheduled = new Date(s.scheduledAt);
    return (
      (s.status === "scheduled" || s.status === "in_progress") &&
      scheduled >= now
    );
  });
  const completedSessions = sessions.filter((s) => {
    const scheduled = new Date(s.scheduledAt);
    return s.status === "completed" || scheduled < now || s.status === "cancelled";
  });

  const handleMessageMentor = (mentorName: string) => {
    toast.info(`Opening chat with ${mentorName}...`);
  };

  const handleCancelSession = async (sessionId: string) => {
    try {
      await updateSessionStatus(sessionId, "cancelled");
      setSessions((prev) =>
        prev.map((s) =>
          s.id === sessionId ? { ...s, status: "cancelled" } : s
        )
      );
      toast.success("Session cancelled");
    } catch {
      toast.error("Failed to cancel session");
    }
  };

  const handleBookAgain = (mentorName: string) => {
    toast.info(`Redirecting to ${mentorName}'s profile...`);
  };

  const handleRatingSubmit = (sessionId: string) => (data: RatingSubmission) => {
    submitSessionRating(sessionId, {
      rating: data.rating,
      comment: data.comment,
      tags: data.tags,
    })
      .then(() => {
        setRatedSessionIds((prev) => new Set(prev).add(sessionId));
      })
      .catch(() => toast.error("Failed to submit rating"));
  };

  const sessionInfoForModal: SessionInfo | null = ratingModalSession
    ? {
        name: ratingModalSession.mentor,
        date: ratingModalSession.date,
        topic: ratingModalSession.topic,
      }
    : null;

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  const formatTimeRange = (iso: string, durationMin: number) => {
    const start = new Date(iso);
    const end = new Date(start.getTime() + durationMin * 60 * 1000);
    return `${start.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })} - ${end.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`;
  };

  return (
    <DashboardLayout role="mentee">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Sessions</h1>
        <p className="text-gray-600">Manage your mentorship sessions</p>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 p-1">
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingSessions.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedSessions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : upcomingSessions.length === 0 ? (
            <EmptyState
              icon={<Calendar size={48} />}
              title="No sessions yet"
              subtitle="Book a session with a mentor to get started on your journey."
              actionLabel="Browse Mentors"
              onAction={() => (window.location.href = "/mentors")}
            />
          ) : (
            upcomingSessions.map((session) => (
              <Card
                key={session.id}
                className="p-6 border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    <AvatarImage
                      src={session.mentor.avatarUrl ?? DEFAULT_AVATAR}
                    />
                    <AvatarFallback>
                      {(session.mentor.name ?? "M")[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {session.topic}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          with {session.mentor.name ?? "Mentor"}
                        </p>
                      </div>
                      {session.status === "in_progress" ? (
                        <Badge className="bg-indigo-50 text-indigo-600 border-0">
                          In progress
                        </Badge>
                      ) : session.status === "scheduled" ? (
                        <Badge className="bg-emerald-50 text-emerald-600 border-0">
                          Confirmed
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-50 text-yellow-600 border-0">
                          Pending
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                      <span className="flex items-center gap-2">
                        <Calendar size={18} />
                        {formatDate(session.scheduledAt)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={18} />
                        {formatTimeRange(
                          session.scheduledAt,
                          session.durationMinutes
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link to={`/session/${session.id}`}>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                          <Video size={18} className="mr-2" />
                          Join Session
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleMessageMentor(session.mentor.name ?? "Mentor")
                        }
                      >
                        <MessageSquare size={18} className="mr-2" />
                        Message Mentor
                      </Button>
                      {session.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          className="text-red-600 hover:text-red-700 hover:border-red-300"
                          onClick={() => handleCancelSession(session.id)}
                        >
                          <X size={18} className="mr-2" />
                          Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : completedSessions.length === 0 ? (
            <EmptyState
              icon={<Calendar size={48} />}
              title="No sessions yet"
              subtitle="Completed sessions will appear here after you finish them."
            />
          ) : (
            completedSessions.map((session) => (
              <Card
                key={session.id}
                className="p-6 border-0 shadow-lg"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="h-16 w-16 flex-shrink-0">
                    <AvatarImage
                      src={session.mentor.avatarUrl ?? DEFAULT_AVATAR}
                    />
                    <AvatarFallback>
                      {(session.mentor.name ?? "M")[0]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {session.topic}
                        </h3>
                        <p className="text-gray-600 mb-2">
                          with {session.mentor.name ?? "Mentor"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className="fill-yellow-400 text-yellow-400"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-3">
                      <span className="flex items-center gap-2">
                        <Calendar size={18} />
                        {formatDate(session.scheduledAt)}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock size={18} />
                        {session.durationMinutes} min
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {ratedSessionIds.has(session.id) ? (
                        <Button
                          variant="outline"
                          disabled
                          className="text-emerald-600 border-emerald-200"
                        >
                          <Star
                            size={18}
                            className="mr-2 fill-yellow-400 text-yellow-400"
                          />
                          Rated ✓
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() =>
                            setRatingModalSession({
                              id: session.id,
                              mentor: session.mentor.name ?? "Mentor",
                              topic: session.topic,
                              date: formatDate(session.scheduledAt),
                            })
                          }
                        >
                          <Star size={18} className="mr-2" />
                          Rate Session
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleBookAgain(session.mentor.name ?? "Mentor")
                        }
                      >
                        <Calendar size={18} className="mr-2" />
                        Book Again
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          handleMessageMentor(session.mentor.name ?? "Mentor")
                        }
                      >
                        <MessageSquare size={18} className="mr-2" />
                        Message Mentor
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <RatingModal
        isOpen={!!ratingModalSession}
        onClose={() => setRatingModalSession(null)}
        onSubmit={
          ratingModalSession
            ? handleRatingSubmit(ratingModalSession.id)
            : () => {}
        }
        sessionInfo={sessionInfoForModal}
      />
    </DashboardLayout>
  );
}
