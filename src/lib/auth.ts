import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "./firebase";
import { getPostAuthRedirectPath } from "./authRouting";
import { ensureUserProfile } from "./userProfile";

/* ─── Providers ─────────────────────────────────────────────── */

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

/* ─── User data shape ────────────────────────────────────────── */

export interface AuthUser {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string;
}

export function toAuthUser(user: User, providerId: string): AuthUser {
  return {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    provider: providerId,
  };
}

/* ─── Friendly error messages ────────────────────────────────── */

function friendlyError(code: string, message?: string): string {
  const map: Record<string, string> = {
    "auth/popup-closed-by-user": "Sign-in cancelled. Please try again.",
    "auth/popup-blocked":
      "Popup was blocked by your browser. Allow popups and retry.",
    "auth/account-exists-with-different-credential":
      "An account already exists with this email using a different sign-in method.",
    "auth/cancelled-popup-request": "Only one sign-in window at a time.",
    "auth/network-request-failed":
      "Network error. Check your connection and retry.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/operation-not-allowed":
      "This sign-in method is not enabled. Enable it in the Firebase Console → Authentication → Sign-in method.",
    "auth/unauthorized-domain":
      "This domain is not authorised. Add it in Firebase Console → Authentication → Settings → Authorised domains.",
    "auth/invalid-api-key": "Invalid Firebase API key. Check your firebase.ts config.",
    "auth/configuration-not-found":
      "Firebase project not configured correctly. Check authDomain and projectId.",
  };
  // Fall back to the raw Firebase message so nothing is silently swallowed
  return map[code] ?? (code ? `[${code}] ${message ?? "Unknown error."}` : "Something went wrong. Please try again.");
}

/* ─── Auth functions ─────────────────────────────────────────── */

export async function loginWithGoogle(): Promise<AuthUser> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return toAuthUser(result.user, "google.com");
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    const message = (err as { message?: string }).message ?? "";
    
    // Suppress console errors for benign user actions
    if (code !== "auth/cancelled-popup-request" && code !== "auth/popup-closed-by-user") {
      console.error("[loginWithGoogle] Firebase error:", code, message);
    }
    
    throw new Error(friendlyError(code, message));
  }
}

export async function signupWithEmail(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    return toAuthUser(result.user, "password");
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? "";
    const message = (err as { message?: string }).message ?? "";
    console.error("[signupWithEmail] Firebase error:", code, message);
    throw new Error(friendlyError(code, message));
  }
}

export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

export async function handleAuthRedirect(
  authUser: AuthUser,
  router: { replace: (path: string) => void }
): Promise<void> {
  try {
    const profile = await ensureUserProfile({
      uid: authUser.uid,
      displayName: authUser.displayName,
      email: authUser.email,
      photoURL: authUser.photoURL,
    });

    router.replace(getPostAuthRedirectPath(profile.onboardingCompleted));
  } catch (err) {
    console.error("[handleAuthRedirect] Error checking onboarding status:", err);
    router.replace(getPostAuthRedirectPath(false));
  }
}
