import React, { useState } from 'react';
import {
  Bell,
  Calendar,
  AlertTriangle,
  FileText,
  Tag,
  Building,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';
import { Notice } from '../../types';

interface NoticesViewProps {
  notices: Notice[];
}

export const NoticesView: React.FC<NoticesViewProps> = ({ notices }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Fee & Finance', 'Academics', 'Examinations', 'Event'];
  const safeNotices = Array.isArray(notices) ? notices : [];

  const filteredNotices =
    selectedCategory === 'All'
      ? safeNotices
      : safeNotices.filter((n) => n.category === selectedCategory);

  return (
    <div id="notices-view" className="space-y-4">
      {/* Category Pills */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-600" />
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Official Notices & Administrative Circulars
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Feed */}
      <div className="space-y-3">
        {filteredNotices.map((notice) => {
          const isHigh = notice.priority === 'High';
          const isFinance = notice.category === 'Fee & Finance';

          return (
            <div
              key={notice.id}
              className={`p-5 rounded-2xl border transition-all bg-white ${
                isHigh
                  ? 'border-amber-300 bg-amber-50/20 shadow-xs'
                  : 'border-slate-200 shadow-xs hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3 mb-3">
                <div className="flex items-center gap-2">
                  {isHigh && (
                    <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> Urgent
                    </span>
                  )}
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${
                      isFinance
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-indigo-100 text-indigo-800'
                    }`}
                  >
                    {notice.category}
                  </span>
                  <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {notice.date}
                  </span>
                </div>

                <span className="text-[11px] text-slate-400 font-medium truncate">
                  Issued by: {notice.author}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug mb-2">
                {notice.title}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">{notice.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
