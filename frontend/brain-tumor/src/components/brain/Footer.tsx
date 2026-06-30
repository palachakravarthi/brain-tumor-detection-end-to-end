export function Footer() {
  const stack = ["TensorFlow", "FastAPI", "Python", "Supabase", "Lovable"];
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-bold text-foreground">Brain Tumor Detection</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Created by <span className="font-semibold text-foreground">Uppu Palachakravarthi</span>
            </p>
            <p className="text-sm text-muted-foreground">AI ML Internship Project</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground">Technology Stack</h4>
            <div className="mt-3 flex flex-wrap gap-2">
              {stack.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Brain Tumor Detection · For research and educational use only.
        </div>
      </div>
    </footer>
  );
}
