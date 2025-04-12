import { Search } from "lucide-react";

function NoUniversities() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
        <Search className="h-10 w-10 text-primary" />
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-gray-800">No Matching Universities Found</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        We couldn&apos;t find any universities matching your search criteria. Try adjusting your filters
        or search for something else.
      </p>
    </div>
  );
}

export default NoUniversities;