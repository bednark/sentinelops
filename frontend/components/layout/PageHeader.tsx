type PageHeaderProps = {
  title: string;
  description?: string;
};

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="space-y-2">
      <h1 className="text-2xl font-semibold text-slate-50">
        {title}
      </h1>
      {description ? (
        <p className="text-sm text-slate-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}
