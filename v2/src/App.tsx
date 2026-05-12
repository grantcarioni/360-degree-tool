// NI 360 Feedback Platform — v2
import { Route, Switch } from "wouter";
import { Dashboard } from "./pages/Dashboard";
import { RequestFlow } from "./pages/RequestFlow";
import { Team } from "./pages/Team";
import { Analytics } from "./pages/Analytics";
import { Settings } from "./pages/Settings";
import { Sidebar } from "./components/Sidebar";
import { Toaster } from "./components/Toast";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <div className="flex h-screen bg-[#f2f4f5]">
          <Sidebar />
          <main className="flex-1 overflow-auto p-8">
            <Switch>
              <Route path="/" component={Dashboard} />
              <Route path="/request" component={RequestFlow} />
              <Route path="/team" component={Team} />
              <Route path="/analytics" component={Analytics} />
              <Route path="/settings" component={Settings} />
              <Route>
                <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                  <p className="text-6xl">🔍</p>
                  <h1 className="text-2xl font-bold text-[#253746]">Page Not Found</h1>
                  <p className="text-gray-500">The page you're looking for doesn't exist.</p>
                  <a href="/" className="ni-btn-primary">Return to Dashboard</a>
                </div>
              </Route>
            </Switch>
          </main>
          <Toaster />
        </div>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
