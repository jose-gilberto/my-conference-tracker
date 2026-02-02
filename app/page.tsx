import { getConferences } from '@/lib/data';
// ... imports de componentes (vamos criar o Countdown logo abaixo)

const DateBadge = ({ date }: { date: string }) => {
  const d = new Date(date);
  return (
    <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
      {d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: '2-digit'  })}
    </span>
  );
};

export default async function Home() {
  const conferences = await getConferences();

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">AI Deadlines</h1>
        </header>

        <div className="grid gap-6">
          {conferences.length === 0 ? (
            <p>Nenhuma conferência encontrada. Verifique se o `public/conferences.json` existe.</p>
          ) : (
            conferences.map((conf) => (
              <article key={conf.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <div className="flex justify-between">
                  <h2 className="text-2xl font-bold text-slate-800">
                    {conf.acronym} <span className="text-slate-400 font-normal text-lg">{conf.title}</span>
                  </h2>
                  <a href={conf.website} target="_blank" className="text-blue-600 hover:underline">Link &rarr;</a>
                </div>
                
                <div className="mt-4 space-y-2">
                  {conf.deadlines.map((d, i) => (
                     <div key={i} className="flex gap-4 text-sm">
                        <span className="font-bold">{d.type}:</span>
                        <DateBadge date={d.date} />
                     </div>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}