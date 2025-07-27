import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Auth" },
  { name: "description", content: "Log into your account" },
];

const Auth = () => {
  const { isLoading, auth } = usePuterStore();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next") || "/";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && auth.isAuthenticated) {
      // Asegurarnos de que next sea una ruta válida
      const targetPath = next && next.startsWith("/") ? next : "/";
      navigate(targetPath, { replace: true });
    }
  }, [auth.isAuthenticated, next, isLoading, navigate]);

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen items-center justify-center flex">
        <div className="gradient-border shadow-lg">
          <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col items-center gap-2 text-center">
              <h1>Welcome</h1>
              <h2>Checking authentication...</h2>
            </div>
            <div>
              <button className="auth-button animate-pulse">
                <p>Loading...</p>
              </button>
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen items-center justify-center flex">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">
          <div className="flex flex-col items-center gap-2 text-center">
            <h1>Welcome</h1>
            <h2>Log In to Continue Your Job Journey</h2>
          </div>
          <div>
            {auth.isAuthenticated ? (
              <button className="auth-button" onClick={auth.signOut}>
                <p>Log Out</p>
              </button>
            ) : (
              <button className="auth-button" onClick={auth.signIn}>
                <p>Login</p>
              </button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Auth;
