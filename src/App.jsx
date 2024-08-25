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
import styled, { ThemeProvider } from "styled-components";
import { theme } from "./styles/theme";
import LandingPage from "./pages/LandingPage";
import { useEffect, useState } from "react";

const Layout = styled.div`
  position: relative;
`;

function App() {
  const [showLanding, setShowLanding] = useState(false);

  useEffect(() => {
    const hasSeenLanding = localStorage.getItem("hasSeenLanding");
    localStorage.removeItem("hasSeenLanding"); //테스트시 사용
    if (!hasSeenLanding) {
      setShowLanding(true);
    }
  }, []);

  const handleLandingComplete = () => {
    setShowLanding(false);
    localStorage.setItem("hasSeenLanding", "true");
  };
  return (
    <ThemeProvider theme={theme}>
      <Layout>
        {showLanding ? (
          <LandingPage onComplete={handleLandingComplete} />
        ) : (
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
        )}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
