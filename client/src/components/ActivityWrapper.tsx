import cn from '../utils/utils';

export default function ActivityWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn('w-full lg:max-w-7xl m-auto', className)}>{children}</div>;
}
