import React, { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resume" },
  { name: "description", content: "View your resume details" },
];

const resume = () => {
  const { id } = useParams();
  const { auth, isLoading, fs, kv } = usePuterStore();

  const [imageUrl, setImageUrl] = React.useState<string>("");
  const [resumeUrl, setResumeUrl] = React.useState<string>("");
  const [feedback, setFeedback] = React.useState<Feedback | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) navigate(`/auth?next=/resume/${id}`);
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResume = async () => {
      const resume = await kv.get(`resume:${id}`);

      if (!resume) {
        console.error("Resume not found");
        return;
      }
      const data = JSON.parse(resume);

      // transformar
      const resumeBlob = await fs.read(data.resumePath);
      if (!resumeBlob) {
        console.error("Resume file not found");
        return;
      }

      // pdfBlob
      const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
      const resumeUrl = URL.createObjectURL(pdfBlob);
      setResumeUrl(resumeUrl);

      // imageBlob
      const imageBlob = await fs.read(data.imagePath);
      if (!imageBlob) {
        console.error("Image file not found");
        return;
      }
      const imageUrl = URL.createObjectURL(new Blob([imageBlob], { type: "image/png" }));
      setImageUrl(imageUrl);

      setFeedback(data.feedback || "");
      console.log({ resumeUrl, imageUrl, feedback });
    };

    if (id) {
      loadResume();
    } else {
      console.error("No resume ID provided");
      navigate("/");
    }
  }, [id]);

  return (
    <main className="!pt-0">
      <nav className="resume-nav">
        <Link to={"/"} className="back-button">
          <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">Back to Homepage</span>
        </Link>
      </nav>
      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        <section className="feedback-section bg-[url('/images/bg-small.svg')] bg-cover h-[100vh] sticky top-0 items-center justify-center">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-xl:h-fit w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  alt="Imagen del Cv"
                  className="w-full h-full object-contain rounded-2xl"
                  title="resume-image"
                />
              </a>
            </div>
          )}
        </section>
        <section className="feedback-section">
          <h2 className="text-4xl !text-black font-bold">Resume Review</h2>
          {feedback ? (
            <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
              <Summary feedback={feedback} />
              <ATS score={feedback.ATS.score || 0} suggestions={feedback.ATS.tips || []} />
              <Details feedback={feedback} />
            </div>
          ) : (
            <img src="/images/resume-scan-2.gif" alt="scan resume" className="w-full" />
          )}
        </section>
      </div>
    </main>
  );
};

export default resume;
