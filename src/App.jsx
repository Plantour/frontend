import "./App.css";
import { Routes, Route, Router } from "react-router-dom";
import Map from "./pages/Map";
import Quest from "./pages/Quest";
import My from "./pages/My";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import QuestStatus from "./pages/QuestStatus";
import GoogleOAuthCallback from "./components/GoogleLogin/GoogleOAuthCallback";
import PlantNote from "./pages/PlantNote";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Map />} />
        <Route path="/quest" element={<Quest />} />
        <Route path="/plantnote" element={<PlantNote />} />
        <Route path="/my" element={<My />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/queststatus/:selectedSeason/:blockId"
          element={<QuestStatus />}
        />
        <Route path="/oauth/callback" element={<GoogleOAuthCallback />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
