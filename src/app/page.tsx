import { Hero } from "@/components/Hero";
import { HomeIntro } from "@/components/HomeIntro";
import { HomeProductsContact } from "@/components/HomeProductsContact";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeIntro />
      <HomeProductsContact />
    </>
  );
}
