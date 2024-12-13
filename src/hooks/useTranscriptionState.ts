import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TodoItem } from '../types/todo';
import { Tab } from '../types/transcription';

interface TranscriptionState {
  transcript: string;
  summary: string;
  todoItems: TodoItem[];
  minutes: string;
  activeTab: Tab;
  setTranscript: (transcript: string) => void;
  setSummary: (summary: string) => void;
  setTodoItems: (items: TodoItem[]) => void;
  setMinutes: (minutes: string) => void;
  setActiveTab: (tab: Tab) => void;
  updateTodoItem: (id: string, updates: Partial<TodoItem>) => void;
  clearAll: () => void;
}

const initialState = {
  transcript: '',
  summary: '',
  todoItems: [],
  minutes: '',
  activeTab: 'transcript' as Tab,
};

export const useTranscriptionState = create<TranscriptionState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setTranscript: (transcript) => set({ 
        transcript,
        activeTab: 'transcript' // 新しい文字起こし時はtranscriptタブを表示
      }),
      
      setSummary: (summary) => set({ summary }),
      setTodoItems: (todoItems) => set({ todoItems }),
      setMinutes: (minutes) => set({ minutes }),
      setActiveTab: (activeTab) => set({ activeTab }),
      
      updateTodoItem: (id, updates) => 
        set((state) => ({
          todoItems: state.todoItems.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
        
      clearAll: () => set(initialState),
    }),
    {
      name: 'transcription-storage',
      version: 1,
      partialize: (state) => ({
        transcript: state.transcript,
        summary: state.summary,
        todoItems: state.todoItems,
        minutes: state.minutes,
        activeTab: state.activeTab
      })
    }
  )
);