import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip, Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { getFoods, getDiary, saveDiary, getGoal, saveGoal, saveCustomFood, saveRecipe, deleteCustomFoodOrRecipe, Food } from './data';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

// ─── Shared helpers ──────────────────────────────────────────────────────────

function FormGroup({ label, name, value, onChange }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[0.72rem] font-semibold tracking-widest uppercase text-[var(--text-soft)]">{label}</label>
      <input type="number" name={name} value={value} onChange={onChange} min="0" step="any"
        className="px-3.5 py-2 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
    </div>
  );
}

// ─── Toast ───────────────────────────────────────────────────────────────────

function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-7 right-6 z-[2000] flex flex-col gap-2 pointer-events-none">
      <div className="bg-[var(--text)] text-white px-4 py-2.5 rounded-[var(--radius-sm)] text-[0.82rem] font-medium shadow-[var(--shadow-md)] animate-toast pointer-events-auto">
        {message}
      </div>
    </div>
  );
}

// ─── QtyModal ────────────────────────────────────────────────────────────────

function QtyModal({ food, meal, onClose, onAdd }: { food: Food, meal: string, onClose: () => void, onAdd: (qty: number) => void }) {
  const [qty, setQty] = useState(food.portion || 100);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const k = Math.round(food.kcal * qty / 100);
  const p = (food.proteins * qty / 100).toFixed(1);
  const c = (food.carbs * qty / 100).toFixed(1);
  const g = (food.fats * qty / 100).toFixed(1);
  const portions = [
    { label: '½ porzione', g: Math.round((food.portion || 100) / 2) },
    { label: '1 porzione', g: food.portion || 100 },
    { label: '150g', g: 150 },
    { label: '200g', g: 200 },
  ];

  return (
    <div className="fixed inset-0 bg-[rgba(44,42,39,0.4)] backdrop-blur-[4px] z-[1000] flex items-center justify-center p-5 animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto animate-dropIn">
        <div className="flex items-center justify-between p-6 pb-5 border-b border-[var(--border)]">
          <div className="text-lg font-bold">Aggiungi porzione</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--bg)] text-[var(--text-soft)] flex items-center justify-center hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors">✕</button>
        </div>
        <div className="p-6">
          <div className="text-base font-semibold mb-1.5">{food.name}</div>
          <div className="text-sm text-[var(--text-soft)] mb-5">{food.kcal} kcal · P:{food.proteins}g · C:{food.carbs}g · G:{food.fats}g (per 100g)</div>
          <div className="flex items-center gap-2.5 mb-2">
            <input ref={inputRef} type="number" value={qty} onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 1))}
              className="flex-1 p-3.5 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border)] font-sans text-2xl font-bold text-center bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
            <span className="text-sm text-[var(--text-soft)] whitespace-nowrap">grammi</span>
          </div>
          <div className="text-sm text-[var(--text-soft)] text-center min-h-[20px] mb-4">
            {qty}g → {k} kcal · P:{p}g · C:{c}g · G:{g}g
          </div>
          <div>
            <div className="text-[0.72rem] text-[var(--text-soft)] mb-2 font-semibold tracking-widest uppercase">Porzioni rapide</div>
            <div className="flex flex-wrap gap-1.5">
              {portions.map((p, i) => (
                <button key={i} onClick={() => setQty(p.g)}
                  className="px-3.5 py-1.5 rounded-full border-[1.5px] border-[var(--border)] font-sans text-xs font-medium bg-[var(--surface2)] text-[var(--text-soft)] hover:bg-[var(--accent-col)] hover:text-white hover:border-[var(--accent-col)] transition-colors">
                  {p.label} ({p.g}g)
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-4 px-7 flex gap-2.5 justify-end bg-[var(--surface)] border-t border-[var(--border)] rounded-b-[var(--radius-xl)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm font-semibold bg-[var(--bg)] text-[var(--text-soft)] hover:bg-[var(--border)] transition-colors">Annulla</button>
          <button onClick={() => onAdd(qty)} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-none font-sans text-sm font-semibold bg-[var(--text)] text-white hover:bg-[#1a1a1a] hover:-translate-y-px shadow-[var(--shadow-sm)] transition-all">Aggiungi</button>
        </div>
      </div>
    </div>
  );
}

// ─── EditModal ───────────────────────────────────────────────────────────────

function EditModal({ food, onClose, onSave }: { food: Food, onClose: () => void, onSave: (overrides: any) => void }) {
  const [formData, setFormData] = useState({ ...food });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  return (
    <div className="fixed inset-0 bg-[rgba(44,42,39,0.4)] backdrop-blur-[4px] z-[1000] flex items-center justify-center p-5 animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto animate-dropIn flex flex-col">
        <div className="flex items-center justify-between p-6 pb-5 border-b border-[var(--border)] shrink-0">
          <div className="text-lg font-bold">Modifica Alimento</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--bg)] text-[var(--text-soft)] flex items-center justify-center hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors">✕</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="text-lg font-semibold mb-1">{food.name}</div>
          <div className="text-xs text-[var(--text-soft)] mb-5">{food.category}</div>
          <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mt-4 mb-2.5">Valori per 100g</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Calorie (kcal)" name="kcal" value={formData.kcal} onChange={handleChange} />
            <FormGroup label="Porzione standard (g)" name="portion" value={formData.portion} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Proteine (g)" name="proteins" value={formData.proteins} onChange={handleChange} />
            <FormGroup label="Carboidrati (g)" name="carbs" value={formData.carbs} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Grassi (g)" name="fats" value={formData.fats} onChange={handleChange} />
            <FormGroup label="Fibre (g)" name="fiber" value={formData.fiber} onChange={handleChange} />
          </div>
          <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mt-4 mb-2.5">Minerali (per 100g)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Sodio (mg)" name="sodium" value={formData.sodium} onChange={handleChange} />
            <FormGroup label="Potassio (mg)" name="potassium" value={formData.potassium} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Calcio (mg)" name="calcium" value={formData.calcium} onChange={handleChange} />
            <FormGroup label="Ferro (mg)" name="iron" value={formData.iron} onChange={handleChange} />
          </div>
          <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mt-4 mb-2.5">Vitamine (per 100g)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Vitamina C (mg)" name="vitC" value={formData.vitC} onChange={handleChange} />
            <FormGroup label="Vitamina A (µg RE)" name="vitA" value={formData.vitA} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="B1 Tiamina (mg)" name="vitB1" value={formData.vitB1} onChange={handleChange} />
            <FormGroup label="B2 Riboflavina (mg)" name="vitB2" value={formData.vitB2} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="B3 Niacina (mg)" name="vitB3" value={formData.vitB3} onChange={handleChange} />
            <FormGroup label="B6 (mg)" name="vitB6" value={formData.vitB6} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="B12 (µg)" name="vitB12" value={formData.vitB12} onChange={handleChange} />
            <FormGroup label="Vitamina D (µg)" name="vitD" value={formData.vitD} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Vitamina E (mg)" name="vitE" value={formData.vitE} onChange={handleChange} />
            <FormGroup label="Folati (µg)" name="folate" value={formData.folate} onChange={handleChange} />
          </div>
        </div>
        <div className="p-4 px-7 flex gap-2.5 justify-end bg-[var(--surface)] border-t border-[var(--border)] shrink-0 rounded-b-[var(--radius-xl)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm font-semibold bg-[var(--bg)] text-[var(--text-soft)] hover:bg-[var(--border)] transition-colors">Annulla</button>
          <button onClick={() => onSave(formData)} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-none font-sans text-sm font-semibold bg-[var(--text)] text-white hover:bg-[#1a1a1a] hover:-translate-y-px shadow-[var(--shadow-sm)] transition-all">Salva modifiche</button>
        </div>
      </div>
    </div>
  );
}

// ─── CustomFoodModal ─────────────────────────────────────────────────────────

function CustomFoodModal({ onClose, onSave }: any) {
  const empty = { name: '', category: 'I miei alimenti', portion: 100, kcal: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 };
  const [formData, setFormData] = useState(empty);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? (parseFloat(value) || 0) : value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) { alert("Inserisci un nome per l'alimento"); return; }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(44,42,39,0.4)] backdrop-blur-[4px] z-[1000] flex items-center justify-center p-5 animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto animate-dropIn flex flex-col">
        <div className="flex items-center justify-between p-6 pb-5 border-b border-[var(--border)] shrink-0">
          <div className="text-lg font-bold">Nuovo Alimento Personalizzato</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--bg)] text-[var(--text-soft)] flex items-center justify-center hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors">✕</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col gap-1.5 mb-4">
            <label className="text-[0.72rem] font-semibold tracking-widest uppercase text-[var(--text-soft)]">Nome Alimento *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Es. Pancake proteico"
              className="px-3.5 py-2 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
          </div>
          <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mt-4 mb-2.5">Valori per 100g</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Calorie (kcal)" name="kcal" value={formData.kcal} onChange={handleChange} />
            <FormGroup label="Porzione standard (g)" name="portion" value={formData.portion} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Proteine (g)" name="proteins" value={formData.proteins} onChange={handleChange} />
            <FormGroup label="Carboidrati (g)" name="carbs" value={formData.carbs} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            <FormGroup label="Grassi (g)" name="fats" value={formData.fats} onChange={handleChange} />
            <FormGroup label="Fibre (g)" name="fiber" value={formData.fiber} onChange={handleChange} />
          </div>
          <details className="mt-4 group">
            <summary className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] cursor-pointer select-none mb-2.5 flex items-center gap-2">
              Minerali e Vitamine (Opzionale) <span className="text-[0.55rem] transition-transform group-open:rotate-180">▼</span>
            </summary>
            <div className="pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="Sodio (mg)" name="sodium" value={formData.sodium} onChange={handleChange} />
                <FormGroup label="Potassio (mg)" name="potassium" value={formData.potassium} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="Calcio (mg)" name="calcium" value={formData.calcium} onChange={handleChange} />
                <FormGroup label="Ferro (mg)" name="iron" value={formData.iron} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="Vitamina C (mg)" name="vitC" value={formData.vitC} onChange={handleChange} />
                <FormGroup label="Vitamina A (µg RE)" name="vitA" value={formData.vitA} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="B1 Tiamina (mg)" name="vitB1" value={formData.vitB1} onChange={handleChange} />
                <FormGroup label="B2 Riboflavina (mg)" name="vitB2" value={formData.vitB2} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="B3 Niacina (mg)" name="vitB3" value={formData.vitB3} onChange={handleChange} />
                <FormGroup label="B6 (mg)" name="vitB6" value={formData.vitB6} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="B12 (µg)" name="vitB12" value={formData.vitB12} onChange={handleChange} />
                <FormGroup label="Vitamina D (µg)" name="vitD" value={formData.vitD} onChange={handleChange} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <FormGroup label="Vitamina E (mg)" name="vitE" value={formData.vitE} onChange={handleChange} />
                <FormGroup label="Folati (µg)" name="folate" value={formData.folate} onChange={handleChange} />
              </div>
            </div>
          </details>
        </div>
        <div className="p-4 px-7 flex gap-2.5 justify-end bg-[var(--surface)] border-t border-[var(--border)] shrink-0 rounded-b-[var(--radius-xl)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm font-semibold bg-[var(--bg)] text-[var(--text-soft)] hover:bg-[var(--border)] transition-colors">Annulla</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-none font-sans text-sm font-semibold bg-[var(--text)] text-white hover:bg-[#1a1a1a] hover:-translate-y-px shadow-[var(--shadow-sm)] transition-all">Salva</button>
        </div>
      </div>
    </div>
  );
}

