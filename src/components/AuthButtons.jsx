export default function AuthButtons({ user, onOpenModal, onShowDashboard, onLogout }) {
  if (user) {
    return (
      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm text-[#97979B]">Hi, {user.name || user.email}</span>
        <button
          onClick={onShowDashboard}
          className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-2.5 py-1.5 text-sm text-[#2D2D31] hover:bg-[#F9F9FA]"
        >
          Dashboard
        </button>
        <button
          onClick={onLogout}
          className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-2.5 py-1.5 text-sm text-[#2D2D31] hover:bg-[#F9F9FA]"
        >
          Log out
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4 flex gap-2">
      <button
        onClick={() => onOpenModal("signup")}
        className="cursor-pointer rounded-md bg-[#FD366E] px-2.5 py-1.5 text-sm text-white"
      >
        Sign up
      </button>
      <button
        onClick={() => onOpenModal("login")}
        className="cursor-pointer rounded-md border border-[#EDEDF0] bg-white px-2.5 py-1.5 text-sm text-[#2D2D31] hover:bg-[#F9F9FA]"
      >
        Log in
      </button>
    </div>
  );
}
