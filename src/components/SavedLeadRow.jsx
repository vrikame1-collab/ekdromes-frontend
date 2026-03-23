import { useState } from "react";
import { MapPin, Users, Calendar, Phone, Mail, ExternalLink, Trash2, ChevronDown, StickyNote } from "lucide-react";

const STATUS_OPTIONS = ["νέο", "επικοινώνησα", "προσφορά_εστάλη", "κλειστό"];
const STATUS_STYLES = {
  "νέο": "bg-blue-50 text-blue-700 border-blue-200",
  "επικοινώνησα": "bg-yellow-50 text-yellow-700 border-yellow-200",
  "προσφορά_εστάλη": "bg-purple-50 text-purple-700 border-purple-200",
  "κλειστό": "bg-green-50 text-green-700 border-green-200",
};

export default function SavedLeadRow({ lead, onStatusChange, onNotesChange, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(lead.notes || "");
  const [editingNotes, setEditingNotes] = useState(false);

  function saveNotes() {
    onNotesChange(lead.id, notes);
    setEditingNotes(false);
  }

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="relative shrink-0">
          <select
            value={lead.status}
            onChange={e => onStatusChange(lead.id, e.target.value)}
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border appearance-none cursor-pointer pr-6 ${STATUS_STYLES[lead.status] || STATUS_STYLES["νέο"]}`}
          >
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
          </select>
          <ChevronDown className="w-3 h-3 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-slate-800 truncate">{lead.name}</p>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            {lead.trip_date && lead.trip_date !== "null" && (
              <span className="inline-flex items-center gap-0.5 text-xs text-slate-500"><Calendar className="w-3 h-3" />{lead.trip_date}</span>
            )}
            {lead.address && (
              <span className="inline-flex items-center gap-0.5 text-xs text-slate-500"><MapPin className="w-3 h-3" />{lead.address}</span>
            )}
            {lead.group_size && (
              <span className="inline-flex items-center gap-0.5 text-xs text-slate-500"><Users className="w-3 h-3" />{lead.group_size}</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <button onClick={() => setExpanded(!expanded)} className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
            <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => onDelete(lead.id)} className="w-8 h-8 rounded-lg hover:bg-red-50 flex items-center justify-center text-slate-300 hover:text-red-400 transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-3 space-y-3 bg-slate-50/50">
          {(lead.phone || lead.email) && (
            <div className="flex flex-wrap gap-3">
              {lead.phone && <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Phone className="w-3.5 h-3.5" />{lead.phone}</a>}
              {lead.email && <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"><Mail className="w-3.5 h-3.5" />{lead.email}</a>}
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <StickyNote className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-medium text-slate-500">Σημειώσεις</span>
            </div>
            {editingNotes ? (
              <div className="flex gap-2">
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="flex-1 text-xs border border-slate-200 rounded-lg p-2 resize-none focus:outline-none focus:border-blue-400" placeholder="Πρόσθεσε σημειώσεις..." />
                <div className="flex flex-col gap-1">
                  <button onClick={saveNotes} className="text-xs bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600">Αποθ.</button>
                  <button onClick={() => setEditingNotes(false)} className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-lg hover:bg-slate-300">Ακύρ.</button>
                </div>
              </div>
            ) : (
              <p onClick={() => setEditingNotes(true)} className="text-xs text-slate-500 cursor-pointer hover:text-slate-700 min-h-[24px] italic">
                {notes || "Κλίκ για προσθήκη σημείωσης..."}
              </p>
            )}
          </div>
          {lead.source_url && (
            <a href={lead.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors">
              <ExternalLink className="w-3 h-3" />Πηγή ΔΔΕ
            </a>
          )}
        </div>
      )}
    </div>
  );
}
