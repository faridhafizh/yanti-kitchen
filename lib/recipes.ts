export type Recipe = {
  id: number;
  titleEn: string;
  titleId: string;
  descEn: string;
  descId: string;
  emoji: string;
};

export const recipes: Recipe[] = [
  {
    id: 1,
    titleEn: "Nasi Goreng Spesial",
    titleId: "Nasi Goreng Spesial",
    descEn: "Classic Indonesian fried rice with sunny-side up egg and chicken satay.",
    descId: "Nasi goreng klasik Indonesia dengan telur mata sapi dan sate ayam.",
    emoji: "🍳",
  },
  {
    id: 2,
    titleEn: "Klepon",
    titleId: "Klepon",
    descEn: "Sweet rice cake balls filled with molten palm sugar and coated in grated coconut.",
    descId: "Kue beras manis berisi gula aren cair dan dibalut parutan kelapa.",
    emoji: "🥥",
  },
  {
    id: 3,
    titleEn: "Beef Rendang",
    titleId: "Rendang Sapi",
    descEn: "Rich, slow-cooked beef stew with coconut milk and complex spices.",
    descId: "Rebusan daging sapi yang kaya rasa, dimasak perlahan dengan santan dan rempah kompleks.",
    emoji: "🥩",
  },
  {
    id: 4,
    titleEn: "Martabak Manis",
    titleId: "Martabak Manis",
    descEn: "Thick, sweet pancake filled with chocolate, cheese, and crushed peanuts.",
    descId: "Pancake tebal manis dengan isian cokelat, keju, dan kacang tanah.",
    emoji: "🥞",
  },
];
