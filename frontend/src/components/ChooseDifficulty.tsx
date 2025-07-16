interface DifficultySelectorProps {
  selectedDifficulty: "easy" | "medium" | "hard";
  setSelectedDifficulty: (value: "easy" | "medium" | "hard") => void;
}

export default function DifficultySelector({
  selectedDifficulty,
  setSelectedDifficulty,
}: DifficultySelectorProps) {
  const options = [
    {
      value: "easy",
      label: "Easy",
      description: "Beginner-level questions to warm up",
    },
    {
      value: "medium",
      label: "Medium",
      description: "Balanced questions for standard interviews",
    },
    {
      value: "hard",
      label: "Hard",
      description: "Challenging questions for expert prep",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-blue-50 p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-1">Choose Difficulty</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Select how challenging you want your practice session to be
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setSelectedDifficulty(opt.value as any)}
            className={`w-full rounded-lg border px-4 py-3 text-left transition-colors ${
              selectedDifficulty === opt.value
                ? "border-blue-600 bg-white"
                : "border-gray-200 bg-gray-100"
            }`}
          >
            <div className="flex items-center space-x-2">
              <div>
                <p className="font-medium">{opt.label}</p>
                <p className="text-sm text-gray-500">{opt.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
