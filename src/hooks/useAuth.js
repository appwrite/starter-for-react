import { useState, useEffect } from "react";
import { account } from "../lib/appwrite";
import { AppwriteException, ID } from "appwrite";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    account.get().then(setUser).catch(() => setUser(null))
  }, []);

  async function login(email, password) {
    setLoading(true);
    setError("");
    try {
      await account.createEmailPasswordSession({ email, password });
      const me = await account.get();
      setUser(me);
      return true;
    } catch (err) {
      setError(err instanceof AppwriteException ? err.message : "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function signup(email, password, name) {
    setLoading(true);
    setError("");
    try {
      await account.create({ userId: ID.unique(), email, password, name });
      await account.createEmailPasswordSession({ email, password });
      const me = await account.get();
      setUser(me);
      return true;
    } catch (err) {
      setError(err instanceof AppwriteException ? err.message : "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
  }

  function clearError() {
    setError("");
  }

  return { user, loading, error, login, signup, logout, clearError };
}
