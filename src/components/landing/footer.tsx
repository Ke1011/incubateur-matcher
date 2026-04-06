export function Footer() {
  return (
    <footer className="border-t border-bg-border px-5 py-10">
      <div className="mx-auto flex max-w-[800px] flex-col items-center gap-2 text-center sm:flex-row sm:justify-between">
        <span className="text-[13px] text-text-muted">
          incub<span className="text-accent-green">.</span>match · Un outil par{" "}
          <a
            href="https://www.linkedin.com/in/kemil-taamma/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            Kemil Taamma
          </a>
        </span>
        <div className="flex gap-4 text-[13px] text-text-muted">
          <a
            href="https://kemil.fr/book"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-secondary transition-colors"
          >
            Me faire accompagner
          </a>
        </div>
      </div>
    </footer>
  )
}
