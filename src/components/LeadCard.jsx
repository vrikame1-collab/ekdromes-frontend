import { MapPin, Users, Calendar, Phone, Mail, ExternalLink, BookmarkCheck, Bookmark } from "lucide-react";

const TYPE_COLORS = {
  "σχολείο": "bg-blue-100 text-blue-700",
  "σύλλογος": "bg-green-100 text-green-700",
  "ΚΑΠΗ": "bg-orange-100 text-orange-700",
  "πρακτορείο": "bg-purple-100 text-purple-700",
  "άλλο": "bg-slate-100 text-slate-600",
};

export default function LeadCard({ lead, onSave, isSaved }) {
  const typeColor = TYPE_COLORS[lead.type] || TYPE_COLORS["άλλο"];
  const hasDate = lead.trip_date && lead.trip_date !== "null";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1.5 ${typeColor}`}>
              {lead.type || "άλλο"}
            </span>
            <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">{lead.name}</h3>
          </div>
          <button
            onClick={() => !isSaved && onSave(lead)}
            disabled={isSaved}
            className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
              isSaved ? "bg-green-50 text-green-500 cursor-default" : "bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-500 active:scale-95"
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {hasDate ? (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg font-medium">
              <Calendar className="w-3 h-3" />{lead.trip_date}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-600 px-2 py-1 rounded-lg">
              <Calendar className="w-3 h-3" />Άγνωστη ημερομηνία
            </span>
          )}
          {lead.group_size && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg">
              <Users className="w-3 h-3" />{lead.group_size}
            </span>
          )}
          {lead.address && (
            <span className="inline-flex items-center gap-1 text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-lg">
              <MapPin className="w-3 h-3" />{lead.address}
            </span>
          )}
        </div>

        {(lead.phone || lead.email) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {lead.phone && <a href={`tel:${lead.phone}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"><Phone className="w-3 h-3" />{lead.phone}</a>}
            {lead.email && <a href={`mailto:${lead.email}`} className="inline-flex items-center gap-1 text-xs text-blue-600 hover:underline truncate max-w-[180px]"><Mail className="w-3 h-3" />{lead.email}</a>}
          </div>
        )}

        {lead.snippet && <p className="text-xs text-slate-500 line-clamp-2 mb-3">{lead.snippet}</p>}

        {lead.source_url && (
          <a href={lead.source_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-blue-500 transition-colors">
            <ExternalLink className="w-3 h-3" />Πηγή
          </a>
        )}
      </div>
    </div>
  );
}
