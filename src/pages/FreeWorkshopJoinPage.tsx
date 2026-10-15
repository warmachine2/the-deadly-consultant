import { Link } from "react-router-dom";
import TopNav from "@/components/TopNav";
import { Video, FileText, Briefcase, CalendarDays } from "lucide-react";

type WorkshopSession = {
  day: string;
  time: string;
  teamsLink: string;
  meetingId: string;
  passcode: string;
};

const SESSIONS: WorkshopSession[] = [
  {
    day: "Monday",
    time: "12:00 PM – 1:00 PM ET",
    teamsLink: "https://teams.microsoft.com/meet/23297711740458?p=ka6XOOotgw5vY9jE02",
    meetingId: "232 977 117 404 58",
    passcode: "3ag7PA3X",
  },
  {
    day: "Wednesday",
    time: "12:00 PM – 1:00 PM ET",
    teamsLink: "https://teams.microsoft.com/meet/241626391574864?p=1cTrYHqXVq7tcKC98K",
    meetingId: "241 626 391 574 864",
    passcode: "qT6Tm2HN",
  },
  {
    day: "Saturday",
    time: "11:00 AM – 12:00 PM ET",
    teamsLink: "https://teams.microsoft.com/meet/269620559856833?p=KhZ7uxx7J22Yo6ZrIh",
    meetingId: "269 620 559 856 833",
    passcode: "65XP2vs9",
  },
];

const FreeWorkshopJoinPage = () => {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="volumetric-glass rounded-2xl p-8 md:p-12 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "#FFE361" }}>
              Live Workshop: How to Land $10k–$18k/mo Data &amp; AI Orchestration PM Consulting
              Contracts
            </h1>
            <p className="text-white text-base md:text-lg mb-6">
              Live sessions run Mondays &amp; Wednesdays (12:00 PM &ndash; 1:00 PM ET) and Saturdays
              (11:00 AM &ndash; 12:00 PM ET) (Toronto / New York)
            </p>
            <p className="text-white/90 text-sm md:text-base">
              You can join directly in your web browser without downloading Teams, or open in the
              Microsoft Teams app. Please join 5 minutes early to test your audio.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {SESSIONS.map((session) => (
              <div
                key={session.day}
                className="volumetric-glass rounded-2xl p-6 text-center flex flex-col"
              >
                <div className="flex justify-center items-center gap-2 mb-1">
                  <CalendarDays className="w-5 h-5 text-[#FFE361]" />
                  <h2 className="text-xl font-bold" style={{ color: "#FFE361" }}>
                    {session.day}
                  </h2>
                </div>
                <p className="text-white text-sm mb-5">{session.time}</p>

                <a
                  href={session.teamsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="highlight-glow-button inline-flex items-center justify-center gap-2 w-full px-4 py-3 font-bold text-white text-sm md:text-base tracking-wide shadow-none mb-5"
                >
                  <Video className="w-5 h-5" />
                  Join {session.day} Meeting
                </a>

                <div className="mt-auto border-t border-white/10 pt-4">
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Meeting ID</p>
                  <p className="font-mono font-bold text-white text-sm whitespace-nowrap mb-3">
                    {session.meetingId}
                  </p>
                  <p className="text-white/70 text-xs uppercase tracking-wide mb-1">Passcode</p>
                  <p className="font-mono font-bold text-white text-sm whitespace-nowrap">
                    {session.passcode}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="volumetric-glass rounded-2xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-5" style={{ color: "#FFE361" }}>
              Quick Links
            </h2>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a
                href="https://www.zerotopmconsultant.com/V4_Roadmap_2026.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="gold-glow-border w-full px-5 py-3 font-bold text-white hover:text-[#F4C903] inline-flex items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  2026 Roadmap
                </button>
              </a>
              <Link to="/ai-bi-fintech-pm-job-alerts-repo">
                <button className="gold-glow-border w-full px-5 py-3 font-bold text-white hover:text-[#F4C903] inline-flex items-center justify-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Job Alerts
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FreeWorkshopJoinPage;
