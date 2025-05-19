import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserContextProvider from "./contexts/UserContext"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Pgs from "./pages/Pgs"
import Pg from "./pages/Pg"
import Dashboard from "./pages/Dashboard"
import Protected from "./components/Protected"

function App() {
  return (
   <UserContextProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/pg-list" element={<Pgs/>} />
        <Route path="/pg/:id" element={<Pg/>} />
        <Route path="/dashboard" element={<Protected role={"owner"}><Dashboard/></Protected>} />

      </Routes>
    
    </BrowserRouter>
   </UserContextProvider>
  )
}

export default App
