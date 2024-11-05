import db from '@/server/db';

import { AuctionClient } from './components/client';
import { AuctionColumn } from './components/columns';
import PageContainer from '@/components/core/admin/dashboard/page-container';

const AuctionsPage = async () => {
  const auctions = await db.auction.findMany({});

  const formattedAuctions: AuctionColumn[] = auctions.map((item) => ({
    id: item.id,
    title: item.title,
    productIds: item.productIds,
    endAt: item.endAt.toISOString(),
    status: item.status,
  }));

  return (
    <PageContainer>
      <div className='space-y-4'>
        <AuctionClient data={formattedAuctions} />
      </div>
    </PageContainer>
  );
};

export default AuctionsPage;
