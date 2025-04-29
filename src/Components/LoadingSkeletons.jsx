import { Card, CardHeader, CardContent } from '@/Components/ui/card';
import { Skeleton } from '@/Components/ui/skeleton';

const LoadingSkeletons = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="mb-4">
        <CardHeader className="pb-4">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-1/4 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default LoadingSkeletons;