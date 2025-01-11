import { Route, Routes } from "react-router"
import Layout from "./global/components/Layout"
import LoginPage from "./screens/login/Page"
import DashboardPage from "./screens/dashboard/Page"
import ProtectedRoute from "./global/components/ProtectedRoute"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginPage />} />
        <Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App
