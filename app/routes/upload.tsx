import { prepareInstructions } from "../../constants";
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import ProtectedRoute from "~/components/ProtectedRoute";
import { convertPdfToImage } from "~/lib/pdf2img";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";

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

    if (!file) return setStatusText("Please select a file to upload.");
    if (file.type !== "application/pdf") {
      return setStatusText("Only PDF files are allowed.");
    }

    const uploadedFile = await fs.upload([file as File]);

    if (!uploadedFile) return setStatusText("File upload failed. Please try again.");
    setStatusText("Converting to image...");
    const imageFile = await convertPdfToImage(file as File);
    if (!imageFile.file) return setStatusText("Failed to convert PDF to image. Please try again.");

    setStatusText("Uploading the image...");
    const uploadedImage = await fs.upload([imageFile.file]);
    if (!uploadedImage) return setStatusText("Image upload failed. Please try again.");

    setStatusText("Preparing data...");
    const uuid = generateUUID();
    const data = {
      id: uuid,
      resumePath: uploadedFile.path,
      imagePath: uploadedImage.path,
      companyName,
      jobTitle,
      jobDescription,
      feedback: "",
    };

    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analyzing resume...");
    const feedback = await ai.feedback(
      uploadedFile.path,
      prepareInstructions({
        jobTitle,
        jobDescription,
      })
    );
    if (!feedback) return setStatusText("Failed to analyze resume. Please try again.");

    const feedbackText =
      feedback.message.content === "string"
        ? feedback.message.content
        : feedback.message.content[0].text;

    data.feedback = feedbackText;
    await kv.set(`resume:${uuid}`, JSON.stringify(data));
    setStatusText("Analysis complete. Redirecting...");
    console.log("Resume data:", data);
    navigate(`/resume/${uuid}`, { replace: true });
    setIsProcessing(false);
  };

  const handlerSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!file) {
      setStatusText("Please select a file to upload.");
      return;
    }

    const form = e.currentTarget.closest("form");
    if (!form) return;
    const formData = new FormData(form);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalize({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <ProtectedRoute>
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

                <button className="primary-button" type="button" onClick={handlerSubmit}>
                  Analize Resume
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
    </ProtectedRoute>
  );
};

export default upload;
