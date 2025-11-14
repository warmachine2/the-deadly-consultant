// ... imports and state unchanged ...

return (
  <div className="min-h-screen">
    <TopNav onSearchChange={setSearchQuery} onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

    {/* UPDATED: Reduced top padding - pt-16 md:pt-20 for tiles closer to nav/Hero */}
    <div className="pt-16 md:pt-20 px-2 sm:px-4 md:px-6 pb-8 md:pb-12">
      <HeroSection />

      <div className="relative">
        <Sidebar /* ... props unchanged */ />

        <main className="flex-1 min-w-0">
          {/* ... loading unchanged ... */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-6">
            {" "}
            {/* UPDATED: gap-2 sm:gap-3 - denser mobile stack */}
            <div className="w-full max-w-sm mx-auto h-auto">
              <RoadmapCard />
            </div>
            {filteredPosts.map((post) => (
              <div key={post.id} className="w-full max-w-sm mx-auto h-auto">
                <BlogCard post={post} onClick={() => handlePostClick(post)} />
              </div>
            ))}
          </div>
          {/* ... rest unchanged ... */}
        </main>
      </div>
    </div>

    {/* ... Modal & Footer unchanged ... */}
  </div>
);
