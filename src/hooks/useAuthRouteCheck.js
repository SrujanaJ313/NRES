import { useMemo } from "react";
import { useLocation } from "react-router-dom";

export const authRoutes = [
  "/forgot-password",
  "/login",
  "/register",
  "/verification",
];

export default function useAuthRouteCheck() {
  const location = useLocation();

  const isAuthRoute = useMemo(() => {
    return authRoutes.some((r) => location.pathname.includes(r));
  }, [location.pathname]);

  return isAuthRoute;
}
