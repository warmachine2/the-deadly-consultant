import { Search, Home, Settings, User, Menu } from "lucide-react";
import { useState } from "react";

interface TopNavProps {
  onMenuClick: () => void;
}

const TopNav = ({ onMenuClick }: TopNavProps) => {

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">
            The Deadly Consultant
          </h1>
        </div>


        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all"
            aria-label="Home"
          >
            <Home className="w-5 h-5 text-accent" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-accent" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-accent" />
          </button>
        </div>
      </div>

    </nav>
  );
};

export default TopNav;
