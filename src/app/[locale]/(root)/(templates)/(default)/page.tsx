import Categories from '@/components/templates/default/Products';
import Hero from '@/components/templates/default/Hero';

export default function Home() {
  return (
    <main>
      <Hero />
      <div className='max-w-7xl mx-auto'>
        <Categories />
      </div>
    </main>
  );
}
