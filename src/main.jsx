import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { BrowserRouter, Routes, Route } from "react-router"

import UnitPage from "./pages/UnitPage"
import MockInvestPage from "./pages/MockInvestPage"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="login" element={<h1>WIP</h1>}/>
                <Route path="units/:unitName" element={<UnitPage></UnitPage>}/>
                <Route path="learn/:chapterName" element={<h1>WIP</h1>}/>
                <Route path="mock-invest" element={<MockInvestPage />} />
            </Routes>
        </BrowserRouter>
    </StrictMode>
);