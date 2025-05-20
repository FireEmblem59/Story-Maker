import { useState } from "react";
import { useStoryStore } from "../store";

export default function StorySidebar() {
  const [newChapterTitle, setNewChapterTitle] = useState("");
  const stories = useStoryStore((state) => state.stories);
  const currentStoryId = useStoryStore((state) => state.currentStoryId);
  const currentChapterId = useStoryStore((state) => state.currentChapterId);
  const addChapter = useStoryStore((state) => state.addChapter);
  const setCurrentStory = useStoryStore((state) => state.setCurrentStory);
  const setCurrentChapter = useStoryStore((state) => state.setCurrentChapter);
  const deleteStory = useStoryStore((state) => state.deleteStory);
  const deleteChapter = useStoryStore((state) => state.deleteChapter);

  const handleAddChapter = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStoryId && newChapterTitle.trim()) {
      addChapter(currentStoryId, newChapterTitle.trim());
      setNewChapterTitle("");
    }
  };

  const handleDeleteStory = (storyId: string) => {
    if (window.confirm("Are you sure you want to delete this story?")) {
      deleteStory(storyId);
    }
  };

  const handleDeleteChapter = (storyId: string, chapterId: string) => {
    if (window.confirm("Are you sure you want to delete this chapter?")) {
      deleteChapter(storyId, chapterId);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {stories.map((story) => (
        <div key={story.id} className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3
              className={`text-lg font-semibold cursor-pointer ${
                currentStoryId === story.id ? "text-accent" : ""
              }`}
              onClick={() => setCurrentStory(story.id)}
            >
              {story.title}
            </h3>
            <button
              onClick={() => handleDeleteStory(story.id)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
          {currentStoryId === story.id && (
            <>
              <div className="pl-4">
                {story.chapters.map((chapter) => (
                  <div
                    key={chapter.id}
                    className="flex items-center justify-between mb-1"
                  >
                    <div
                      className={`cursor-pointer ${
                        currentChapterId === chapter.id ? "text-accent" : ""
                      }`}
                      onClick={() => setCurrentChapter(chapter.id)}
                    >
                      {chapter.title}
                    </div>
                    <button
                      onClick={() => handleDeleteChapter(story.id, chapter.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <form onSubmit={handleAddChapter} className="mt-2">
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  placeholder="New chapter title..."
                  className="input w-full mb-2"
                />
                <button type="submit" className="btn btn-secondary w-full">
                  Add Chapter
                </button>
              </form>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
