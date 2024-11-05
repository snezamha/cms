import db from '@/server/db';
import { AuctionForm } from './components/AuctionForm';
import { ScrollArea } from '@/components/ui/scroll-area';

const AuctionPage = async ({ params }: { params: { auctionId: string } }) => {
  const auction = await db.auction.findUnique({
    where: {
      id: params.auctionId,
    },
  });

  return (
    <ScrollArea className='h-full'>
      <div className='h-full space-y-4 p-4 md:px-8'>
        <AuctionForm initData={auction} />
      </div>
    </ScrollArea>
  );
};

export default AuctionPage;
