import { useEffect, useState } from "react";
import { Link } from "react-router";
import Navbar from "~/components/Navbar";
import ProtectedRoute from "~/components/ProtectedRoute";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Comentarios inteligentes para el trabajo de tus sueño!" },
  ];
}

export default function Home() {
  const { kv } = usePuterStore();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      const resumes = (await kv.list("resume:*", true)) as KVItem[];
      const parsedResumes = resumes?.map((resume) => {
        const parsedResume = JSON.parse(resume.value) as Resume;

        // Parse feedback if it's a string
        if (parsedResume.feedback && typeof parsedResume.feedback === "string") {
          try {
            parsedResume.feedback = JSON.parse(parsedResume.feedback);
          } catch (error) {
            console.error("Error parsing feedback:", error);
            // Set a default feedback structure if parsing fails
            parsedResume.feedback = {
              overallScore: 0,
              ATS: { score: 0, tips: [] },
              toneAndStyle: { score: 0, tips: [] },
              content: { score: 0, tips: [] },
              structure: { score: 0, tips: [] },
              skills: { score: 0, tips: [] },
            };
          }
        }

        return parsedResume;
      });
      setResumes(parsedResumes || []);
      setLoadingResumes(false);
    };

    loadResumes();
  }, []);

  return (
    <ProtectedRoute>
      <main className="bg-[url('/images/bg-main.svg')] bg-cover md:mx-2.5 md:mt-2.5">
        <Navbar />
        <section className="main-section">
          <div className="page-heading py-16">
            <h1>Track Your Applications & Resume Ratings</h1>
            {!loadingResumes && resumes?.length === 0 ? (
              <h2>No resumes found. Upload your first resume to get feedback.</h2>
            ) : (
              <h2>Review your submissions and check AI-powered feedback.</h2>
            )}
          </div>
          {loadingResumes && (
            <div className="flex flex-col items-center justify-center">
              <img src="/images/resume-scan-2.gif" className="w-[200px]" />
            </div>
          )}

          {!loadingResumes && resumes.length > 0 && (
            <div className="resumes-section">
              {resumes.map((resume) => (
                <ResumeCard key={resume.id} resume={resume} />
              ))}
            </div>
          )}

          {!loadingResumes && resumes?.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10 gap-4">
              <Link to="/upload" className="primary-button w-fit text-xl font-semibold">
                Upload Resume
              </Link>
            </div>
          )}
        </section>
      </main>
    </ProtectedRoute>
  );
}
