const QueryErrorState = ({
  title = "Something went wrong",
  message = "We could not load this content. Please try again.",
  onRetry,
}) => {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center rounded-2xl border border-primary/10 bg-surface p-8 text-center">
      <p className="text-lg font-semibold text-primary">{title}</p>
      <p className="mt-2 max-w-md text-sm text-muted">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 border border-primary/15 px-5 py-2 text-xs font-semibold uppercase tracking-wider text-primary transition hover:border-accent hover:text-accent"
        >
          Try again
        </button>
      )}
    </div>
  );
};

export default QueryErrorState;
