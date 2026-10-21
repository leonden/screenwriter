"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  loadStore,
  saveStore,
  createScript,
  updateScript,
  deleteScript,
  getActiveScript,
  type ScriptsStore,
} from "@/lib/storage";
import { parseFountain } from "@/lib/fountain";
import Toolbar from "./Toolbar";
import ScriptSidebar from "./ScriptSidebar";
import Editor from "./Editor";
import CheatSheet from "./CheatSheet";

export default function EditorShell() {
  const [store, setStore] = useState<ScriptsStore>(() => {
    if (typeof window === "undefined") {
      return { scripts: [], activeScriptId: null };
    }
    return loadStore();
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Persist to localStorage whenever store changes (debounced)
  useEffect(() => {
    if (store.scripts.length === 0) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setIsSaved(false);
    saveTimer.current = setTimeout(() => {
      saveStore(store);
      setIsSaved(true);
    }, 1000);
  }, [store]);

  const activeScript = getActiveScript(store);
  const content = activeScript?.content ?? "";

  const tokens = useMemo(() => parseFountain(content), [content]);

  const handleContentChange = useCallback((value: string) => {
    setStore((prev) => {
      if (!prev.activeScriptId) return prev;
      return updateScript(prev, prev.activeScriptId, { content: value });
    });
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setStore((prev) => {
      if (!prev.activeScriptId) return prev;
      return updateScript(prev, prev.activeScriptId, { name });
    });
  }, []);

  const handleNew = useCallback(() => {
    setStore((prev) => {
      const next = createScript(prev, "Untitled Script");
      saveStore(next);
      return next;
    });
    setSidebarOpen(true);
  }, []);

  const handleSelectScript = useCallback((id: string) => {
    setStore((prev) => ({ ...prev, activeScriptId: id }));
  }, []);

  const handleDeleteScript = useCallback((id: string) => {
    setStore((prev) => {
      const next = deleteScript(prev, id);
      saveStore(next);
      return next;
    });
  }, []);

  const handleCreateScript = useCallback((name: string) => {
    setStore((prev) => {
      const next = createScript(prev, name);
      saveStore(next);
      return next;
    });
  }, []);

  const handleExportPDF = useCallback(async () => {
    const { exportToPDF } = await import("@/lib/pdf");
    exportToPDF(tokens, activeScript?.name ?? "screenplay");
  }, [tokens, activeScript?.name]);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "n") {
        e.preventDefault();
        handleNew();
      }
      if (mod && e.shiftKey && e.key === "E") {
        e.preventDefault();
        handleExportPDF();
      }
      if (mod && e.key === "\\") {
        e.preventDefault();
        setSidebarOpen((v) => !v);
      }
      if (e.key === "?" && !e.metaKey && !e.ctrlKey && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        setHelpOpen((v) => !v);
      }
      if (e.key === "Escape") {
        setHelpOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleNew, handleExportPDF]);

  return (
    <div className="h-screen flex flex-col bg-neutral-900 text-neutral-100 overflow-hidden">
      {helpOpen && <CheatSheet onClose={() => setHelpOpen(false)} />}
      <Toolbar
        scriptName={activeScript?.name ?? ""}
        onNameChange={handleNameChange}
        onNew={handleNew}
        onExportPDF={handleExportPDF}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onHelp={() => setHelpOpen(true)}
        sidebarOpen={sidebarOpen}
        isSaved={isSaved}
      />
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <ScriptSidebar
            scripts={store.scripts}
            activeScriptId={store.activeScriptId}
            onSelect={handleSelectScript}
            onCreate={handleCreateScript}
            onDelete={handleDeleteScript}
          />
        )}
        <Editor
          content={content}
          tokens={tokens}
          onContentChange={handleContentChange}
        />
      </div>
    </div>
  );
}
