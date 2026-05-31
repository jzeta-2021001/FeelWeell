import { Routes, Route } from "react-router-dom";
import { AuthPage } from "../../features/auth/pages/AuthPage";
import { ForgotPasswordPage } from "../../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../../features/auth/pages/ResetPasswordPage";
import { ActivateAccountPage } from "../../features/auth/pages/ActivateAccountPage";
import { ChangePasswordPage } from "../../features/auth/pages/ChangePasswordPage";
import { UnauthorizedPage } from "../../features/auth/pages/UnauthorizedPage";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { ProtectedRoutes } from "./ProtectedRoutes";
import { RoleGuard } from "./RoleGuard";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/activate/:token" element={<ActivateAccountPage />} />
      <Route path="/unauthorized" element={<UnauthorizedPage />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoutes>
            <RoleGuard
              allowedRoles={[
                "ADMIN_ROLE",
                "ADMIN_USERS_ROLE",
                "ADMIN_MOODTRACKING_ROLE",
                "ADMIN_HEALTHY_ROLE",
                "USER_ROLE",
              ]}
            >
              <DashboardLayout />
            </RoleGuard>
          </ProtectedRoutes>
        }
      />

      <Route
        path="/change-password"
        element={
          <ProtectedRoutes>
            <ChangePasswordPage />
          </ProtectedRoutes>
        }
      />
    </Routes>
  );
};
