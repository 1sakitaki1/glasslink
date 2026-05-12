import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, login, clear, loginStatus } = useInternetIdentity();

  const isAuthenticated = !!identity;
  const isLoading = loginStatus === "logging-in";

  return {
    identity,
    isAuthenticated,
    isLoading,
    login,
    logout: clear,
    loginStatus,
    principalText: identity?.getPrincipal().toText() ?? null,
  };
}
