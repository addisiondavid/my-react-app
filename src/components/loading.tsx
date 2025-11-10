export default function Loading({ small = false }: { small?: boolean }) {
  return (
    <div
      className={
        small
          ? "flex items-center space-x-2"
          : "flex flex-col items-center justify-center p-6"
      }
    >
      <div
        aria-hidden="true"
        className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-300"
      />
      {!small && <div className="text-gray-400 mt-2">Loading…</div>}
    </div>
  );
}
