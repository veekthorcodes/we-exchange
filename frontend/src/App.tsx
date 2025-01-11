import { Route, Routes } from "react-router"
import Layout from "./global/components/Layout"
import LoginPage from "./screens/login/Page"

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<LoginPage />} />
      </Route>
    </Routes>
  )
}

export default App