// ─── RecipeModal ─────────────────────────────────────────────────────────────

function RecipeModal({ foods, onClose, onSave }: any) {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState<{ food: Food, weight: number }[]>([]);
  const [totalWeight, setTotalWeight] = useState<number | ''>('');
  const [isManualWeight, setIsManualWeight] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchResults = searchQuery.length > 0
    ? foods.filter((f: Food) => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
    : [];

  const sumWeight = ingredients.reduce((acc, ing) => acc + ing.weight, 0);

  useMemo(() => {
    if (!isManualWeight) setTotalWeight(sumWeight || '');
  }, [sumWeight, isManualWeight]);

  const calculatedValues = useMemo(() => {
    let kcal=0, prot=0, carb=0, fat=0, fiber=0;
    let sodium=0, potassium=0, calcium=0, iron=0;
    let vitA=0, vitC=0, vitB1=0, vitB2=0, vitB3=0, vitB6=0, vitB12=0, vitD=0, vitE=0, folate=0;
    ingredients.forEach(ing => {
      const q = ing.weight, f = ing.food;
      kcal += f.kcal * q / 100; prot += f.proteins * q / 100; carb += f.carbs * q / 100;
      fat += f.fats * q / 100; fiber += f.fiber * q / 100;
      sodium += (f.sodium || 0) * q / 100; potassium += (f.potassium || 0) * q / 100;
      calcium += (f.calcium || 0) * q / 100; iron += (f.iron || 0) * q / 100;
      vitA += (f.vitA || 0) * q / 100; vitC += (f.vitC || 0) * q / 100;
      vitB1 += (f.vitB1 || 0) * q / 100; vitB2 += (f.vitB2 || 0) * q / 100;
      vitB3 += (f.vitB3 || 0) * q / 100; vitB6 += (f.vitB6 || 0) * q / 100;
      vitB12 += (f.vitB12 || 0) * q / 100; vitD += (f.vitD || 0) * q / 100;
      vitE += (f.vitE || 0) * q / 100; folate += (f.folate || 0) * q / 100;
    });
    const fw = typeof totalWeight === 'number' ? totalWeight : sumWeight;
    const factor = fw > 0 ? 100 / fw : 0;
    return {
      kcal: Math.round(kcal * factor), proteins: +(prot * factor).toFixed(1), carbs: +(carb * factor).toFixed(1),
      fats: +(fat * factor).toFixed(1), fiber: +(fiber * factor).toFixed(1),
      sodium: +(sodium * factor).toFixed(1), potassium: +(potassium * factor).toFixed(1),
      calcium: +(calcium * factor).toFixed(1), iron: +(iron * factor).toFixed(1),
      vitA: +(vitA * factor).toFixed(1), vitC: +(vitC * factor).toFixed(1),
      vitB1: +(vitB1 * factor).toFixed(2), vitB2: +(vitB2 * factor).toFixed(2),
      vitB3: +(vitB3 * factor).toFixed(1), vitB6: +(vitB6 * factor).toFixed(2),
      vitB12: +(vitB12 * factor).toFixed(2), vitD: +(vitD * factor).toFixed(1),
      vitE: +(vitE * factor).toFixed(1), folate: +(folate * factor).toFixed(1),
    };
  }, [ingredients, totalWeight, sumWeight]);

  const handleSave = () => {
    if (!name.trim()) { alert('Inserisci un nome per la ricetta'); return; }
    if (ingredients.length === 0) { alert('Aggiungi almeno un ingrediente'); return; }
    const fw = typeof totalWeight === 'number' ? totalWeight : sumWeight;
    if (fw <= 0) { alert('Il peso totale deve essere maggiore di 0'); return; }
    onSave({ name, category: 'I miei alimenti', portion: fw, ...calculatedValues, ingredients: ingredients.map(ing => ({ foodId: ing.food.id, weight: ing.weight })) });
  };

  return (
    <div className="fixed inset-0 bg-[rgba(44,42,39,0.4)] backdrop-blur-[4px] z-[1000] flex items-center justify-center p-5 animate-fadeIn" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] shadow-[var(--shadow-lg)] w-full max-w-[520px] max-h-[90vh] overflow-y-auto animate-dropIn flex flex-col">
        <div className="flex items-center justify-between p-6 pb-5 border-b border-[var(--border)] shrink-0">
          <div className="text-lg font-bold">Nuova Ricetta</div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[var(--bg)] text-[var(--text-soft)] flex items-center justify-center hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors">✕</button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-[0.72rem] font-semibold tracking-widest uppercase text-[var(--text-soft)]">Nome Ricetta *</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Es. Pizza Margherita"
              className="px-3.5 py-2 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
          </div>
          <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mb-2.5">Ingredienti</div>
          <div className="mb-4 space-y-2">
            {ingredients.length === 0 ? (
              <div className="text-sm text-[var(--text-soft)] italic">Nessun ingrediente aggiunto</div>
            ) : (
              ingredients.map((ing, idx) => (
                <div key={idx} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
                  <div className="flex-1 min-w-0 text-sm font-medium truncate">{ing.food.name}</div>
                  <div className="flex items-center gap-1.5">
                    <input type="number" value={ing.weight} onChange={e => { const n = [...ingredients]; n[idx].weight = parseInt(e.target.value) || 0; setIngredients(n); }}
                      className="w-16 px-2 py-1 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm text-center bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
                    <span className="text-xs text-[var(--text-soft)]">g</span>
                  </div>
                  <button onClick={() => setIngredients(prev => prev.filter((_, i) => i !== idx))} className="w-7 h-7 rounded-full bg-[var(--bg)] text-[var(--text-soft)] text-xs flex items-center justify-center hover:bg-[#FFE0E0] hover:text-[var(--danger)] transition-colors shrink-0">✕</button>
                </div>
              ))
            )}
          </div>
          <div className="relative mb-6">
            <input type="text" placeholder="Cerca ingrediente…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full py-2.5 pl-4 pr-10 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] focus:ring-[3px] focus:ring-[rgba(232,168,124,0.15)] transition-all" />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)] text-sm pointer-events-none">🔍</span>
            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute left-0 right-0 top-[calc(100%-6px)] bg-[var(--surface)] rounded-[var(--radius-md)] z-50 shadow-[var(--shadow-lg)] border border-[var(--border)] max-h-48 overflow-y-auto animate-dropIn">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-[var(--text-soft)] text-sm">Nessun risultato trovato</div>
                ) : searchResults.map((f: Food) => (
                  <div key={f.id} onClick={() => { setIngredients(prev => [...prev, { food: f, weight: 100 }]); setSearchQuery(''); }}
                    className="flex items-center justify-between p-2.5 px-4 cursor-pointer hover:bg-[var(--bg)] transition-colors gap-3">
                    <div className="text-sm font-medium flex-1 min-w-0 truncate">{f.name}</div>
                    <div className="text-xs font-bold text-[var(--text-soft)] whitespace-nowrap">{f.kcal} kcal</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex items-end gap-4 mb-4">
            <div className="flex flex-col gap-1.5 flex-1">
              <label className="text-[0.72rem] font-semibold tracking-widest uppercase text-[var(--text-soft)]">Peso Totale Ricetta (g) *</label>
              <input type="number" value={totalWeight} onChange={e => { setTotalWeight(parseInt(e.target.value) || ''); setIsManualWeight(true); }}
                className="px-3.5 py-2 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
            </div>
            <div className="text-sm text-[var(--text-soft)] pb-2">Somma ingredienti: {sumWeight}g</div>
          </div>
          <div className="bg-[var(--surface2)] rounded-[var(--radius-sm)] p-3.5 text-sm">
            <div className="mb-1">Valori per 100g:</div>
            <div className="font-medium"><strong className="text-base">{calculatedValues.kcal} kcal</strong> · P: {calculatedValues.proteins}g · C: {calculatedValues.carbs}g · G: {calculatedValues.fats}g</div>
          </div>
        </div>
        <div className="p-4 px-7 flex gap-2.5 justify-end bg-[var(--surface)] border-t border-[var(--border)] shrink-0 rounded-b-[var(--radius-xl)]">
          <button onClick={onClose} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm font-semibold bg-[var(--bg)] text-[var(--text-soft)] hover:bg-[var(--border)] transition-colors">Annulla</button>
          <button onClick={handleSave} className="px-5 py-2.5 rounded-[var(--radius-sm)] border-none font-sans text-sm font-semibold bg-[var(--text)] text-white hover:bg-[#1a1a1a] hover:-translate-y-px shadow-[var(--shadow-sm)] transition-all">Salva Ricetta</button>
        </div>
      </div>
    </div>
  );
}

