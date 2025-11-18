import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import TopNav from "@/components/TopNav";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <TopNav />
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-16">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">404</h1>
          <p className="mb-4 text-xl text-white/80">Oops! Page not found</p>
          <Link to="/" className="inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
            Return to Home
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
