import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";

interface AnalizeProps {
  companyName: string;
  jobTitle: string;
  jobDescription: string;
  file: File | null;
}

const upload = () => {
  const { auth, isLoading, fs, ai, kv } = usePuterStore();

  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalize = async ({ companyName, jobTitle, jobDescription, file }: AnalizeProps) => {
    setIsProcessing(true);
    setStatusText("Uploading the file...");
    const uploadedFile = await fs.upload([file as File]);

    if (!uploadedFile) return setStatusText("File upload failed. Please try again.");
    setStatusText("Converting to image...");
    const image = await convertPdfToImage(file as File);
  };

  const handlerSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalize({ companyName, jobTitle, jobDescription, file });
  };

  if (file) return;

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover md:mx-2.5 md:mt-2.5">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16 px-2">
          <h1>Smart feeback for your dream job</h1>
          {isProcessing ? (
            <>
              <h2>{statusText}</h2>
              <img src="/images/resume-scan.gif" alt="Imagen Carga" className="w-full" />
            </>
          ) : (
            <h2>Drop your resume for an ATS score and improvement tips</h2>
          )}

          {!isProcessing && (
            <form action="upload-form" className="flex flex-col gap-4 mt-8">
              <div className="form-div">
                <label htmlFor="company-name">Company Name</label>
                <input
                  type="text"
                  name="company-name"
                  placeholder="Company Name"
                  id="company-name"
                />
              </div>
              <div className="form-div">
                <label htmlFor="job-title">Job Title</label>
                <input type="text" name="job-title" placeholder="Job Title" id="job-title" />
              </div>
              <div className="form-div">
                <label htmlFor="job-description">Job Description</label>
                <textarea
                  name="job-description"
                  id="job-description"
                  rows={5}
                  placeholder="Job Description"
                />
              </div>
              <div className="form-div">
                <label htmlFor="uploader">Upload Resume</label>
                <FileUploader onFileSelect={handleFileSelect} />
              </div>

              <button className="primary-button" type="button">
                Analize Resume
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};

export default upload;
