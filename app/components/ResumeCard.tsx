import { useEffect, useState, type FC } from "react";
import { Link } from "react-router";
import ScoreCircle from "./ScoreCicle";
import { usePuterStore } from "~/lib/puter";

interface ResumeCardProps {
  resume: Resume;
}

const ResumeCard: FC<ResumeCardProps> = ({
  resume: { id, companyName, jobTitle, feedback, imagePath, resumePath },
}) => {
  const { fs } = usePuterStore();
  const [resumeUrl, setResumeUrl] = useState<string>("");

  useEffect(() => {
    const loadResume = async () => {
      const blob = await fs.read(imagePath);
      if (!blob) return;
      let url = URL.createObjectURL(blob);
      setResumeUrl(url);
    };

    loadResume();
  }, [imagePath]);

  return (
    <Link to={`/resume/${id}`} className="resume-card animate-in fade-in duration-1000">
      <div className="resume-card-header">
        <div className="flex flex-col gap-2">
          <h2 className="!text-black font-bold break-words">{companyName}</h2>
          <h3 className="text-lg break-words text-gray-500">{jobTitle}</h3>
        </div>
        <div className="flex-shrink-0">
          <ScoreCircle score={feedback?.overallScore ?? 0} />
        </div>
      </div>

      {resumeUrl && (
        <div className="gradient-border animate-in fade-in duration-1000">
          <div className="w-full h-full">
            <img
              src={resumeUrl}
              alt={`${companyName} logo`}
              className="w-full h-[350px] max-sm:h-[290px] object-cover object-top"
            />
          </div>
        </div>
      )}
    </Link>
  );
};

export default ResumeCard;
