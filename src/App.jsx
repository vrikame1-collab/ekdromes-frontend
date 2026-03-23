
import { useState } from "react";
import { Search, Loader2, BookmarkCheck, Sparkles, Download } from "lucide-react";
import LeadCard from "./components/LeadCard";
import SavedLeadRow from "./components/SavedLeadRow";
import { useLeads } from "./hooks/useLeads";

const API_URL = import.meta.env.VITE_API_URL || "";
const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || "";

const MONTHS = [
  "Ιανουάριος","Φεβρουάριος","Μάρτιος","Απρίλιος",
  "Μάιος","Ιούνιος","Ιούλιος","Αύγουστος",
  "Σεπτέμβριος","Οκτώβριος","Νοέμβριος","Δεκέμβριος",
];

export default function App() {
  const [destination, setDestination] = useState(DEFAULT_CITY);
  const [month, setMonth] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchInfo, setSearchInfo] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("results");

  const { savedLeads, savedUrls, saveLead, updateStatus, updateNotes, deleteLead, exportCSV } = useLeads();

  async function doSearch() {
    if (!destination.trim()) return;
    setLoading(true);
    setSearched(true);
    setError(null);
    setResults([]);
    setActiveTab("results");
    try {
      const res = await fetch(`${API_URL}/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: destination.trim(), month: month || undefined }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setResults(data.leads || []);
      setSearchInfo({ total_searched: data.total_searched, queries: data.queries_used });
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  function isSaved(lead) {
    return savedUrls.has(`${lead.source_url}|${lead.name}`);
  }

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(150deg, #0f172a 0%, #1e3a5f 45%, #0f172a 100%)" }}>
      <div className="px-4 pt-10 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/70 text-xs px-3 py-1.5 rounded-full mb-4 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              Σχολικές Εκδρομές · ΔΔΕ · 2025-2026
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">
              Βρες σχολεία για εκδρομή
            </h1>
            <p className="text-blue-200/60 text-sm">
              Αναζήτηση αποκλειστικά σε ΔΔΕ — σχολικό έτος 2025-2026
            </p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-2xl">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Προορισμός</label>
            <div className="flex gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="π.χ. Κέρκυρα, Θεσσαλονίκη..."
                  className="w-full pl-9 pr-3 h-11 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-400 text-sm transition-colors"
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && doSearch()}
                />
              </div>
              <select
                value={month}
                onChange={e => setMonth(e.target.value)}
                className="h-11 w-40 border border-slate-200 rounded-xl bg-slate-50 text-sm px-3 focus:outline-none focus:border-blue-400"
              >
                <option value="">Όλοι οι μήνες</option>
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <button
                onClick={doSearch}
                disabled={loading || !destination.trim()}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 text-white font-semibold h-11 px-6 rounded-xl shadow-lg transition-all active:scale-95"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {loading ? "Ψάχνω..." : "Αναζήτηση"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 min-h-screen rounded-t-3xl px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 mb-5 bg-white border border-slate-200 rounded-xl p-1 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab("results")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "results" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <Search className="w-3.5 h-3.5" />
              Αποτελέσματα
              {results.length > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === "results" ? "bg-blue-500" : "bg-blue-100 text-blue-700"}`}>{results.length}</span>}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === "saved" ? "bg-blue-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              <BookmarkCheck className="w-3.5 h-3.5" />
              CRM
              {savedLeads.length > 0 && <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === "saved" ? "bg-blue-500" : "bg-slate-100 text-slate-600"}`}>{savedLeads.length}</span>}
            </button>
          </div>

          {activeTab === "results" && (
            <>
              {loading && (
                <div className="flex flex-col items-center justify-center py-24">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl mb-5">
                    <Loader2 className="w-8 h-8 animate-spin text-white" />
                  </div>
                  <p className="font-bold text-slate-700 text-xl">Ψάχνω σε ΔΔΕ...</p>
                  <p className="text-sm text-slate-400 mt-2">{destination} · 2025-2026</p>
                </div>
              )}
              {error && (
                <div className="text-center py-12 bg-red-50 rounded-xl border border-red-200">
                  <p className="font-semibold text-red-600">Σφάλμα αναζήτησης</p>
                  <p className="text-sm text-red-500 mt-1">{error}</p>
                </div>
              )}
              {!loading && searched && results.length === 0 && !error && (
                <div className="text-center py-16">
                  <p className="font-semibold text-slate-600">Δεν βρέθηκαν σχολεία για "{destination}"</p>
                  <p className="text-sm text-slate-400 mt-1">Δοκίμασε διαφορετικό προορισμό ή μήνα</p>
                </div>
              )}
              {!loading && !searched && (
                <div className="text-center py-24">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-5">
                    <Sparkles className="w-10 h-10 text-blue-400" />
                  </div>
                  <p className="text-xl font-bold text-slate-700">Έτοιμο για αναζήτηση!</p>
                  <p className="text-sm text-slate-400 mt-2 max-w-sm mx-auto">Βάλε προορισμό και η AI θα βρει σχολεία που ψάχνουν ταξιδιωτικό πρακτορείο</p>
                </div>
              )}
              {!loading && results.length > 0 && (
                <>
                  <div className="flex items-center gap-3 mb-5">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs text-slate-400 px-2 shrink-0">
                      <span className="font-semibold text-slate-700">{results.length} leads</span>
                      {searchInfo && ` από ${searchInfo.total_searched} αποτελέσματα`}
                    </span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((lead, i) => (
                      <LeadCard key={`${lead.name}-${i}`} lead={lead} onSave={saveLead} isSaved={isSaved(lead)} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}

          {activeTab === "saved" && (
            <>
              {savedLeads.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-semibold text-slate-600">Δεν έχεις αποθηκεύσει ακόμα leads</p>
                  <p className="text-sm text-slate-400 mt-1">Κάνε αναζήτηση και αποθήκευσε τα καλύτερα</p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-slate-500">{savedLeads.length} αποθηκευμένα leads</p>
                    <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs bg-white border border-slate-200 text-slate-600 hover:text-blue-600 hover:border-blue-300 px-3 py-2 rounded-xl transition-colors shadow-sm">
                      <Download className="w-3.5 h-3.5" />Εξαγωγή CSV
                    </button>
                  </div>
                  <div className="space-y-2">
                    {savedLeads.map(lead => (
                      <SavedLeadRow key={lead.id} lead={lead} onStatusChange={updateStatus} onNotesChange={updateNotes} onDelete={deleteLead} />
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
