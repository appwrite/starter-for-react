import { useState } from "react";
import "./App.css";
import { useAuth } from "./hooks/useAuth";
import IndexPage from "./pages/IndexPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  const [page, setPage] = useState("index");
  const auth = useAuth();

  async function handleLogout() {
    await auth.logout();
    setPage("index");
  }

  if (page === "dashboard" && auth.user) {
    return (
      <DashboardPage
        user={auth.user}
        onNavigate={setPage}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <IndexPage
      user={auth.user}
      auth={auth}
      onNavigate={setPage}
    />
  );
}

export default App;
