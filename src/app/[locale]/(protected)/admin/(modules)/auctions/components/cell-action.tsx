'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { deleteAuction } from '../actions/auction-actions';
import { AuctionColumn } from './columns';
import DeleteConfirmationDialog from '@/components/core/admin/delete-confirmation-dialog';
import { useTranslations } from 'next-intl';

interface CellActionProps {
  data: AuctionColumn;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scopedT = useTranslations('components.auctions');

  const onDelete = () => {
    setLoading(true);
    deleteAuction({ id: data.id })
      .then((result) => {
        if (result.error) {
          toast.error(scopedT('hasError'));
          setLoading(false);
          setOpen(false);
          router.refresh();
        } else {
          toast.success(scopedT('auctionDeleted'));
          setLoading(false);
          setOpen(false);
          router.push('/admin/auctions');
          router.refresh();
        }
      })
      .catch((error) => {
        toast.error(error.message || scopedT('deleteFailed'));
        setLoading(false);
        setOpen(false);
        router.refresh();
      });
  };

  return (
    <div className='flex justify-center space-x-2'>
      <DeleteConfirmationDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-secondary'
              onClick={() => router.push(`/admin/auctions/${data.id}`)}
            >
              <Pencil className='h-4 w-4 text-foreground' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{scopedT('update')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              size='icon'
              className='hover:bg-secondary'
              onClick={() => setOpen(true)}
            >
              <Trash2 className='h-4 w-4 text-foreground' />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{scopedT('delete')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
