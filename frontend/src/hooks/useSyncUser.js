import { useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import { userApi } from "@/services/api";

/**
 * Hook to sync Clerk user data with our MongoDB backend.
 * Syncs only once per unique clerkId to avoid hammering Clerk's token
 * endpoint on every session-token refresh (which causes 429s).
 */
export function useSyncUser() {
  const { user, isSignedIn, isLoaded } = useUser();
  // Track the last clerkId we successfully synced so we never re-sync the
  // same user within a single page session.
  const syncedClerkId = useRef(null);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !user) return;

    // Don't sync again if we already synced this user
    if (syncedClerkId.current === user.id) return;

    const email = user.primaryEmailAddress?.emailAddress;
    // Email is required by the backend — skip if Clerk hasn't loaded it yet
    if (!email) return;

    syncedClerkId.current = user.id;

    userApi
      .sync({
        clerkId: user.id,
        name:
          user.fullName ||
          `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
          "User",
        email,
        avatar: user.imageUrl,
      })
      .catch((err) => {
        // Reset so a retry is attempted on next render if it failed
        syncedClerkId.current = null;
        console.error("User sync failed:", err);
      });
    // Only re-run when the user's identity or sign-in state changes,
    // NOT on every `user` object reference change (which happens on token refresh).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress]);
}
