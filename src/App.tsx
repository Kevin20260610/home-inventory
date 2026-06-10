import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import { ItemsList, ItemDetail, ItemForm } from "@/pages/Items";
import Locations from "@/pages/Locations";
import Categories from "@/pages/Categories";
import Search from "@/pages/Search";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";

export default function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/items/new" element={<ItemForm />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/items/:id/edit" element={<ItemForm />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/search" element={<Search />} />
        </Routes>
        <PWAInstallPrompt />
      </MainLayout>
    </Router>
  );
}
