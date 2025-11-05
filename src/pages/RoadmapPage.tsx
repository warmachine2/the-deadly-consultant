import { useState, useEffect } from "react";
import { fetchPostBySlug } from "@/lib/ghostApi"; // Your fetch function
import TopNav from "@/components/TopNav"; // Your nav
import EmailCaptureModal from "@/components/EmailCaptureModal"; // If you have one

const RoadmapPage = () => {
  const [pageContent, setPageContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      const content = await fetchPostBySlug("2026-bi-fintech-consulting-roadmap-pdf-unlock");
      setPageContent(content);
      setLoading(false);
    };
    loadPage();
  }, []);

  const handleEmailSubmit = (data) => {
    console.log("Email captured:", data); // Placeholder
    setModalOpen(false);
  };

  if (loading) return <div className="glass text-center p-8">Loading...</div>;
  if (!pageContent) return <div className="glass text-center p-8">Page not found</div>;

  // ADAPTED HTML: Dark-safe version of fetched content
  const adaptedContent = `
    <style>
      .dark-roadmap h1, h2, h3 { color: #E5E7EB; font-family: 'Play', sans-serif; font-weight: bold; margin-bottom: 1.5rem; }
      .dark-roadmap p { color: #E5E7EB; margin-bottom: 1rem; line-height: 1.6; }
      .dark-roadmap ul, ol { color: #9CA3AF; list-style-position: inside; margin-bottom: 1rem; }
      .dark-roadmap li { margin-bottom: 0.5rem; }
      .dark-roadmap a { color: #3B82F6; text-decoration: none; }
      .dark-roadmap a:hover { text-decoration: underline; }
      .dark-roadmap iframe { width: 100%; height: 315px; border-radius: 0.75rem; } /* Full-size video */
      .dark-roadmap img[width < 300] { display: none; } /* Hide small thumbnails */
      .dark-roadmap .cta-button { background: #EF4444; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; font-weight: bold; border: none; cursor: pointer; }
    </style>
    <div class="dark-roadmap">
      <h1>${pageContent.title || "Unlock Your $10k/mo Pivot"}</h1> <!-- Dynamic title, or fallback -->
      <p>Walkthrough: Your AI-proof pivot blueprint (above).</p>
      
      <h2>Your Step-by-Step AI-Proof Pivot</h2>
      <p>Stuck grinding $3k-$4k/mo despite engineering degrees, coding skills, or professional experience?</p>
      <p>AI's eating jobs. Pivot to BI-FinTech Project Management roles: $17k/mo+ after-tax, remote freedom, and more.</p>
      <p>Cracked blueprint: Mindset, Hybrid PM (Waterfall + Agile), Vendor Grade PowerBI/Excel Tools, Professional certifications (PMP, PSM, AZ305).</p>
      
      <h3>What's Inside?</h3>
      <ul>
        <li>Hybrid PM mastery: Waterfall, Agile, Product Management.</li>
        <li>Vendor-grade tools: PowerBI & Excel for competence.</li>
        <li>Cert trifecta: PMP, PSM, AZ305 – no solo guesswork.</li>
      </ul>
      
      <p>Grab free PDF: Sign up for The Deadly Consultant – instant email + weekly hacks.</p>
      
      <h4>P.S.</h4>
      <ol>
        <li>Learn How to use the bonus 3KS Tracker. Link, <a href="https://youtu.be/_qDk7KFPXE4?si=zS7bFJ_8gekzK1h9&ref=thedeadlyconsultant.com">here</a>.</li>
        <li>Link: <a href="https://www.skool.com/bi-fintech-consultant-academy/about?ref=roadmap">$10k/mo+: BI-FinTech Consultant Training Accelerator Program</a></li>
        <li>Link to my VSL: <a href="https://youtu.be/tcu0MFNJw94?ref=roadmap">https://youtu.be/tcu0MFNJw94</a></li>
      </ol>
      
      <p><em>Outwork the Chaos – Become the Higher Man</em></p>
      <p>Hassan Khan</p>
      
      <hr>
      
      <!-- YouTube Embed (Full-Size - No Small Thumbnails) -->
      <iframe width="560" height="315" src="https://www.youtube.com/embed/_qDk7KFPXE4?si=zS7bFJ_8gekzK1h9&ref=thedeadlyconsultant.com" title="Walkthrough Video" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="w-full rounded-lg mb-6"></iframe>
      
      <!-- Red CTA Button -->
      <button class="cta-button" onclick="document.getElementById('emailModal').style.display='block'">Get Your Free Roadmap PDF</button>
    </div>
  `;

  return (
    <div className="min-h-screen bg-gray-900">
      <TopNav onSearchChange={() => {}} onToggleSidebar={() => {}} />
      <main className="container mx-auto px-4 py-8 max-w-5xl mt-24">
        <section className="glass-strong rounded-3xl p-8 md:p-12 mb-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-xl font-bold text-white mb-4">Unlock Your $10k/mo Pivot</h1>
            <p className="text-lg text-gray-400 mb-6">Your complete guide to becoming a 10k/mo+ consultant</p>
          </div>
        </section>

        <section className="glass rounded-3xl p-8 md:p-12 mb-8">
          <div dangerouslySetInnerHTML={{ __html: adaptedContent }} />
        </section>

        <section className="glass-strong rounded-3xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Ready to Get Started?</h2>
          <p className="text-gray-400 mb-6 max-w-2xl mx-auto">Download your free roadmap PDF and start your journey to becoming a successful BI-FinTech consultant.</p>
          <button className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg">
            Get Your Free Roadmap PDF
          </button>
        </section>
      </main>
    </div>
  );
};

export default RoadmapPage;