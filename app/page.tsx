import { getConferences, Conference, Deadline } from '@/lib/data';
import Countdown from '@/components/Countdown';
import { Search, MapPin, Calendar as CalendarIcon, Filter, TrendingUp, Zap } from 'lucide-react';

type TagColor = 'blue' | 'purple' | 'green' | 'pink' | 'orange';

interface TagProps {
  text: string;
  color?: TagColor;
}

interface GroupedConferences {
  [key: string]: Conference[];
}

const Tag = ({ text, color = "blue" }: TagProps) => {
  const colorVariants: Record<TagColor, string> = {
    blue:   "border-blue-500/30 bg-blue-500/10 text-blue-300",
    purple: "border-purple-500/30 bg-purple-500/10 text-purple-300",
    green:  "border-green-500/30 bg-green-500/10 text-green-300",
    pink:   "border-pink-500/30 bg-pink-500/10 text-pink-300",
    orange: "border-orange-500/30 bg-orange-500/10 text-orange-300",
  };

  return (
    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${colorVariants[color]}`}>
      {text}
    </span>
  );
};

const SearchBar = () => (
  <div className="relative w-full max-w-2xl">
    {/* <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
      <Search className="h-5 w-5 text-slate-500" />
    </div>
    <input
      type="text"
      className="block w-full pl-10 pr-3 py-3 border border-slate-700 rounded-xl leading-5 bg-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition"
      placeholder="Search for conferences (e.g. NeurIPS, ICML)..."
    /> */}
  </div>
);

function groupConferencesByMonth(conferences: Conference[]): GroupedConferences {
  const grouped: GroupedConferences = {};
  
  conferences.forEach((conf) => {
    conf.deadlines.forEach((d: Deadline) => {
      const date = new Date(d.date);
      const key = date.toLocaleString('en-US', { month: 'short', year: 'numeric' });
      
      if (!grouped[key]) {
        grouped[key] = [];
      }

      const alreadyExists = grouped[key].some((c) => c.id === conf.id);
      if (!alreadyExists) {
        grouped[key].push(conf);
      }
    });
  });
  
  return grouped;
}

export default async function Home() {
  
  const conferences: Conference[] = await getConferences();

  const trendingConfs: Conference[] = conferences.slice(0, 3);

  const calendarData: GroupedConferences = groupConferencesByMonth(conferences);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-300 font-sans selection:bg-blue-500/30">
      
      <header className="border-b border-slate-800 bg-[#0B0F19]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              MyConference<span className="text-blue-400">Tracker</span>
            </h1>
          </div>

          <SearchBar />

          <div className="flex gap-2">
             <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition">
                <Filter className="w-4 h-4" /> Filters (WIP)
             </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-3 space-y-6 hidden lg:block">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-blue-400" /> Upcoming Calendar
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {Object.entries(calendarData).slice(0, 4).map(([month, confs]) => (
                <div key={month} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                  <h4 className="text-slate-400 text-sm font-bold uppercase mb-3">{month}</h4>
                  <div className="flex flex-wrap gap-2">
                    {confs.map((c) => (
                      <div key={c.id} className="bg-blue-600 text-white text-xs font-bold px-2 py-1.5 rounded shadow-sm">
                        {c.acronym}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {Object.keys(calendarData).length === 0 && (
                <div className="p-4 text-sm text-slate-500 text-center border border-dashed border-slate-700 rounded-xl">
                  No upcoming dates
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
             <div className="flex justify-between items-end">
                <h3 className="text-xl font-bold text-white">All Conferences</h3>
                <span className="text-sm text-slate-500">{conferences.length} found</span>
             </div>

             <div className="space-y-4">
                {conferences.map((conf: any) => {
                  const nextDeadline: Deadline | undefined = conf.deadlines[0];
                  
                  return (
                    <article key={conf.id} className="group relative bg-slate-800 border border-slate-700 rounded-2xl p-5 hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-500/10">
                      <div className="mb-4">
                        <div className="flex items-baseline gap-3 mb-1">
                          <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition">
                            {conf.acronym}
                          </h2>
                          <span className="text-slate-400 text-sm">{conf.year}</span>
                        </div>
                        <h3 className="text-slate-400 text-sm font-medium line-clamp-1">{conf.title}</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                         <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="w-4 h-4 text-slate-500" />
                            {conf.location || "TBA"}
                         </div>
                         <div className="flex items-center gap-2 text-slate-400">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            {conf.timezone}
                         </div>
                      </div>

                      {nextDeadline && (
                        <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/50 flex justify-between items-center mb-4">
                           <div>
                              <p className="text-xs text-slate-500 uppercase font-bold">{nextDeadline.type}</p>
                              <p className="text-slate-300 text-sm mt-0.5">
                                {new Date(nextDeadline.date).toLocaleDateString()}
                              </p>
                           </div>
                           <div className="text-right">
                              <p className="text-xs text-slate-500 mb-0.5">Time Remaining</p>
                              <Countdown date={nextDeadline.date} />
                           </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                        <div className="flex gap-2">
                           {conf.tags.slice(0, 3).map((tag: any) => (
                             <Tag key={tag} text={tag} color="blue" />
                           ))}
                        </div>
                        <a href={conf.website} target="_blank" className="text-sm font-semibold text-blue-400 hover:text-blue-300">
                           Website &rarr;
                        </a>
                      </div>
                    </article>
                  );
                })}
             </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-5">
               <h3 className="text-white font-bold flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-purple-400" /> Trending Confs
               </h3>
               <div className="space-y-4">
                  {trendingConfs.map((conf: any, idx) => (
                    <div key={conf.id} className="flex items-center gap-3 pb-3 border-b border-slate-700 last:border-0 last:pb-0">
                        <div className="text-2xl font-bold text-slate-600 w-6 flex-shrink-0">
                          0{idx + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p 
                            className="text-white font-bold text-sm hover:text-blue-400 cursor-pointer truncate"
                            title={`${conf.acronym} ${conf.year}`} 
                          >
                            {conf.acronym} {conf.year}
                          </p>
                          
                          <p 
                            className="text-xs text-slate-500 mt-0.5 truncate"
                            title={conf.title} 
                          >
                            {conf.title}
                          </p>
                        </div>
                    </div>
                  ))}
               </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl p-5 text-center">
               <h3 className="text-white font-bold text-lg mb-2">Add a Conference</h3>
               <p className="text-blue-100 text-sm mb-4">Help the community by adding missing deadlines.</p>
               <a 
                 href="https://forms.gle/W7LQqqhPrVZSyhzS7" 
                 target="_blank"
                 className="block w-full bg-white text-blue-600 font-bold py-2 rounded-lg hover:bg-blue-50 transition"
               >
                 Submit Now
               </a>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}