'use client';

import { Trash } from 'lucide-react';
import Image from 'next/image';
import { UploadDropzone } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';
import { toast } from 'sonner';

import deleteFiles from './delete-files';
import { Button } from '@/components/ui/button';

interface UploadFileResponse {
  key: string;
  url: string;
  name?: string;
}

interface FileUploadProps {
  onChange: (value: UploadFileResponse[]) => void;
  onRemove: (value: string) => void;
  value?: UploadFileResponse[];
  endpoint: 'imageUploader';
}

export const FileUpload = ({
  onChange,
  onRemove,
  value,
  endpoint,
}: FileUploadProps) => {
  return (
    <>
      {value ? (
        <div className='pb-5 flex flex-wrap gap-4'>
          {value.map((item, index) => (
            <div
              key={`${item.key}-${index}`}
              className='relative h-[200px] w-[200px] overflow-hidden rounded-md'
            >
              <div className='absolute right-2 top-2 z-10'>
                <Button
                  type='button'
                  onClick={async () => {
                    onRemove(item.url);
                    await deleteFiles(item.key);
                  }}
                  variant='default'
                  size='sm'
                >
                  <Trash className='h-4 w-4' />
                </Button>
              </div>
              {item.url ? (
                <Image
                  src={item.url}
                  alt={item.name ?? 'Image'}
                  fill
                  priority
                  sizes='(max-width: 768px) 100vw, 200px' // Use full width on mobile, 200px on larger screens
                  className='rounded-md object-cover'
                />
              ) : (
                <div className='h-[200px] w-[200px] bg-gray-200 rounded-md flex items-center justify-center'>
                  <span>Image not available</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null}
      <UploadDropzone<OurFileRouter>
        className='ut-label:text-sm ut-allowed-content:ut-uploading:text-red-300 py-2 dark:bg-zinc-800'
        endpoint={endpoint}
        config={{ mode: 'auto' }}
        onClientUploadComplete={(res: any) => {
          onChange(res!);
        }}
        onUploadError={(error: Error) => {
          toast.error(error.message);
        }}
      />
    </>
  );
};
