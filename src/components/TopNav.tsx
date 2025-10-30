import { Search, Home, Settings, User, Menu } from "lucide-react";
import { useState } from "react";

interface TopNavProps {
  onSearchChange: (query: string) => void;
  onToggleSidebar: () => void;
}

const TopNav = ({ onSearchChange, onToggleSidebar }: TopNavProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearchChange(value);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="w-6 h-6 text-primary" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold text-primary">
            The Deadly Consultant
          </h1>
        </div>

        {/* Center Search - Desktop */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-primary/50"
            />
          </div>
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2">
          <button
            className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all"
            aria-label="Home"
          >
            <Home className="w-5 h-5 text-primary" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all"
            aria-label="Settings"
          >
            <Settings className="w-5 h-5 text-primary" />
          </button>
          <button
            className="p-2 rounded-lg hover:bg-white/20 hover-glow transition-all"
            aria-label="Profile"
          >
            <User className="w-5 h-5 text-primary" />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-4 pb-3">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 glass rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-primary/50"
          />
        </div>
      </div>
    </nav>
  );
};

export default TopNav;
