import { HTMLAttributes } from 'react';

interface HeadingProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
}

export const Heading: React.FC<HeadingProps> = ({
  title,
  description,
  ...props
}) => {
  return (
    <div {...props} className='flex flex-col'>
      <h2 className='text-2xl text-primary font-bold tracking-tight'>
        {title}
      </h2>
      {description && (
        <p className='text-sm text-muted-foreground mt-4'>{description}</p>
      )}
    </div>
  );
};
