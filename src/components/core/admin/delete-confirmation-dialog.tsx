import React, { useTransition } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  loading,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  defaultToast?: boolean;
  toastMessage?: string;
  loading: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const scopedT = useTranslations('deleteConfirmationDialog');

  const handleConfirm = async () => {
    if (!onConfirm) {
      onClose();
      return;
    }
    await onConfirm();

    onClose();
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{scopedT('areYouSure')}</AlertDialogTitle>
          <AlertDialogDescription>
            {scopedT('thisActionCannotBeUndone')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='gap-1'>
          <AlertDialogCancel disabled={loading} onClick={onClose}>
            {scopedT('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className={isPending ? 'pointer-events-none' : ''}
            onClick={() => startTransition(handleConfirm)}
          >
            {isPending && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
            {isPending ? scopedT('deleting') : scopedT('continue')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmationDialog;
