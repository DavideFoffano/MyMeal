// ─── Types & Database ───────────────────────────────────────────────────────

export interface Food {
  id: string;
  name: string;
  category: string;
  portion: number;
  kcal: number;
  proteins: number;
  carbs: number;
  fats: number;
  fiber: number;
  sodium: number;
  potassium: number;
  calcium: number;
  iron: number;
  vitA: number;
  vitC: number;
  vitB1: number;
  vitB2: number;
  vitB3: number;
  vitB6: number;
  vitB12: number;
  vitD: number;
  vitE: number;
  folate: number;
  isCustom?: boolean;
  isRecipe?: boolean;
  ingredients?: { foodId: string; weight: number }[];
}

export const initialDb: Food[] = [
  { id: "000020", name: "Farro perlato, crudo", category: "Cereali e derivati", portion: 80, kcal: 353, proteins: 14.6, carbs: 69.3, fats: 2.4, fiber: 6.5, sodium: 10, potassium: 407, calcium: 35, iron: 1.9, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 31 },
  { id: "000100", name: "Riso, brillato", category: "Cereali e derivati", portion: 80, kcal: 334, proteins: 6.7, carbs: 80.4, fats: 0.4, fiber: 1, sodium: 5, potassium: 92, calcium: 24, iron: 0.8, vitA: 0, vitC: 0, vitB1: 0.11, vitB2: 0.03, vitB3: 1.3, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "000800", name: "Pasta di semola", category: "Cereali e derivati", portion: 80, kcal: 341, proteins: 13.5, carbs: 72.7, fats: 1.2, fiber: 1.7, sodium: 4, potassium: 192, calcium: 22, iron: 1.4, vitA: 0, vitC: 0, vitB1: 0.1, vitB2: 0.2, vitB3: 2.5, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "000530", name: "Pane bianco", category: "Cereali e derivati", portion: 50, kcal: 268, proteins: 8.1, carbs: 59.5, fats: 0.5, fiber: 3.8, sodium: 293, potassium: 0, calcium: 17, iron: 0.7, vitA: 0, vitC: 0, vitB1: 0.06, vitB2: 0.06, vitB3: 0.8, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "004000", name: "Ceci, secchi", category: "Legumi", portion: 50, kcal: 343, proteins: 20.9, carbs: 46.9, fats: 6.3, fiber: 13.6, sodium: 6, potassium: 881, calcium: 142, iron: 6.4, vitA: 10, vitC: 0, vitB1: 0.3, vitB2: 0.1, vitB3: 2.5, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 312 },
  { id: "004100", name: "Fagioli", category: "Legumi", portion: 50, kcal: 326, proteins: 23.6, carbs: 47.5, fats: 2, fiber: 17.5, sodium: 4, potassium: 1445, calcium: 135, iron: 8, vitA: 3, vitC: 3, vitB1: 0.4, vitB2: 0.1, vitB3: 2.3, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "005110", name: "Broccolo a testa, crudo", category: "Verdure e ortaggi", portion: 200, kcal: 33, proteins: 3, carbs: 3.1, fats: 0.4, fiber: 3.1, sodium: 12, potassium: 340, calcium: 28, iron: 0.8, vitA: 2, vitC: 54, vitB1: 0.04, vitB2: 0.12, vitB3: 1.8, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 125 },
  { id: "005150", name: "Carote, crude", category: "Verdure e ortaggi", portion: 200, kcal: 41, proteins: 1.1, carbs: 7.6, fats: 0.2, fiber: 3.1, sodium: 95, potassium: 220, calcium: 44, iron: 0.7, vitA: 1148, vitC: 4, vitB1: 0.04, vitB2: 0.04, vitB3: 0.7, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "005410", name: "Lattuga, fresca", category: "Verdure e ortaggi", portion: 80, kcal: 22, proteins: 1.8, carbs: 2.2, fats: 0.4, fiber: 1.5, sodium: 9, potassium: 240, calcium: 45, iron: 0.8, vitA: 229, vitC: 6, vitB1: 0.05, vitB2: 0.18, vitB3: 0.7, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "006600", name: "Pomodori, da insalata, freschi", category: "Verdure e ortaggi", portion: 200, kcal: 19, proteins: 1.2, carbs: 2.8, fats: 0.2, fiber: 1, sodium: 3, potassium: 290, calcium: 11, iron: 0.4, vitA: 42, vitC: 21, vitB1: 0.03, vitB2: 0.03, vitB3: 0.7, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "005730", name: "Zucchine, crude", category: "Verdure e ortaggi", portion: 200, kcal: 16, proteins: 1.5, carbs: 1.7, fats: 0.1, fiber: 1.2, sodium: 1, potassium: 290, calcium: 18, iron: 0.5, vitA: 6, vitC: 11, vitB1: 0.08, vitB2: 0.12, vitB3: 0.7, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "006500", name: "Patate, crude", category: "Verdure e ortaggi", portion: 200, kcal: 72, proteins: 2, carbs: 16, fats: 0.1, fiber: 1.8, sodium: 7, potassium: 570, calcium: 10, iron: 0.6, vitA: 3, vitC: 16, vitB1: 0.1, vitB2: 0.04, vitB3: 2.5, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 38 },
  { id: "007110", name: "Mele, fresche, senza buccia", category: "Frutta", portion: 150, kcal: 57, proteins: 0.3, carbs: 13.7, fats: 0.1, fiber: 2, sodium: 2, potassium: 125, calcium: 7, iron: 0.3, vitA: 8, vitC: 6, vitB1: 0.02, vitB2: 0.02, vitB3: 0.3, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "007510", name: "Banane, fresche", category: "Frutta", portion: 150, kcal: 76, proteins: 1.2, carbs: 17.4, fats: 0.3, fiber: 1.8, sodium: 1, potassium: 350, calcium: 7, iron: 0.8, vitA: 45, vitC: 16, vitB1: 0.06, vitB2: 0.06, vitB3: 0.7, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "106500", name: "Pollo, petto, crudo", category: "Carni fresche", portion: 100, kcal: 100, proteins: 23.3, carbs: 0, fats: 0.8, fiber: 0, sodium: 33, potassium: 370, calcium: 4, iron: 0.4, vitA: 0, vitC: 0, vitB1: 0.1, vitB2: 0.2, vitB3: 8.3, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "101150", name: "Bovino adulto o vitellone, costata, crudo", category: "Carni fresche", portion: 100, kcal: 140, proteins: 21.3, carbs: 0, fats: 6.1, fiber: 0, sodium: 41, potassium: 313, calcium: 4, iron: 1.3, vitA: 0, vitC: 0, vitB1: 0.1, vitB2: 0.12, vitB3: 4.2, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "110400", name: "Prosciutto cotto", category: "Carni trasformate e conservate", portion: 50, kcal: 138, proteins: 15.7, carbs: 1.7, fats: 7.6, fiber: 0, sodium: 840, potassium: 311, calcium: 6, iron: 0.5, vitA: 0, vitC: 0, vitB1: 0.67, vitB2: 0.12, vitB3: 4.4, vitB6: 0.37, vitB12: 0.09, vitD: 0, vitE: 0.09, folate: 0 },
  { id: "122400", name: "Salmone, fresco", category: "Prodotti della pesca", portion: 150, kcal: 185, proteins: 18.4, carbs: 1, fats: 12, fiber: 0, sodium: 98, potassium: 310, calcium: 27, iron: 0.7, vitA: 13, vitC: 0, vitB1: 0.2, vitB2: 0.15, vitB3: 7, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "123500", name: "Tonno", category: "Prodotti della pesca", portion: 150, kcal: 159, proteins: 21.5, carbs: 0.1, fats: 8.1, fiber: 0, sodium: 43, potassium: 410, calcium: 38, iron: 1.3, vitA: 450, vitC: 0, vitB1: 0.2, vitB2: 0.12, vitB3: 8.5, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "135010", name: "Latte di vacca, pastorizzato, intero", category: "Latte e yogurt", portion: 125, kcal: 64, proteins: 3.3, carbs: 4.9, fats: 3.6, fiber: 0, sodium: 50, potassium: 150, calcium: 119, iron: 0.1, vitA: 37, vitC: 1, vitB1: 0.04, vitB2: 0.18, vitB3: 0.1, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0.07, folate: 9 },
  { id: "150010", name: "Yogurt, da latte intero", category: "Latte e yogurt", portion: 125, kcal: 66, proteins: 3.8, carbs: 4.3, fats: 3.9, fiber: 0, sodium: 48, potassium: 170, calcium: 125, iron: 0.1, vitA: 38, vitC: 1, vitB1: 0.04, vitB2: 0.19, vitB3: 0.11, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0.08, folate: 16 },
  { id: "166000", name: "Parmigiano Reggiano DOP", category: "Formaggi e latticini", portion: 50, kcal: 397, proteins: 32.4, carbs: 0, fats: 29.7, fiber: 0, sodium: 600, potassium: 102, calcium: 1159, iron: 0.2, vitA: 430, vitC: 0, vitB1: 0.03, vitB2: 0.37, vitB3: 0.05, vitB6: 0.06, vitB12: 1.7, vitD: 0, vitE: 0.55, folate: 56 },
  { id: "164820", name: "Mozzarella di vacca", category: "Formaggi e latticini", portion: 100, kcal: 253, proteins: 18.7, carbs: 0.7, fats: 19.5, fiber: 0, sodium: 200, potassium: 145, calcium: 350, iron: 0.4, vitA: 219, vitC: 0, vitB1: 0.03, vitB2: 0.27, vitB3: 0.4, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0.39, folate: 0 },
  { id: "181100", name: "Uova di gallina, intero", category: "Uova", portion: 50, kcal: 128, proteins: 12.4, carbs: 0, fats: 8.7, fiber: 0, sodium: 137, potassium: 133, calcium: 48, iron: 1.5, vitA: 225, vitC: 0, vitB1: 0.09, vitB2: 0.3, vitB3: 0.1, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 51 },
  { id: "009210", name: "Olio di oliva extra vergine", category: "Oli e grassi", portion: 10, kcal: 899, proteins: 0, carbs: 0, fats: 99.9, fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0.2, vitA: 36, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 22.4, folate: 0 },
  { id: "000220", name: "Farina di frumento, tipo 00", category: "Cereali e derivati", portion: 100, kcal: 340, proteins: 11.5, carbs: 73, fats: 1, fiber: 2.5, sodium: 2, potassium: 140, calcium: 18, iron: 0.9, vitA: 0, vitC: 0, vitB1: 0.1, vitB2: 0.04, vitB3: 1.2, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "000230", name: "Farina di frumento, tipo 0", category: "Cereali e derivati", portion: 100, kcal: 341, proteins: 11.5, carbs: 73, fats: 1, fiber: 2.9, sodium: 2, potassium: 140, calcium: 18, iron: 0.9, vitA: 0, vitC: 0, vitB1: 0.25, vitB2: 0.04, vitB3: 1.2, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "000240", name: "Farina di frumento, integrale", category: "Cereali e derivati", portion: 100, kcal: 319, proteins: 11.9, carbs: 67.8, fats: 1.9, fiber: 8.4, sodium: 3, potassium: 337, calcium: 28, iron: 3, vitA: 0, vitC: 0, vitB1: 0.4, vitB2: 0.16, vitB3: 5, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0.4, folate: 0 },
  { id: "000260", name: "Farina di mais", category: "Cereali e derivati", portion: 100, kcal: 362, proteins: 8.7, carbs: 80, fats: 2.7, fiber: 3.1, sodium: 1, potassium: 130, calcium: 6, iron: 1.8, vitA: 67, vitC: 0, vitB1: 0.35, vitB2: 0.1, vitB3: 1.9, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "201500", name: "Zucchero, saccarosio", category: "Dolci", portion: 5, kcal: 392, proteins: 0, carbs: 100, fats: 0, fiber: 0, sodium: 0, potassium: 2, calcium: 1, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "503000", name: "Sale", category: "Prodotti vari", portion: 5, kcal: 0, proteins: 0, carbs: 0, fats: 0, fiber: 0, sodium: 39340, potassium: 0, calcium: 24, iron: 0.3, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "009650", name: "Olio di semi di girasole", category: "Oli e grassi", portion: 10, kcal: 899, proteins: 0, carbs: 0, fats: 99.9, fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 68, folate: 0 },
  { id: "009610", name: "Olio di semi di arachide", category: "Oli e grassi", portion: 10, kcal: 899, proteins: 0, carbs: 0, fats: 99.9, fiber: 0, sodium: 0, potassium: 0, calcium: 0, iron: 0.1, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 19.1, folate: 0 },
  { id: "503100", name: "Lievito di birra, compresso", category: "Prodotti vari", portion: 25, kcal: 56, proteins: 8.4, carbs: 1.1, fats: 1.9, fiber: 6.9, sodium: 16, potassium: 610, calcium: 13, iron: 4.9, vitA: 0, vitC: 0, vitB1: 0.71, vitB2: 1.65, vitB3: 11.2, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 1320 },
  { id: "006670", name: "Pomodori, passata", category: "Verdure e ortaggi", portion: 100, kcal: 36, proteins: 1.5, carbs: 6.5, fats: 0.2, fiber: 1.5, sodium: 16, potassium: 250, calcium: 16, iron: 0.4, vitA: 530, vitC: 8, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "005300", name: "Cipolle, crude", category: "Verdure e ortaggi", portion: 200, kcal: 28, proteins: 1, carbs: 5.7, fats: 0.1, fiber: 1, sodium: 10, potassium: 140, calcium: 25, iron: 0.4, vitA: 3, vitC: 5, vitB1: 0.02, vitB2: 0.03, vitB3: 0.5, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 20 },
  { id: "005000", name: "Aglio", category: "Verdure e ortaggi", portion: 5, kcal: 41, proteins: 8.4, carbs: 8.4, fats: 0.6, fiber: 3.1, sodium: 4, potassium: 310, calcium: 15, iron: 1.2, vitA: 1, vitC: 9, vitB1: 0.23, vitB2: 0.07, vitB3: 0.73, vitB6: 1.29, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  // Nuovi alimenti
  { id: "NEW001", name: "Pasta Barilla (Spaghetti n.5)", category: "Cereali e derivati", portion: 80, kcal: 359, proteins: 13, carbs: 71.2, fats: 2, fiber: 3, sodium: 1, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW002", name: "Yogurt Müller Bianco Dolce", category: "Latte e yogurt", portion: 125, kcal: 91, proteins: 3.5, carbs: 13.2, fats: 2.7, fiber: 0, sodium: 40, potassium: 0, calcium: 120, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW003", name: "Yogurt Müller Mix (con anelli di cioccolato)", category: "Latte e yogurt", portion: 150, kcal: 135, proteins: 3.8, carbs: 18.5, fats: 4.8, fiber: 0.5, sodium: 50, potassium: 0, calcium: 110, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW004", name: "Biscotti Mulino Bianco Macine", category: "Cereali e derivati", portion: 30, kcal: 481, proteins: 6.5, carbs: 64.8, fats: 21, fiber: 3.5, sodium: 240, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW005", name: "Biscotti Mulino Bianco Pan di Stelle", category: "Cereali e derivati", portion: 30, kcal: 483, proteins: 7.5, carbs: 65, fats: 20.5, fiber: 4, sodium: 180, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW006", name: "Nutella Ferrero", category: "Dolci", portion: 15, kcal: 539, proteins: 6.3, carbs: 57.5, fats: 30.9, fiber: 0, sodium: 43, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW007", name: "Lasagne al forno (pronte)", category: "Ricette Italiane", portion: 300, kcal: 160, proteins: 7.5, carbs: 14, fats: 8, fiber: 1.2, sodium: 350, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW008", name: "Spaghetti alla Carbonara (pronti)", category: "Ricette Italiane", portion: 250, kcal: 215, proteins: 8.5, carbs: 24, fats: 9.5, fiber: 1, sodium: 400, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW009", name: "Melanzane alla Parmigiana (pronte)", category: "Ricette Italiane", portion: 250, kcal: 145, proteins: 5.5, carbs: 8, fats: 10, fiber: 2.5, sodium: 380, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW010", name: "Pizza Margherita (surgelata)", category: "Ricette Italiane", portion: 330, kcal: 245, proteins: 10, carbs: 32, fats: 8.5, fiber: 2, sodium: 550, potassium: 0, calcium: 0, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0, vitD: 0, vitE: 0, folate: 0 },
  { id: "NEW011", name: "Latte di Soia (senza zuccheri aggiunti)", category: "Bevande vegetali", portion: 200, kcal: 33, proteins: 3.3, carbs: 0.5, fats: 1.8, fiber: 0.6, sodium: 40, potassium: 120, calcium: 120, iron: 0.4, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0.21, vitB3: 0, vitB6: 0, vitB12: 0.38, vitD: 0.75, vitE: 0, folate: 0 },
  { id: "NEW012", name: "Latte di Mandorla (senza zuccheri aggiunti)", category: "Bevande vegetali", portion: 200, kcal: 24, proteins: 0.5, carbs: 0.1, fats: 2.2, fiber: 0.4, sodium: 50, potassium: 0, calcium: 120, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0.21, vitB3: 0, vitB6: 0, vitB12: 0.38, vitD: 0.75, vitE: 1.8, folate: 0 },
  { id: "NEW013", name: "Latte di Avena (senza zuccheri aggiunti)", category: "Bevande vegetali", portion: 200, kcal: 40, proteins: 0.2, carbs: 6.6, fats: 1.5, fiber: 0.8, sodium: 40, potassium: 0, calcium: 120, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0.21, vitB3: 0, vitB6: 0, vitB12: 0.38, vitD: 0.75, vitE: 0, folate: 0 },
  { id: "NEW014", name: "Latte di Riso (senza zuccheri aggiunti)", category: "Bevande vegetali", portion: 200, kcal: 47, proteins: 0.1, carbs: 9.4, fats: 1, fiber: 0, sodium: 40, potassium: 0, calcium: 120, iron: 0, vitA: 0, vitC: 0, vitB1: 0, vitB2: 0, vitB3: 0, vitB6: 0, vitB12: 0.38, vitD: 0.75, vitE: 0, folate: 0 },
];

// ─── Store (localStorage) ────────────────────────────────────────────────────

const CUSTOM_FOODS_KEY = 'mymeal_custom_foods';
const RECIPES_KEY = 'mymeal_recipes';
const GOAL_KEY = 'mymeal_calorie_goal';

export function getFoods(): Food[] {
  const customFoods = JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) || '[]');
  const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
  const baseDb = initialDb.map(f => {
    const saved = JSON.parse(localStorage.getItem('food_override_' + f.id) || 'null');
    return saved ? { ...f, ...saved } : { ...f };
  });
  return [...baseDb, ...customFoods, ...recipes];
}

