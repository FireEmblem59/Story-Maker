import { useState } from "react";
import { useStoryStore } from "../store";
import { aiService } from "../services/ai";

interface AdvancedChapterDetails {
  setting: string;
  mainCharacters: string;
  plotPoints: string;
  characterDevelopment: string;
  emotionalBeats: string;
  sensoryDetails: string;
  dialogue: string;
  foreshadowing: string;
}

export default function ChapterEditor() {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdvancedForm, setShowAdvancedForm] = useState(false);
  const [language, setLanguage] = useState("English");
  const [showTitlePrompt, setShowTitlePrompt] = useState(false);
  const [suggestedTitle, setSuggestedTitle] = useState("");
  const [advancedDetails, setAdvancedDetails] =
    useState<AdvancedChapterDetails>({
      setting: "",
      mainCharacters: "",
      plotPoints: "",
      characterDevelopment: "",
      emotionalBeats: "",
      sensoryDetails: "",
      dialogue: "",
      foreshadowing: "",
    });

  const stories = useStoryStore((state) => state.stories);
  const currentStoryId = useStoryStore((state) => state.currentStoryId);
  const currentChapterId = useStoryStore((state) => state.currentChapterId);
  const updateChapter = useStoryStore((state) => state.updateChapter);

  const currentStory = stories.find((s) => s.id === currentStoryId);
  const currentChapter = currentStory?.chapters.find(
    (c) => c.id === currentChapterId
  );

  if (!currentStory || !currentChapter) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        Select a story and chapter to start writing
      </div>
    );
  }

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentStoryId && currentChapterId) {
      updateChapter(currentStoryId, currentChapterId, e.target.value);
    }
  };

  const handleAIAction = async (action: keyof typeof aiService) => {
    if (!currentChapter.content) return;
    setIsLoading(true);

    try {
      if (action === "generateAdvancedChapter") {
        const { content } = await aiService[action](
          currentChapter.content,
          language
        );
        if (currentStoryId && currentChapterId) {
          updateChapter(currentStoryId, currentChapterId, content);
        }
      } else {
        const result = await aiService[action](currentChapter.content);
        if (currentStoryId && currentChapterId) {
          updateChapter(currentStoryId, currentChapterId, result);
        }
      }
    } catch (error) {
      console.error(`Error in ${action}:`, error);
      alert(
        `Error: ${error instanceof Error ? error.message : "An error occurred"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateChapter = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const result = await aiService.generateChapter(prompt);
      if (currentStoryId && currentChapterId) {
        updateChapter(currentStoryId, currentChapterId, result);
      }
      setPrompt("");
    } catch (error) {
      console.error("Error generating chapter:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "An error occurred"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdvancedDetailChange = (
    field: keyof AdvancedChapterDetails,
    value: string
  ) => {
    setAdvancedDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenerateAdvancedChapter = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);

    try {
      const detailsPrompt = `
Setting and Atmosphere: ${advancedDetails.setting}
Main Characters: ${advancedDetails.mainCharacters}
Key Plot Points: ${advancedDetails.plotPoints}
Character Development: ${advancedDetails.characterDevelopment}
Emotional Beats: ${advancedDetails.emotionalBeats}
Sensory Details: ${advancedDetails.sensoryDetails}
Dialogue: ${advancedDetails.dialogue}
Foreshadowing: ${advancedDetails.foreshadowing}

Main Prompt: ${prompt}`;

      const { title, content } = await aiService.generateAdvancedChapter(
        detailsPrompt,
        language
      );
      setSuggestedTitle(title);
      setShowTitlePrompt(true);

      if (currentStoryId && currentChapterId) {
        updateChapter(currentStoryId, currentChapterId, content);
      }
      setPrompt("");
      setShowAdvancedForm(false);
    } catch (error) {
      console.error("Error generating advanced chapter:", error);
      alert(
        `Error: ${error instanceof Error ? error.message : "An error occurred"}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleAccept = () => {
    if (currentStoryId && currentChapterId) {
      updateChapter(
        currentStoryId,
        currentChapterId,
        currentChapter.content,
        suggestedTitle
      );
    }
    setShowTitlePrompt(false);
  };

  const handleTitleReject = () => {
    setShowTitlePrompt(false);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">{currentChapter.title}</h2>
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleAIAction("clarify")}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Clarify"}
          </button>
          <button
            onClick={() => handleAIAction("enrich")}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Enrich"}
          </button>
          <button
            onClick={() => handleAIAction("polish")}
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Polish"}
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt for chapter generation..."
            className="input flex-1"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateChapter}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate"}
          </button>
          <button
            onClick={() => setShowAdvancedForm(!showAdvancedForm)}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {showAdvancedForm ? "Hide Advanced" : "Advanced"}
          </button>
        </div>

        {showAdvancedForm && (
          <div className="mt-4 p-4 bg-secondary rounded-md">
            <div className="mb-4">
              <label className="block mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="input w-full"
              >
                <option value="English">English</option>
                <option value="French">French</option>
                <option value="Spanish">Spanish</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
              </select>
            </div>
            <h3 className="text-lg font-semibold mb-4">
              Advanced Chapter Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2">Setting and Atmosphere</label>
                <textarea
                  value={advancedDetails.setting}
                  onChange={(e) =>
                    handleAdvancedDetailChange("setting", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="Describe the setting and atmosphere..."
                />
              </div>
              <div>
                <label className="block mb-2">Main Characters</label>
                <textarea
                  value={advancedDetails.mainCharacters}
                  onChange={(e) =>
                    handleAdvancedDetailChange("mainCharacters", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="List and describe the main characters..."
                />
              </div>
              <div>
                <label className="block mb-2">Key Plot Points</label>
                <textarea
                  value={advancedDetails.plotPoints}
                  onChange={(e) =>
                    handleAdvancedDetailChange("plotPoints", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="Outline the key plot points..."
                />
              </div>
              <div>
                <label className="block mb-2">Character Development</label>
                <textarea
                  value={advancedDetails.characterDevelopment}
                  onChange={(e) =>
                    handleAdvancedDetailChange(
                      "characterDevelopment",
                      e.target.value
                    )
                  }
                  className="input w-full h-20"
                  placeholder="Describe character development..."
                />
              </div>
              <div>
                <label className="block mb-2">Emotional Beats</label>
                <textarea
                  value={advancedDetails.emotionalBeats}
                  onChange={(e) =>
                    handleAdvancedDetailChange("emotionalBeats", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="Outline emotional beats..."
                />
              </div>
              <div>
                <label className="block mb-2">Sensory Details</label>
                <textarea
                  value={advancedDetails.sensoryDetails}
                  onChange={(e) =>
                    handleAdvancedDetailChange("sensoryDetails", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="Describe sensory details..."
                />
              </div>
              <div>
                <label className="block mb-2">Dialogue</label>
                <textarea
                  value={advancedDetails.dialogue}
                  onChange={(e) =>
                    handleAdvancedDetailChange("dialogue", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="Include key dialogue..."
                />
              </div>
              <div>
                <label className="block mb-2">Foreshadowing</label>
                <textarea
                  value={advancedDetails.foreshadowing}
                  onChange={(e) =>
                    handleAdvancedDetailChange("foreshadowing", e.target.value)
                  }
                  className="input w-full h-20"
                  placeholder="Add foreshadowing elements..."
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleGenerateAdvancedChapter}
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Generating..." : "Generate Advanced Chapter"}
              </button>
            </div>
          </div>
        )}

        {showTitlePrompt && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-secondary p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                Suggested Chapter Title
              </h3>
              <p className="mb-4">
                The AI suggests the following title for your chapter:
              </p>
              <p className="text-xl font-bold mb-4">{suggestedTitle}</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleTitleReject}
                  className="btn btn-secondary"
                >
                  Keep Current Title
                </button>
                <button onClick={handleTitleAccept} className="btn btn-primary">
                  Use This Title
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <textarea
        value={currentChapter.content}
        onChange={handleContentChange}
        className="flex-1 p-4 bg-secondary rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-accent"
        placeholder="Start writing your chapter..."
        disabled={isLoading}
      />
    </div>
  );
}
