import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/AppLayout";
import Dashboard from "@/pages/Dashboard";
import Cases from "@/pages/Cases";
import CreateCase from "@/pages/CreateCase";
import CaseDetail from "@/pages/CaseDetail";
import EvidenceUpload from "@/pages/EvidenceUpload";
import Evidence from "@/pages/Evidence";
import Timeline from "@/pages/Timeline";
import Reports from "@/pages/Reports";
import Search from "@/pages/Search";

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
      { path: "evidence", element: <Evidence /> },
      { path: "timeline", element: <Timeline /> },
      { path: "reports", element: <Reports /> },
      { path: "search", element: <Search /> },
    ],
  },
]);
