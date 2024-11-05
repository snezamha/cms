import { AuctionForm } from '../[auctionId]/components/AuctionForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const AuctionPage = async () => {
  return (
    <ScrollArea className='h-full'>
      <div className='h-full space-y-4 p-4 md:px-8'>
        <AuctionForm />
      </div>
    </ScrollArea>
  );
};

export default AuctionPage;
