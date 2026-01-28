import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./lib/context";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Products } from "./pages/Products";
import { ProductForm } from "./pages/ProductForm";
import { Categories } from "./pages/Categories";
import { Orders } from "./pages/Orders";
import { OrderDetail } from "./pages/OrderDetail";
import { Users } from "./pages/Users";
import { Layout } from "./components/Layout";
import "./index.css";
import "./App.css";

type Route =
  | "dashboard"
  | "products"
  | "product-new"
  | "product-edit"
  | "categories"
  | "orders"
  | "order-detail"
  | "users";

function AppContent() {
  const { user, loading } = useAuth();
  const [route, setRoute] = useState<Route>("dashboard");
  const [selectedId, setSelectedId] = useState<string>("");

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.slice(1) || "dashboard";
      const [routeName, id] = hash.split("/");
      setRoute(routeName as Route);
      setSelectedId(id || "");
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const navigate = (newRoute: Route, id?: string) => {
    const hash = id ? `${newRoute}/${id}` : newRoute;
    window.location.hash = hash;
    setRoute(newRoute);
    setSelectedId(id || "");
  };

  const renderPage = () => {
    switch (route) {
      case "dashboard":
        return <Dashboard />;
      case "products":
        return <Products onNavigate={navigate} />;
      case "product-new":
        return <ProductForm onNavigate={navigate} />;
      case "product-edit":
        return <ProductForm productId={selectedId} onNavigate={navigate} />;
      case "categories":
        return <Categories />;
      case "orders":
        return <Orders onNavigate={navigate} />;
      case "order-detail":
        return <OrderDetail orderId={selectedId} onNavigate={navigate} />;
      case "users":
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentRoute={route} onNavigate={navigate}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
