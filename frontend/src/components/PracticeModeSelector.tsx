type PracticeMode = "mcq" | "qa";

interface Props {
  practiceMode: PracticeMode;
  setPracticeMode: (mode: PracticeMode) => void;
}

const PracticeModeSelector = ({ practiceMode, setPracticeMode }: Props) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-4 mt-4">
      <h2 className="text-sm font-medium text-gray-900 mb-1">
        Choose Practice Mode
      </h2>
      <p className="text-sm text-gray-500 mb-3">
        Select how you'd like to practice your interview
      </p>
      <div className="flex space-x-4">
        {["mcq", "qa"].map((mode) => (
          <label
            key={mode}
            className={`flex-1 border rounded-lg p-4 cursor-pointer transition ${
              practiceMode === mode
                ? "border-blue-600 bg-white"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <input
              type="radio"
              name="practiceMode"
              value={mode}
              checked={practiceMode === mode}
              onChange={() => setPracticeMode(mode as PracticeMode)}
              className="sr-only"
            />
            <div className="font-medium text-sm mb-1">
              {mode === "mcq" ? "MCQ Mode" : "Q&A Mode"}
            </div>
            <div className="text-xs text-gray-500">
              {mode === "mcq"
                ? "Multiple choice questions for quick practice"
                : "Open-ended questions with text responses"}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default PracticeModeSelector;