export function saveCustomFood(food: Food) {
  const customFoods = JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) || '[]');
  customFoods.push({ ...food, isCustom: true, id: 'CUST_' + Date.now() });
  localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
}

export function saveRecipe(recipe: Food) {
  const recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
  recipes.push({ ...recipe, isRecipe: true, id: 'REC_' + Date.now() });
  localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
}

export function deleteCustomFoodOrRecipe(id: string) {
  if (id.startsWith('CUST_')) {
    let customFoods = JSON.parse(localStorage.getItem(CUSTOM_FOODS_KEY) || '[]');
    customFoods = customFoods.filter((f: Food) => f.id !== id);
    localStorage.setItem(CUSTOM_FOODS_KEY, JSON.stringify(customFoods));
  } else if (id.startsWith('REC_')) {
    let recipes = JSON.parse(localStorage.getItem(RECIPES_KEY) || '[]');
    recipes = recipes.filter((f: Food) => f.id !== id);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
  }
}

export function getDiary(date: string) {
  const raw = localStorage.getItem('diary_' + date);
  return raw ? JSON.parse(raw) : { colazione: [], pranzo: [], cena: [] };
}

export function saveDiary(date: string, diary: any) {
  localStorage.setItem('diary_' + date, JSON.stringify(diary));
}

export function getGoal(): number {
  return parseInt(localStorage.getItem(GOAL_KEY) || '2000', 10);
}

export function saveGoal(goal: number) {
  localStorage.setItem(GOAL_KEY, goal.toString());
}
