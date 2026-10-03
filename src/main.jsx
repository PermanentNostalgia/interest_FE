import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import { BrowserRouter, Routes, Route } from "react-router"

import UnitPage from "./pages/UnitPage"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="units/:unitName" element={<UnitPage></UnitPage>}/>
            </Routes>
        </BrowserRouter>
    </StrictMode>
);