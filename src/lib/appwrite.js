import { Client, Account, Databases, ID, Permission, Role, Query } from "appwrite";

const client = new Client()
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);

export function validateAppwriteEnv() {
  const endpoint = import.meta.env.VITE_APPWRITE_ENDPOINT;
  const projectId = import.meta.env.VITE_APPWRITE_PROJECT_ID;
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

  const missing = [];
  if (!endpoint) missing.push("VITE_APPWRITE_ENDPOINT");
  if (!projectId) missing.push("VITE_APPWRITE_PROJECT_ID");
  if (!databaseId) missing.push("VITE_APPWRITE_DATABASE_ID");
  if (!collectionId) missing.push("VITE_APPWRITE_COLLECTION_ID");

  if (missing.length) {
    console.warn(`Missing Appwrite env vars: ${missing.join(", ")}`);
    return false;
  }
  return true;
}

export async function ensureAnonymousSession() {
  try {
    await account.get();
    return; // already authenticated
  } catch {
    // not authenticated; create anonymous session
  }
  try {
    await account.createAnonymousSession();
  } catch (err) {
    console.warn("Failed to create anonymous session:", err);
  }
}

// Creates a document recording the search term and basic movie info
// Requires env vars: VITE_APPWRITE_DATABASE_ID, VITE_APPWRITE_COLLECTION_ID
export async function updateSearchCount(searchTerm, topMovie) {
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

  if (!databaseId || !collectionId) {
    console.warn("Appwrite DB/Collection env vars missing; skipping updateSearchCount");
    return;
  }

  try {
    const payload = {
      searchTerm,
      movieId: topMovie?.id ?? null,
      title: topMovie?.title ?? null,
      posterPath: topMovie?.poster_path ?? null,
      voteAverage: typeof topMovie?.vote_average === 'number' ? topMovie.vote_average : null,
      createdAt: new Date().toISOString(),
    };

    await databases.createDocument(
      databaseId,
      collectionId,
      ID.unique(),
      payload,
      [
        Permission.read(Role.any()),
        Permission.update(Role.user("*")),
        Permission.delete(Role.user("*")),
        Permission.create(Role.user("*")),
      ]
    );
  } catch (err) {
    console.warn("Failed to update search count in Appwrite:", err);
  }
}

export async function getTrendingMovies(limit = 10) {
  const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
  const collectionId = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

  if (!databaseId || !collectionId) {
    console.warn("Appwrite DB/Collection env vars missing; getTrendingMovies returns empty list");
    return [];
  }

  try {
    const { documents } = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        Query.orderDesc("createdAt"),
        Query.limit(200),
      ]
    );

    const movieIdToStats = new Map();

    for (const doc of documents) {
      const movieId = doc.movieId ?? null;
      if (movieId === null) continue;

      if (!movieIdToStats.has(movieId)) {
        movieIdToStats.set(movieId, {
          movieId,
          title: doc.title ?? null,
          posterPath: doc.posterPath ?? null,
          voteAverage: typeof doc.voteAverage === 'number' ? doc.voteAverage : null,
          count: 0,
        });
      }
      const stats = movieIdToStats.get(movieId);
      stats.count += 1;
    }

    const sorted = Array.from(movieIdToStats.values()).sort((a, b) => b.count - a.count);
    return sorted.slice(0, Math.max(0, limit));
  } catch (err) {
    console.warn("Failed to list trending movies from Appwrite:", err);
    return [];
  }
}

export { client, account, databases };
