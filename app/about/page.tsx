import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 max-w-4xl">
      <Card className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm border-stone-200 dark:border-stone-800">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-50">
            About Yanti&apos;s Kitchen
          </CardTitle>
          <CardDescription className="text-lg text-stone-600 dark:text-stone-400">
            A dynamic recipe-sharing platform featuring authentic Indonesian culinary delights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 text-stone-700 dark:text-stone-300 leading-relaxed text-lg px-6 pb-8">
          <p>
            Welcome to <strong>Yanti&apos;s Kitchen</strong>! We are passionate about sharing the rich, diverse, and vibrant flavors of Indonesian cuisine with the world.
          </p>
          <p>
            Our platform serves as a curated collection of authentic recipes passed down through generations, as well as modern interpretations of classic dishes. Whether you are looking for savory main courses, delightful snacks, or traditional cakes and desserts, Yanti&apos;s Kitchen is your go-to destination.
          </p>
          <p>
            We believe that food is more than just sustenance; it is a way to connect with culture, family, and friends. Through detailed guides, ingredient highlights, and step-by-step instructions, our goal is to empower home cooks of all levels to recreate the magic of Indonesian cooking in their own kitchens.
          </p>
          <p>
            Join our community, explore the recipes, and embark on a delicious culinary journey across the Indonesian archipelago!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
