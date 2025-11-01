import { ProtectedRoute } from "@/components/auth/protected-route";
import Layout from "@/components/dashboard/Layout";

export const metadata = {
  title: "Admin Panel",
  description: "Developed by Odvut Solution",
};

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ProtectedRoute>
          <Layout>{children}</Layout>
        </ProtectedRoute>
      </body>
    </html>
  );
}