// ─── DiaryPage ────────────────────────────────────────────────────────────────

function MacroPill({ label, val, unit, color }: any) {
  return (
    <div className="bg-[var(--surface2)] rounded-[var(--radius-md)] p-3.5 border-[1.5px] border-[var(--border)] hover:shadow-[var(--shadow-sm)] transition-shadow">
      <div className="text-[0.68rem] font-semibold tracking-widest uppercase mb-1" style={{ color }}>{label}</div>
      <div className="text-xl font-bold tracking-tight">{val.toFixed(1)}<span className="text-[0.7rem] text-[var(--text-soft)] font-normal ml-0.5">{unit}</span></div>
    </div>
  );
}

function MicroPill({ icon, label, val, unit }: any) {
  return (
    <div className="bg-[var(--surface2)] rounded-[var(--radius-sm)] p-3 border border-[var(--border)] flex flex-col gap-1.5">
      <span className="text-xl">{icon}</span>
      <div className="min-w-0">
        <div className="text-[0.62rem] font-semibold tracking-wider uppercase text-[var(--text-soft)] whitespace-nowrap">{label}</div>
        <div className="text-lg font-bold tracking-tight leading-tight">{Math.round(val)}<span className="text-[0.62rem] text-[var(--text-soft)] font-normal ml-0.5">{unit}</span></div>
      </div>
    </div>
  );
}

