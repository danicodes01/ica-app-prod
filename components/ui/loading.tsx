interface LoadingProps {
  loadingData: string;
}

export default function Loading({loadingData}: LoadingProps) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <span className="text-[#888] text-sm">Loading{loadingData}...</span>
      </div>
    );
  }