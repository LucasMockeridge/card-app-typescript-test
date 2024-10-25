import axios from "axios";
import { FC, ReactNode, createContext, useEffect, useState } from "react";
import { DarkModeContextType, Entry, EntryContextType } from "../@types/context";

export const EntryContext = createContext<EntryContextType | null>(null);

export const EntryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<Entry[]>([]);

  const initState = async () => {
    const data = await axios.get<Entry[]>("http://localhost:3001/get/");
    const initialStateBody = data.data;
    setEntries(initialStateBody);
  };

  useEffect(() => {
    initState();
  }, []);

  const saveEntry = async (entry: Entry) => {
    const requestData = await axios.post<Entry>("http://localhost:3001/create/", entry);
    const newEntry = requestData.data;
    setEntries([...entries, newEntry]);
  };

  const updateEntry = async (id: string, entry: Entry) => {
    await axios.put<Entry>(`http://localhost:3001/update/${id}`, entry);
    setEntries((entries) => {
      const entryIndex = entries.findIndex((obj) => obj.id == id);
      entries[entryIndex] = entry;
      console.log(entries);
      return entries;
    });
  };
  const deleteEntry = async (id: string) => {
    await axios.delete<Entry>(`http://localhost:3001/delete/${id}`);
    setEntries((e) => e.filter((entry) => entry.id != id));
  };
  return (
    <EntryContext.Provider value={{ entries, saveEntry, updateEntry, deleteEntry }}>{children}</EntryContext.Provider>
  );
};

export const DarkModeContext = createContext<DarkModeContextType | null>(null);

export const DarkModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isDark = localStorage.getItem("isDark") === "true" ? true : false;
  if (isDark) {
    document.body.classList.add("darkMode");
  }

  const [isDarkMode, setIsDarkMode] = useState<boolean>(isDark);

  const toggleDarkMode = () => {
    if (!isDarkMode) {
      document.body.classList.add("darkMode");
      localStorage.setItem("isDark", "true");
    } else {
      document.body.classList.remove("darkMode");
      localStorage.setItem("isDark", "false");
    }
    setIsDarkMode(!isDarkMode);
  };

  return <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</DarkModeContext.Provider>;
};
