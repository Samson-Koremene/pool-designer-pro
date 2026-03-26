import { usePoolStore, calculatePrice, PRICING } from '@/store/usePoolStore';

const ADD_ON_LABELS: Record<string, string> = {
  trees:       'Trees',
  chairs:      'Lounge Chairs',
  umbrella:    'Umbrellas',
  lights:      'Lighting',
  waterfall:   'Waterfall',
  fence:       'Fence',
  bbq:         'BBQ Grill',
  flowers:     'Flower Beds',
  pergola:     'Pergola',
  slide:       'Pool Slide',
  divingboard: 'Diving Board',
  fountain:    'Fountain',
  firepit:     'Fire Pit',
  bar:         'Outdoor Bar',
};

export function PrintableSpecSheet({ screenshot }: { screenshot: string }) {
  const store = usePoolStore();
  const price = calculatePrice(store);

  return (
    <div className="w-full max-w-[800px] mx-auto p-10 bg-white text-slate-900 font-sans">
      <div className="border-b-2 border-slate-900 pb-6 mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black tracking-tight mb-2">Pool Designer Pro</h1>
          <h2 className="text-xl font-medium text-slate-500">{store.projectName}</h2>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">Estimated Cost</div>
          <div className="text-3xl font-black text-slate-900">${price.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-slate-400">Specifications</h3>
          <ul className="space-y-3 font-medium">
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Shape</span>
              <span className="font-bold capitalize">{store.shape.replace('-', ' ')}</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Dimensions</span>
              <span className="font-bold">{store.length}m x {store.width}m</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Depth</span>
              <span className="font-bold">{store.depth}m</span>
            </li>
            <li className="flex justify-between border-b border-slate-100 pb-2">
              <span className="text-slate-500">Total Area</span>
              <span className="font-bold">{store.length * store.width} m²</span>
            </li>
          </ul>
        </div>

        <div>
           <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-slate-400">Materials & Features</h3>
           <ul className="space-y-3 font-medium">
             <li className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Interior Material</span>
               <span className="font-bold capitalize">{store.interiorMaterial}</span>
             </li>
             <li className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Deck Finish</span>
               <span className="font-bold capitalize">{store.deckMaterial}</span>
             </li>
             <li className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Water Tone</span>
               <span className="font-bold capitalize">{store.waterColor.replace('-', ' ')}</span>
             </li>
             <li className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Structural</span>
               <span className="font-bold text-right text-sm">
                 {store.hasSpa && <div>+ Hot Tub Spa ($8,500)</div>}
                 {store.hasSteps && <div>+ Walk-in Steps ($1,200)</div>}
                 {!store.hasSpa && !store.hasSteps && <span>None</span>}
               </span>
             </li>
             <li className="flex justify-between border-b border-slate-100 pb-2">
               <span className="text-slate-500">Environment</span>
               <span className="font-bold text-right text-sm">
                 {store.addOns.length === 0 && <span>None</span>}
                 {store.addOns.map((a) => (
                   <div key={a}>+ {ADD_ON_LABELS[a]} (${PRICING.addOns[a].toLocaleString()})</div>
                 ))}
               </span>
             </li>
           </ul>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-lg font-bold mb-4 uppercase tracking-widest text-slate-400">3D Render</h3>
        {screenshot ? (
          <img src={screenshot} alt="Pool Render" className="w-full aspect-[16/9] object-cover rounded-2xl border-4 border-slate-100 shadow-xl print:shadow-none print:border-slate-300" />
        ) : (
          <div className="w-full aspect-[16/9] bg-slate-100 rounded-2xl flex justify-center items-center text-slate-400">Render Not Available</div>
        )}
      </div>

      <div className="text-center text-xs font-semibold text-slate-400 mt-16 pt-8 border-t border-slate-100 uppercase tracking-widest">
        Generated by Pool Designer Pro • Pricing is an estimate and subject to formal site inspection.
      </div>
    </div>
  );
}