function MealSection({ title, subtitle, icon, colorClass, items, foods, totalKcal, collapsed, onToggle, onUpdateQty, onRemoveItem, onSearchSelect }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchResults = searchQuery.length > 0
    ? foods.filter((f: Food) => f.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 10)
    : [];

  return (
    <div className="mb-5 rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] relative">
      <div className={`flex items-center justify-between p-4 cursor-pointer select-none transition-opacity hover:opacity-85 ${colorClass} ${collapsed ? 'rounded-[var(--radius-lg)]' : 'rounded-t-[var(--radius-lg)]'}`} onClick={onToggle}>
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{icon}</span>
          <div>
            <div className="font-semibold text-base">{title}</div>
            <div className="text-xs text-[var(--text-soft)] font-normal">{subtitle}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-bold px-3.5 py-1 rounded-full bg-white/70 flex items-center gap-1">
            {Math.round(totalKcal)} <span className="text-[0.7rem] font-normal text-[var(--text-soft)]">kcal</span>
          </div>
          <div className={`text-[0.7rem] text-[var(--text-soft)] ml-2 transition-transform duration-200 ${collapsed ? '-rotate-90' : ''}`}>▼</div>
        </div>
      </div>
      {!collapsed && (
        <div className="bg-[var(--surface)] rounded-b-[var(--radius-lg)]">
          <div className="px-5">
            {items.length === 0 ? (
              <div className="text-center py-6 text-[var(--text-soft)] text-sm italic">Nessun alimento aggiunto</div>
            ) : (
              items.map((entry: any, idx: number) => {
                const food = foods.find((f: Food) => f.id === entry.foodId);
                if (!food) return null;
                const k = Math.round(food.kcal * entry.qty / 100);
                return (
                  <div key={idx} className="flex items-center gap-3 py-3 border-b border-[var(--border)] last:border-0 animate-fadeIn">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-2">
                        {food.name}
                        {food.isCustom && <span className="text-[0.6rem] bg-[var(--accent-col)] text-white px-1.5 py-0.5 rounded-sm">Custom</span>}
                        {food.isRecipe && <span className="text-[0.6rem] bg-[var(--text)] text-white px-1.5 py-0.5 rounded-sm">Ricetta</span>}
                      </div>
                      <div className="text-xs text-[var(--text-soft)]">P: {(food.proteins * entry.qty / 100).toFixed(1)}g · C: {(food.carbs * entry.qty / 100).toFixed(1)}g · G: {(food.fats * entry.qty / 100).toFixed(1)}g</div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <input type="number" value={entry.qty} onChange={e => onUpdateQty(idx, parseInt(e.target.value) || 1)}
                        className="w-16 px-2 py-1 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm text-center bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
                      <span className="text-xs text-[var(--text-soft)]">g</span>
                    </div>
                    <div className="text-sm font-bold min-w-[54px] text-right">{k} <small className="font-normal text-[var(--text-soft)]">kcal</small></div>
                    <button onClick={() => onRemoveItem(idx)} className="w-7 h-7 rounded-full bg-[var(--bg)] text-[var(--text-soft)] text-xs flex items-center justify-center hover:bg-[#FFE0E0] hover:text-[var(--danger)] transition-colors shrink-0">✕</button>
                  </div>
                );
              })
            )}
          </div>
          <div className="p-3.5 px-5 relative">
            <input type="text" placeholder="Cerca alimento da aggiungere…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)} onFocus={() => setIsSearchFocused(true)} onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              className="w-full py-2.5 pl-4 pr-10 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] focus:ring-[3px] focus:ring-[rgba(232,168,124,0.15)] transition-all" />
            <span className="absolute right-8 top-1/2 -translate-y-1/2 text-[var(--text-soft)] text-sm pointer-events-none">🔍</span>
            {isSearchFocused && searchQuery.length > 0 && (
              <div className="absolute left-5 right-5 top-[calc(100%-6px)] bg-[var(--surface)] rounded-[var(--radius-md)] z-50 shadow-[var(--shadow-lg)] border border-[var(--border)] max-h-72 overflow-y-auto animate-dropIn">
                {searchResults.length === 0 ? (
                  <div className="p-4 text-center text-[var(--text-soft)] text-sm">Nessun risultato trovato</div>
                ) : searchResults.map((f: Food) => (
                  <div key={f.id} onClick={() => { onSearchSelect(f); setSearchQuery(''); }}
                    className="flex items-center justify-between p-2.5 px-4 cursor-pointer hover:bg-[var(--bg)] transition-colors gap-3">
                    <div className="text-sm font-medium flex-1 min-w-0 truncate flex items-center gap-2">
                      {f.name}
                      {f.isCustom && <span className="text-[0.6rem] bg-[var(--accent-col)] text-white px-1.5 py-0.5 rounded-sm">Custom</span>}
                      {f.isRecipe && <span className="text-[0.6rem] bg-[var(--text)] text-white px-1.5 py-0.5 rounded-sm">Ricetta</span>}
                    </div>
                    <div className="text-xs text-[var(--text-soft)] whitespace-nowrap">{f.category}</div>
                    <div className="text-xs font-bold text-[var(--text-soft)] whitespace-nowrap">{f.kcal} kcal/100g</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function DiaryPage({ diary, foods, goal, setGoal, onUpdateQty, onRemoveItem, onSearchSelect }: any) {
  const [vitaminsOpen, setVitaminsOpen] = useState(false);
  const [collapsedMeals, setCollapsedMeals] = useState<Record<string, boolean>>({});
  const toggleMeal = (meal: string) => setCollapsedMeals(prev => ({ ...prev, [meal]: !prev[meal] }));

  let kcal=0, prot=0, carb=0, fat=0, fiber=0;
  let sodium=0, potassium=0, calcium=0, iron=0;
  let vitA=0, vitC=0, vitB1=0, vitB2=0, vitB3=0, vitB6=0, vitB12=0, vitD=0, vitE=0, folate=0;
  const mealTotals: Record<string, number> = { colazione: 0, pranzo: 0, cena: 0 };

  ['colazione', 'pranzo', 'cena'].forEach(meal => {
    (diary[meal] || []).forEach((entry: any) => {
      const food = foods.find((f: Food) => f.id === entry.foodId);
      if (!food) return;
      const q = entry.qty;
      kcal += food.kcal * q / 100; mealTotals[meal] += food.kcal * q / 100;
      prot += food.proteins * q / 100; carb += food.carbs * q / 100; fat += food.fats * q / 100; fiber += food.fiber * q / 100;
      sodium += (food.sodium || 0) * q / 100; potassium += (food.potassium || 0) * q / 100;
      calcium += (food.calcium || 0) * q / 100; iron += (food.iron || 0) * q / 100;
      vitA += (food.vitA || 0) * q / 100; vitC += (food.vitC || 0) * q / 100;
      vitB1 += (food.vitB1 || 0) * q / 100; vitB2 += (food.vitB2 || 0) * q / 100;
      vitB3 += (food.vitB3 || 0) * q / 100; vitB6 += (food.vitB6 || 0) * q / 100;
      vitB12 += (food.vitB12 || 0) * q / 100; vitD += (food.vitD || 0) * q / 100;
      vitE += (food.vitE || 0) * q / 100; folate += (food.folate || 0) * q / 100;
    });
  });

  const remaining = goal - Math.round(kcal);
  const pct = Math.min((kcal / goal) * 100, 100);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--surface)] rounded-[var(--radius-xl)] p-6 sm:p-8 shadow-[var(--shadow-md)] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(232,168,124,0.15)_0%,transparent_70%)] pointer-events-none"></div>
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="text-xs font-semibold tracking-widest uppercase text-[var(--text-soft)]">Riepilogo Giornaliero</div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--text-soft)]">Obiettivo:</span>
            <input type="number" value={goal} onChange={e => setGoal(parseInt(e.target.value) || 2000)}
              className="w-20 px-2.5 py-1 rounded-full border-[1.5px] border-[var(--border)] font-sans text-xs text-center bg-[var(--surface2)] outline-none focus:border-[var(--accent-col)] transition-colors" />
            <span className="text-xs text-[var(--text-soft)]">kcal</span>
          </div>
        </div>
        <div className="text-5xl font-bold tracking-tight leading-none text-[var(--text)] mb-1">
          {Math.round(kcal)} <span className="text-lg font-light text-[var(--text-soft)] ml-1">kcal</span>
        </div>
        <div className="text-sm text-[var(--text-soft)] mb-5">
          Obiettivo: <strong className="text-[var(--text)]">{goal} kcal</strong> — {remaining >= 0 ? 'Rimanenti' : 'Surplus'}: <strong className="text-[var(--text)]">{Math.abs(remaining)} kcal</strong>
        </div>
        <div className="bg-[var(--bg)] rounded-full h-2 mb-6 overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-500 ease-out ${kcal > goal ? 'bg-gradient-to-r from-[var(--danger)] to-[#E05050]' : 'bg-gradient-to-r from-[var(--accent-col)] to-[#F0A060]'}`} style={{ width: `${pct}%` }}></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MacroPill label="Proteine" val={prot} unit="g" color="var(--accent-prot)" />
          <MacroPill label="Carboidrati" val={carb} unit="g" color="#C09020" />
          <MacroPill label="Grassi" val={fat} unit="g" color="#9060B0" />
          <MacroPill label="Fibre" val={fiber} unit="g" color="#508050" />
        </div>
        <div className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--text-soft)] mt-5 mb-2">⚗️ Minerali</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <MicroPill icon="🧂" label="Sodio" val={sodium} unit="mg" />
          <MicroPill icon="🍌" label="Potassio" val={potassium} unit="mg" />
          <MicroPill icon="🦴" label="Calcio" val={calcium} unit="mg" />
          <MicroPill icon="🩸" label="Ferro" val={iron} unit="mg" />
        </div>
        <div className="flex items-center justify-between mt-5 mb-2 cursor-pointer select-none" onClick={() => setVitaminsOpen(!vitaminsOpen)}>
          <span className="text-[0.65rem] font-bold tracking-widest uppercase text-[var(--text-soft)]">💊 Vitamine</span>
          <button className="flex items-center gap-1 text-[0.68rem] font-semibold text-[var(--text-soft)] bg-[var(--bg)] border-[1.5px] border-[var(--border)] rounded-full px-2.5 py-1 hover:bg-[var(--border)] hover:text-[var(--text)] transition-colors">
            Altre <span className={`text-[0.55rem] transition-transform ${vitaminsOpen ? 'rotate-180' : ''}`}>▼</span>
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          <MicroPill icon="🍊" label="Vit. C" val={vitC} unit="mg" />
          <MicroPill icon="🥕" label="Vit. A" val={vitA} unit="µg" />
          <MicroPill icon="🌻" label="Vit. E" val={vitE} unit="mg" />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${vitaminsOpen ? 'max-h-[600px] opacity-100 mt-2.5' : 'max-h-0 opacity-0'}`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            <MicroPill icon="🌾" label="B1 Tiamina" val={vitB1} unit="mg" />
            <MicroPill icon="🥛" label="B2 Riboflav." val={vitB2} unit="mg" />
            <MicroPill icon="🥩" label="B3 Niacina" val={vitB3} unit="mg" />
            <MicroPill icon="🐟" label="B6" val={vitB6} unit="mg" />
            <MicroPill icon="🥚" label="B12" val={vitB12} unit="µg" />
            <MicroPill icon="☀️" label="Vit. D" val={vitD} unit="µg" />
            <MicroPill icon="🥦" label="Folati" val={folate} unit="µg" />
          </div>
        </div>
      </div>
      <MealSection id="colazione" title="Colazione" subtitle="Inizia bene la giornata" icon="☀️" colorClass="bg-[var(--meal-col)]"
        items={diary.colazione || []} foods={foods} totalKcal={mealTotals.colazione}
        collapsed={collapsedMeals.colazione} onToggle={() => toggleMeal('colazione')}
        onUpdateQty={(idx: number, qty: number) => onUpdateQty('colazione', idx, qty)}
        onRemoveItem={(idx: number) => onRemoveItem('colazione', idx)}
        onSearchSelect={(food: Food) => onSearchSelect(food, 'colazione')} />
      <MealSection id="pranzo" title="Pranzo" subtitle="Il pasto principale" icon="🌿" colorClass="bg-[var(--meal-pran)]"
        items={diary.pranzo || []} foods={foods} totalKcal={mealTotals.pranzo}
        collapsed={collapsedMeals.pranzo} onToggle={() => toggleMeal('pranzo')}
        onUpdateQty={(idx: number, qty: number) => onUpdateQty('pranzo', idx, qty)}
        onRemoveItem={(idx: number) => onRemoveItem('pranzo', idx)}
        onSearchSelect={(food: Food) => onSearchSelect(food, 'pranzo')} />
      <MealSection id="cena" title="Cena" subtitle="Chiudi bene la serata" icon="🌙" colorClass="bg-[var(--meal-cena)]"
        items={diary.cena || []} foods={foods} totalKcal={mealTotals.cena}
        collapsed={collapsedMeals.cena} onToggle={() => toggleMeal('cena')}
        onUpdateQty={(idx: number, qty: number) => onUpdateQty('cena', idx, qty)}
        onRemoveItem={(idx: number) => onRemoveItem('cena', idx)}
        onSearchSelect={(food: Food) => onSearchSelect(food, 'cena')} />
    </div>
  );
}

// ─── StatsPage ────────────────────────────────────────────────────────────────

function StatCard({ title, val, sub }: any) {
  return (
    <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-sm)] border border-[var(--border)]">
      <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mb-2.5">{title}</div>
      <div className="text-3xl font-bold tracking-tight">{val}</div>
      <div className="text-[0.78rem] text-[var(--text-soft)] mt-0.5">{sub}</div>
    </div>
  );
}

function StatsPage({ currentDate, goal, foods }: { currentDate: string, goal: number, foods: Food[] }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = d.toISOString().slice(0, 10);
    const diary = getDiary(ds);
    let kcal = 0, prot = 0, carb = 0, fat = 0;
    ['colazione', 'pranzo', 'cena'].forEach(meal => {
      (diary[meal] || []).forEach((entry: any) => {
        const food = foods.find(f => f.id === entry.foodId);
        if (!food) return;
        kcal += food.kcal * entry.qty / 100; prot += food.proteins * entry.qty / 100;
        carb += food.carbs * entry.qty / 100; fat += food.fats * entry.qty / 100;
      });
    });
    days.push({ date: ds, label: d.toLocaleDateString('it-IT', { weekday: 'short', day: 'numeric', month: 'short' }), kcal: Math.round(kcal), prot: +prot.toFixed(1), carb: +carb.toFixed(1), fat: +fat.toFixed(1) });
  }

  const logged = days.filter(d => d.kcal > 0);
  const avgKcal = logged.length ? Math.round(logged.reduce((s, d) => s + d.kcal, 0) / logged.length) : 0;
  const avgProt = logged.length ? (logged.reduce((s, d) => s + d.prot, 0) / logged.length).toFixed(1) : 0;
  const bestDay = logged.length ? logged.reduce((a, b) => Math.abs(b.kcal - goal) < Math.abs(a.kcal - goal) ? b : a) : null;
  const maxKcal = Math.max(...days.map(d => d.kcal), 1);

  const kcalChartData = {
    labels: days.map(d => d.label.slice(0, 6)),
    datasets: [
      { label: 'Calorie', data: days.map(d => d.kcal), backgroundColor: days.map(d => d.date === currentDate ? 'rgba(232,168,124,0.9)' : 'rgba(232,168,124,0.4)'), borderColor: 'rgba(232,168,124,1)', borderWidth: 1.5, borderRadius: 8 },
      { label: 'Obiettivo', data: days.map(() => goal), type: 'line' as const, borderColor: 'rgba(44,42,39,0.25)', borderWidth: 1.5, borderDash: [4, 4], pointRadius: 0, fill: false },
    ]
  };

  const macroChartData = {
    labels: days.map(d => d.label.slice(0, 6)),
    datasets: [
      { label: 'Proteine (g)', data: days.map(d => d.prot), borderColor: '#85C1AE', backgroundColor: 'rgba(133,193,174,0.1)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Carboidrati (g)', data: days.map(d => d.carb), borderColor: '#F0C987', backgroundColor: 'rgba(240,201,135,0.1)', fill: true, tension: 0.4, pointRadius: 3 },
      { label: 'Grassi (g)', data: days.map(d => d.fat), borderColor: '#C9A9D4', backgroundColor: 'rgba(201,169,212,0.1)', fill: true, tension: 0.4, pointRadius: 3 },
    ]
  };

  const chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { x: { grid: { display: false }, ticks: { font: { family: 'Jost', size: 11 } } }, y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { font: { family: 'Jost', size: 11 } } } } };
  const macroChartOptions = { ...chartOptions, plugins: { legend: { labels: { font: { family: 'Jost', size: 11 }, boxWidth: 12, padding: 16 } } } };

  return (
    <div className="space-y-7">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Andamento</h1>
        <p className="text-sm text-[var(--text-soft)]">Ultimi 7 giorni — statistiche e tendenze</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <StatCard title="Media Calorica" val={avgKcal || '—'} sub="kcal / giorno (7gg)" />
        <StatCard title="Giorni Registrati" val={logged.length} sub="degli ultimi 7 giorni" />
        <StatCard title="Miglior Giorno" val={bestDay ? `${bestDay.kcal} kcal` : '—'} sub={bestDay ? bestDay.label : '—'} />
        <StatCard title="Media Proteine" val={avgProt || '—'} sub="g / giorno (7gg)" />
      </div>
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-7 shadow-[var(--shadow-sm)] border border-[var(--border)]">
        <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mb-5">Calorie giornaliere — ultimi 7 giorni</div>
        <div className="h-[220px] relative"><Bar data={kcalChartData} options={chartOptions} /></div>
      </div>
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-7 shadow-[var(--shadow-sm)] border border-[var(--border)]">
        <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mb-5">Macronutrienti giornalieri — ultimi 7 giorni</div>
        <div className="h-[220px] relative"><Line data={macroChartData} options={macroChartOptions} /></div>
      </div>
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] p-7 shadow-[var(--shadow-sm)] border border-[var(--border)]">
        <div className="text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] mb-5">Calorie per giorno</div>
        {days.map(d => (
          <div key={d.date} className="flex items-center gap-3 py-2 border-b border-[var(--border)] last:border-0">
            <div className="text-[0.78rem] font-semibold w-8 shrink-0">{d.label.slice(0, 3)}</div>
            <div className="flex-1 bg-[var(--bg)] rounded-full h-1.5 overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-[var(--accent-col)] to-[#F0A060] wdr-bar" style={{ width: `${d.kcal ? (d.kcal / maxKcal * 100) : 0}%` }}></div>
            </div>
            <div className={`text-xs font-bold min-w-[60px] text-right ${d.date === currentDate ? 'text-[var(--text)]' : 'text-[var(--text-soft)]'}`}>{d.kcal || '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DatabasePage ─────────────────────────────────────────────────────────────

const DB_PAGE_SIZE = 20;

function DatabasePage({ foods, onEdit, onAddCustom, onAddRecipe, onDelete }: any) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCat, setFilterCat] = useState('Tutti');
  const [page, setPage] = useState(0);

  const categories = useMemo(() => {
    const cats = new Set(foods.map((f: Food) => f.category));
    return ['Tutti', 'I miei alimenti', ...Array.from(cats)].sort((a, b) => a === 'Tutti' ? -1 : a === 'I miei alimenti' ? -1 : (a as string).localeCompare(b as string, 'it'));
  }, [foods]);

  const filteredFoods = useMemo(() => foods.filter((f: Food) => {
    if (filterCat === 'I miei alimenti') { if (!f.isCustom && !f.isRecipe) return false; }
    else if (filterCat !== 'Tutti' && f.category !== filterCat) return false;
    if (searchQuery && !f.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [foods, filterCat, searchQuery]);

  const totalPages = Math.ceil(filteredFoods.length / DB_PAGE_SIZE);
  const currentFoods = filteredFoods.slice(page * DB_PAGE_SIZE, (page + 1) * DB_PAGE_SIZE);
  const handlePageChange = (p: number) => { setPage(Math.max(0, Math.min(p, totalPages - 1))); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Database Alimenti</h1>
          <p className="text-sm text-[var(--text-soft)]">Oltre 900 alimenti dalla Banca Dati CREA + i tuoi alimenti</p>
        </div>
        <div className="flex gap-2">
          <button onClick={onAddCustom} className="px-4 py-2 bg-[var(--text)] text-white rounded-[var(--radius-sm)] text-sm font-semibold hover:bg-[#1a1a1a] transition-colors shadow-[var(--shadow-sm)]">+ Alimento</button>
          <button onClick={onAddRecipe} className="px-4 py-2 bg-[var(--accent-col)] text-[var(--text)] rounded-[var(--radius-sm)] text-sm font-semibold hover:opacity-90 transition-colors shadow-[var(--shadow-sm)]">+ Ricetta</button>
        </div>
      </div>
      <div className="relative mb-5">
        <input type="text" placeholder="Cerca nel database…" value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
          className="w-full py-3 pl-4 pr-11 rounded-[var(--radius-md)] border-[1.5px] border-[var(--border)] font-sans text-sm bg-[var(--surface)] outline-none focus:border-[var(--accent-col)] focus:ring-[3px] focus:ring-[rgba(232,168,124,0.15)] shadow-[var(--shadow-sm)] transition-all" />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-soft)] text-sm pointer-events-none">🔍</span>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {categories.map(c => (
          <button key={c as string} onClick={() => { setFilterCat(c as string); setPage(0); }}
            className={`px-3.5 py-1.5 rounded-full border-[1.5px] font-sans text-xs font-medium transition-colors ${filterCat === c ? 'bg-[var(--text)] text-white border-[var(--text)]' : 'bg-[var(--surface)] text-[var(--text-soft)] border-[var(--border)] hover:bg-[var(--bg)]'}`}>
            {c as string}
          </button>
        ))}
      </div>
      <div className="bg-[var(--surface)] rounded-[var(--radius-lg)] shadow-[var(--shadow-sm)] border border-[var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                {['Alimento', 'Categoria', 'kcal', 'P (g)', 'C (g)', 'G (g)', ''].map((h, i) => (
                  <th key={i} className={`p-3 px-4 text-[0.7rem] font-semibold tracking-widest uppercase text-[var(--text-soft)] bg-[var(--surface2)] border-b border-[var(--border)] ${i >= 3 && i <= 5 ? 'text-right hidden sm:table-cell' : i === 2 ? 'text-right' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentFoods.length === 0 ? (
                <tr><td colSpan={7} className="p-6 text-center text-[var(--text-soft)] text-sm">Nessun risultato</td></tr>
              ) : currentFoods.map((f: Food) => (
                <tr key={f.id} className="hover:bg-[var(--bg)] transition-colors border-b border-[var(--border)] last:border-0">
                  <td className="p-3 px-4 text-sm font-medium max-w-[200px] truncate">
                    {f.name}
                    {f.isCustom && <span className="ml-2 text-[0.6rem] bg-[var(--accent-col)] text-white px-1.5 py-0.5 rounded-sm align-middle">Custom</span>}
                    {f.isRecipe && <span className="ml-2 text-[0.6rem] bg-[var(--text)] text-white px-1.5 py-0.5 rounded-sm align-middle">Ricetta</span>}
                  </td>
                  <td className="p-3 px-4 text-xs text-[var(--text-soft)]">{f.category}</td>
                  <td className="p-3 px-4 text-sm font-semibold text-right">{f.kcal}</td>
                  <td className="p-3 px-4 text-sm text-right hidden sm:table-cell">{f.proteins}</td>
                  <td className="p-3 px-4 text-sm text-right hidden sm:table-cell">{f.carbs}</td>
                  <td className="p-3 px-4 text-sm text-right hidden sm:table-cell">{f.fats}</td>
                  <td className="p-3 px-4 text-right whitespace-nowrap">
                    <button onClick={() => onEdit(f)} className="px-3 py-1 rounded-full border-[1.5px] border-[var(--border)] text-xs font-semibold text-[var(--text-soft)] hover:bg-[var(--accent-col)] hover:text-white hover:border-[var(--accent-col)] transition-colors mr-2">Modifica</button>
                    {(f.isCustom || f.isRecipe) && (
                      <button onClick={() => onDelete(f.id)} className="px-3 py-1 rounded-full border-[1.5px] border-[var(--border)] text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger)] hover:text-white hover:border-[var(--danger)] transition-colors">Elimina</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 p-4 bg-[var(--surface2)] border-t border-[var(--border)]">
            <button onClick={() => handlePageChange(page - 1)} disabled={page === 0} className="px-3.5 py-1.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] text-sm font-medium bg-[var(--surface)] text-[var(--text-soft)] hover:bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">‹</button>
            <span className="text-sm text-[var(--text-soft)]">Pagina {page + 1} di {totalPages}</span>
            <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages - 1} className="px-3.5 py-1.5 rounded-[var(--radius-sm)] border-[1.5px] border-[var(--border)] text-sm font-medium bg-[var(--surface)] text-[var(--text-soft)] hover:bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors">›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<'diary' | 'stats' | 'database'>('diary');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().slice(0, 10));
  const [diary, setDiary] = useState(getDiary(currentDate));
  const [goal, setGoal] = useState(getGoal());
  const [foods, setFoods] = useState<Food[]>(getFoods());
  const [qtyModalState, setQtyModalState] = useState<{ isOpen: boolean, food: Food | null, meal: string | null }>({ isOpen: false, food: null, meal: null });
  const [editModalState, setEditModalState] = useState<{ isOpen: boolean, food: Food | null }>({ isOpen: false, food: null });
  const [customFoodModalOpen, setCustomFoodModalOpen] = useState(false);
  const [recipeModalOpen, setRecipeModalOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => { setDiary(getDiary(currentDate)); }, [currentDate]);
  useEffect(() => { saveDiary(currentDate, diary); }, [diary, currentDate]);
  useEffect(() => { saveGoal(goal); }, [goal]);

  const refreshFoods = () => setFoods(getFoods());
  const showToast = (msg: string) => { setToastMsg(msg); setTimeout(() => setToastMsg(null), 2200); };

  const handleAddFoodToMeal = (food: Food, meal: string, qty: number) => {
    setDiary(prev => ({ ...prev, [meal]: [...(prev[meal as keyof typeof prev] || []), { foodId: food.id, qty }] }));
    showToast(`✓ ${food.name} aggiunto a ${meal.charAt(0).toUpperCase() + meal.slice(1)}`);
  };

  const handleUpdateItemQty = (meal: string, idx: number, qty: number) => {
    setDiary(prev => { const newMeal = [...prev[meal as keyof typeof prev]]; newMeal[idx].qty = qty; return { ...prev, [meal]: newMeal }; });
  };

  const handleRemoveItem = (meal: string, idx: number) => {
    setDiary(prev => { const newMeal = [...prev[meal as keyof typeof prev]]; newMeal.splice(idx, 1); return { ...prev, [meal]: newMeal }; });
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans pb-20">
      <nav className="sticky top-0 z-50 bg-[rgba(245,243,239,0.88)] backdrop-blur-md border-b border-[var(--border)] flex items-center justify-between px-6 h-16">
        <div className="font-bold text-lg tracking-tight flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--accent-col)] inline-block"></span>
          My<span className="font-light text-[var(--text-soft)]">Meal</span>
        </div>
        <div className="flex gap-1">
          {(['diary', 'stats', 'database'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${activeTab === tab ? 'bg-[var(--text)] text-white' : 'text-[var(--text-soft)] hover:bg-[var(--border)] hover:text-[var(--text)]'}`}>
              {tab === 'diary' ? 'Diario' : tab === 'stats' ? 'Andamento' : 'Database'}
            </button>
          ))}
        </div>
        <div className="text-sm text-[var(--text-soft)] flex items-center gap-1.5 hidden sm:flex">
          <input type="date" value={currentDate} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setCurrentDate(e.target.value)}
            className="border-none bg-transparent text-[var(--text-soft)] font-sans text-sm cursor-pointer outline-none" />
        </div>
      </nav>

      <main className="flex-1 w-full max-w-4xl mx-auto p-6 animate-fadeIn">
        {activeTab === 'diary' && (
          <DiaryPage diary={diary} foods={foods} goal={goal} setGoal={setGoal}
            onUpdateQty={handleUpdateItemQty} onRemoveItem={handleRemoveItem}
            onAddClick={(meal: string) => setQtyModalState({ isOpen: true, food: null, meal })}
            onSearchSelect={(food: Food, meal: string) => setQtyModalState({ isOpen: true, food, meal })} />
        )}
        {activeTab === 'stats' && <StatsPage currentDate={currentDate} goal={goal} foods={foods} />}
        {activeTab === 'database' && (
          <DatabasePage foods={foods}
            onEdit={(food: Food) => setEditModalState({ isOpen: true, food })}
            onAddCustom={() => setCustomFoodModalOpen(true)}
            onAddRecipe={() => setRecipeModalOpen(true)}
            onDelete={(id: string) => {
              if (confirm('Sei sicuro di voler eliminare questo alimento?')) {
                deleteCustomFoodOrRecipe(id); refreshFoods(); showToast('Alimento eliminato');
              }
            }} />
        )}
      </main>

      {qtyModalState.isOpen && qtyModalState.food && qtyModalState.meal && (
        <QtyModal food={qtyModalState.food} meal={qtyModalState.meal}
          onClose={() => setQtyModalState({ isOpen: false, food: null, meal: null })}
          onAdd={(qty) => { handleAddFoodToMeal(qtyModalState.food!, qtyModalState.meal!, qty); setQtyModalState({ isOpen: false, food: null, meal: null }); }} />
      )}
      {editModalState.isOpen && editModalState.food && (
        <EditModal food={editModalState.food}
          onClose={() => setEditModalState({ isOpen: false, food: null })}
          onSave={(overrides) => { localStorage.setItem('food_override_' + editModalState.food!.id, JSON.stringify(overrides)); refreshFoods(); setEditModalState({ isOpen: false, food: null }); showToast('✓ Alimento aggiornato'); }} />
      )}
      {customFoodModalOpen && (
        <CustomFoodModal onClose={() => setCustomFoodModalOpen(false)}
          onSave={(food: Food) => { saveCustomFood(food); refreshFoods(); setCustomFoodModalOpen(false); showToast('✓ Alimento personalizzato creato'); }} />
      )}
      {recipeModalOpen && (
        <RecipeModal foods={foods} onClose={() => setRecipeModalOpen(false)}
          onSave={(recipe: Food) => { saveRecipe(recipe); refreshFoods(); setRecipeModalOpen(false); showToast('✓ Ricetta creata'); }} />
      )}
      {toastMsg && <Toast message={toastMsg} />}
    </div>
  );
}
