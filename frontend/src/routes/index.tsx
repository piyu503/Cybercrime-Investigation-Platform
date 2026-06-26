import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Cases from "@/pages/Cases";
import CreateCase from "@/pages/CreateCase";
import CaseDetail from "@/pages/CaseDetail";
import EvidenceUpload from "@/pages/EvidenceUpload";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "cases", element: <Cases /> },
      { path: "cases/new", element: <CreateCase /> },
      { path: "cases/:case_id", element: <CaseDetail /> },
      { path: "cases/:case_id/upload", element: <EvidenceUpload /> },
      { path: "settings", element: <div className="p-8 text-white/50 text-center">Settings coming soon</div> },
    ],
  },
]);
