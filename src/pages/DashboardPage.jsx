export default function DashboardPage({ user, onNavigate, onLogout }) {
  return (
    <main className="checker-background flex min-h-screen flex-col items-center p-5">
      <div className="mt-25 w-full max-w-md lg:mt-34">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-[Poppins] text-2xl font-light text-[#2D2D31]">Dashboard</h1>
          <button
            onClick={() => onNavigate("index")}
            className="cursor-pointer text-sm text-[#97979B] hover:text-[#2D2D31]"
          >
            Back to home
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div className="rounded-md border border-[#EDEDF0] bg-white p-4">
            <p className="text-xs text-[#97979B]">Name</p>
            <p className="mt-0.5 font-medium text-[#2D2D31]">{user.name || "—"}</p>
          </div>
          <div className="rounded-md border border-[#EDEDF0] bg-white p-4">
            <p className="text-xs text-[#97979B]">Email</p>
            <p className="mt-0.5 font-medium text-[#2D2D31]">{user.email}</p>
          </div>
          <div className="rounded-md border border-[#EDEDF0] bg-white p-4">
            <p className="text-xs text-[#97979B]">User ID</p>
            <p className="mt-0.5 font-[Fira_Code] text-sm text-[#2D2D31]">{user.$id}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="mt-6 w-full cursor-pointer rounded-md border border-[#EDEDF0] bg-white py-2 text-sm text-[#2D2D31] hover:bg-[#F9F9FA]"
        >
          Log out
        </button>
      </div>
    </main>
  );
}
