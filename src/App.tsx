import { useState } from "react";
import { useStoryStore } from "./store";
import StorySidebar from "./components/StorySidebar";
import ChapterEditor from "./components/ChapterEditor";
import "./App.css";

function App() {
  const [newStoryTitle, setNewStoryTitle] = useState("");
  const addStory = useStoryStore((state) => state.addStory);

  const handleAddStory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newStoryTitle.trim()) {
      addStory(newStoryTitle.trim());
      setNewStoryTitle("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-secondary p-4 flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Story Maker</h1>

        <form onSubmit={handleAddStory} className="mb-4">
          <input
            type="text"
            value={newStoryTitle}
            onChange={(e) => setNewStoryTitle(e.target.value)}
            placeholder="New story title..."
            className="input w-full mb-2"
          />
          <button type="submit" className="btn btn-primary w-full">
            Add Story
          </button>
        </form>

        <StorySidebar />
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 p-4">
        <ChapterEditor />
      </div>
    </div>
  );
}

export default App;
