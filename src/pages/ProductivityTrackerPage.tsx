import { useState, useEffect } from "react";
import TopNav from "@/components/TopNav";
import { fetchPostBySlug, GhostPost } from "@/lib/ghostApi";
import { Skeleton } from "@/components/ui/skeleton";
import { rebrandHtml } from "@/lib/rebrandHtml";

const ProductivityTrackerPage = () => {
  const [post, setPost] = useState<GhostPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      setLoading(true);
      const data = await fetchPostBySlug("3ks-tracker");
      setPost(data);
      setLoading(false);
    };
    loadPost();
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <TopNav />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl mt-20 lg:mt-24">
        {/* YouTube Video Embed */}
        <section className="volumetric-glass rounded-3xl p-6 mb-8">
          <div className="relative w-full pb-[56.25%]">
            <iframe
              className="absolute top-0 left-0 w-full h-full rounded-2xl"
              src="https://www.youtube.com/embed/_qDk7KFPXE4"
              title="3KS Productivity Tracker"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        </section>

        {/* Post Content */}
        <section className="volumetric-glass rounded-3xl p-8 md:p-12">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4 mx-auto" />
              <Skeleton className="h-6 w-1/2 mx-auto" />
              <Skeleton className="h-40 w-full" />
            </div>
          ) : post ? (
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-5xl font-bold text-[#F4C903] mb-6 text-center">
                {post.title}
              </h1>
              {post.html && (
                <div 
                  className="prose prose-invert prose-lg max-w-none
                    [&_h1]:text-[#F4C903] [&_h2]:text-[#F4C903] [&_h3]:text-[#F4C903] [&_h4]:text-[#F4C903] [&_h5]:text-[#F4C903] [&_h6]:text-[#F4C903]
                    [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h4]:font-bold
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-a:text-[#F4C903] prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-foreground
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:marker:text-[#F4C903]
                    prose-img:rounded-xl prose-img:mx-auto"
                  dangerouslySetInnerHTML={{ __html: rebrandHtml(post.html) }}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>Content not available. Please try again later.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ProductivityTrackerPage;
