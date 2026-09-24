import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyGigs from "./pages/MyGigs";
import GigDetails from "./pages/GigDetails";
import Signup from "./pages/Signup";
import MyServices from "./pages/MyServices";
import ServiceRequests from "./pages/ServiceRequests";
import Chat from "./pages/Chat";
import { SocketProvider } from "./context/SocketContext";

export default function App() {
  return (
    <Router>
      <SocketProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/my-gigs" element={<MyGigs />} />
          <Route path="/gig/:id" element={<GigDetails />} />
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/my-services" element={<MyServices />} />
          <Route path="/service-requests" element={<ServiceRequests />} />
          <Route path="/chat/:requestId" element={<Chat />} />
        </Routes>
      </SocketProvider>
    </Router>
  );
}