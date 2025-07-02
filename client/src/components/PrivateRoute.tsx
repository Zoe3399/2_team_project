import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { ReactNode } from "react";

interface PrivateRouteProps {
  children: ReactNode;
}

/**
 * PrivateRoute 컴포넌트
 * - 로그인된 사용자만 자식 컴포넌트를 렌더링합니다.
 * - 로딩 중에는 null을 반환하고,
 * - 미로그인 시 로그인 페이지로 리다이렉트합니다.
 */
export default function PrivateRoute({ children }: PrivateRouteProps) {
  const { user, loading }: { user: any; loading: boolean } = useAuth();

  // 인증 상태를 확인하는 동안 아무것도 렌더링하지 않음
  if (loading) {
    return null;
  }

  // 로그인되지 않은 경우 로그인 페이지로 이동
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}