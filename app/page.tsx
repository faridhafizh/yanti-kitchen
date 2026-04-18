import { Hero } from "@/components/Hero";
import { FeaturedRecipes } from "@/components/FeaturedRecipes";

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      <Hero />
      <FeaturedRecipes />
    </div>
  );
}
