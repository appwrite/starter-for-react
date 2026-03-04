import { useState } from "react";

export default function AuthModal({ mode, onClose, onLogin, onSignup, loading, error }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [currentMode, setCurrentMode] = useState(mode);

  async function handleSubmit(e) {
    e.preventDefault();
    const success = currentMode === "login"
      ? await onLogin(email, password)
      : await onSignup(email, password, name);
    if (success) onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-[#EDEDF0] bg-white p-6 shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-[Poppins] text-lg font-light text-[#2D2D31]">
            {currentMode === "login" ? "Log in" : "Create account"}
          </h2>
          <button onClick={onClose} className="text-[#97979B] hover:text-[#2D2D31]">
            <span className="icon-x" aria-hidden="true" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          {currentMode === "signup" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm text-[#97979B]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm outline-none focus:border-[#FD366E]"
              />
            </div>
          )}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#97979B]">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm outline-none focus:border-[#FD366E]"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm text-[#97979B]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="rounded-md border border-[#EDEDF0] px-3 py-2 text-sm outline-none focus:border-[#FD366E]"
            />
          </div>
          {error && (
            <p className="rounded-md bg-[#FF453A1A] px-3 py-2 text-sm text-[#B31212]">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="mt-1 cursor-pointer rounded-md bg-[#FD366E] py-2 text-sm text-white disabled:opacity-60"
          >
            {loading ? "Please wait…" : currentMode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-[#97979B]">
          {currentMode === "login" ? (
            <>
              No account?{" "}
              <button onClick={() => setCurrentMode("signup")} className="text-[#FD366E] hover:underline">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setCurrentMode("login")} className="text-[#FD366E] hover:underline">
                Log in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
