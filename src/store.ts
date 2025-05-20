import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Chapter {
  id: string;
  title: string;
  content: string;
}

export interface Story {
  id: string;
  title: string;
  chapters: Chapter[];
}

interface StoryState {
  stories: Story[];
  currentStoryId: string | null;
  currentChapterId: string | null;
  addStory: (title: string) => void;
  addChapter: (storyId: string, title: string) => void;
  updateChapter: (
    storyId: string,
    chapterId: string,
    content: string,
    title?: string
  ) => void;
  setCurrentStory: (storyId: string | null) => void;
  setCurrentChapter: (chapterId: string | null) => void;
  deleteStory: (storyId: string) => void;
  deleteChapter: (storyId: string, chapterId: string) => void;
}

export const useStoryStore = create<StoryState>()(
  persist(
    (set) => ({
      stories: [],
      currentStoryId: null,
      currentChapterId: null,

      addStory: (title) =>
        set((state) => ({
          stories: [
            ...state.stories,
            {
              id: crypto.randomUUID(),
              title,
              chapters: [],
            },
          ],
        })),

      addChapter: (storyId, title) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? {
                  ...story,
                  chapters: [
                    ...story.chapters,
                    {
                      id: crypto.randomUUID(),
                      title,
                      content: "",
                    },
                  ],
                }
              : story
          ),
        })),

      updateChapter: (storyId, chapterId, content, title) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? {
                  ...story,
                  chapters: story.chapters.map((chapter) =>
                    chapter.id === chapterId
                      ? {
                          ...chapter,
                          content,
                          ...(title && { title }),
                        }
                      : chapter
                  ),
                }
              : story
          ),
        })),

      setCurrentStory: (storyId) =>
        set({
          currentStoryId: storyId,
          currentChapterId: null,
        }),

      setCurrentChapter: (chapterId) =>
        set({
          currentChapterId: chapterId,
        }),

      deleteStory: (storyId) =>
        set((state) => ({
          stories: state.stories.filter((story) => story.id !== storyId),
          currentStoryId:
            state.currentStoryId === storyId ? null : state.currentStoryId,
          currentChapterId:
            state.currentStoryId === storyId ? null : state.currentChapterId,
        })),

      deleteChapter: (storyId, chapterId) =>
        set((state) => ({
          stories: state.stories.map((story) =>
            story.id === storyId
              ? {
                  ...story,
                  chapters: story.chapters.filter(
                    (chapter) => chapter.id !== chapterId
                  ),
                }
              : story
          ),
          currentChapterId:
            state.currentChapterId === chapterId
              ? null
              : state.currentChapterId,
        })),
    }),
    {
      name: "story-maker-storage",
    }
  )
);
