import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { BrowserRouter, Routes, Route, useNavigate } from "react-router"

import Login from "./components/pages/login"
import UnitPage from "./pages/UnitPage"
import MockInvestPage from "./pages/MockInvestPage"
import LearnPage from "./pages/LearnPage"
import RecordsPage from "./pages/RecordsPage"
import UnitDetailPage from "./pages/UnitDetailPage"
import "./styles/global.css"

function LoginRoute() {
    const navigate = useNavigate();
    return <Login onSkipTutorial={() => navigate("/units/unit1")} />;
}

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginRoute />}/>
                <Route path="units/:unitName" element={<UnitPage></UnitPage>}/>
                <Route path="units/:unitName/terms" element={<UnitDetailPage />}/>
                <Route path="learn/:chapterName" element={<LearnPage />}/>
                <Route path="mock-invest" element={<MockInvestPage />} />
                <Route path="records" element={<RecordsPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);