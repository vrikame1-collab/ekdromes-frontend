import { useState, useEffect } from "react";

const STORAGE_KEY = "ekdromes_saved_leads";

export function useLeads() {
  const [savedLeads, setSavedLeads] = useState([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setSavedLeads(JSON.parse(stored));
    } catch (e) { console.warn("Storage read error", e); }
  }, []);

  function persist(leads) {
    setSavedLeads(leads);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }

  function saveLead(lead) {
    const exists = savedLeads.find(l => l.source_url === lead.source_url && l.name === lead.name);
    if (exists) return;
    const newLead = {
      ...lead,
      id: `${Date.now()}_${Math.random().toString(36).slice(2)}`,
      status: "νέο",
      saved_date: new Date().toISOString(),
    };
    persist([newLead, ...savedLeads]);
  }

  function updateStatus(id, status) {
    persist(savedLeads.map(l => l.id === id ? { ...l, status } : l));
  }

  function updateNotes(id, notes) {
    persist(savedLeads.map(l => l.id === id ? { ...l, notes } : l));
  }

  function deleteLead(id) {
    persist(savedLeads.filter(l => l.id !== id));
  }

  function exportCSV() {
    const headers = ["Όνομα", "Τύπος", "Προορισμός", "Ημερομηνία", "Άτομα", "Τηλέφωνο", "Email", "Πόλη", "Status", "URL"];
    const rows = savedLeads.map(l => [
      l.name, l.type, l.destination, l.trip_date || "", l.group_size || "",
      l.phone || "", l.email || "", l.address || "", l.status, l.source_url || ""
    ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `ekdromes_crm_${new Date().toISOString().slice(0,10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  }

  const savedUrls = new Set(savedLeads.map(l => l.source_url + "|" + l.name).filter(Boolean));

  return { savedLeads, savedUrls, saveLead, updateStatus, updateNotes, deleteLead, exportCSV };
}
