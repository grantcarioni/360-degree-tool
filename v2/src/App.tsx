// NI 360 Feedback Platform - Triggering deployment
import { Route, Switch } from "wouter";
import { Dashboard } from "./pages/Dashboard";
import { RequestFlow } from "./pages/RequestFlow";
import { Sidebar } from "./components/Sidebar";

function App() {
  return (
    <div className="flex h-screen bg-[#f2f4f5]">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/request" component={RequestFlow} />
          <Route>404 - Page Not Found</Route>
        </Switch>
      </main>
    </div>
  );
}

export default App;
