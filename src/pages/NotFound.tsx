import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black/95 px-4">
      <div className="text-center max-w-md mx-auto">
        <h1 className="mb-4 text-5xl font-bold text-white tracking-tight">404</h1>
        <p className="mb-2 text-xl font-medium text-white/90">Oops! Page not found</p>
        <p className="mb-6 text-sm text-white/60">
          The link you followed may be broken or the page may have been moved.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
          <Link
            to="/free-workshop"
            className="w-full sm:w-auto inline-block px-6 py-3 bg-[#F4C903] text-black font-semibold rounded-lg hover:bg-[#e0b802] transition-all text-center shadow-lg"
          >
            Watch Free Workshop
          </Link>
          <Link
            to="/pm-job-board-canada"
            className="w-full sm:w-auto inline-block px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all text-center"
          >
            Browse PM Job Board
          </Link>
        </div>

        <Link
          to="/"
          className="inline-block text-xs text-white/50 hover:text-white/80 transition-colors underline pt-2"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
