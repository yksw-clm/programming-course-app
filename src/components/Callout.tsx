export function Callout({ children, type = "info" }: { children: React.ReactNode, type?: "info" | "warn" }) {
  const styles = {
    default: "bg-gray-100 border-gray-300",
    info: "bg-blue-50 border-blue-500 text-blue-900",
    warn: "bg-yellow-50 border-yellow-500 text-yellow-900",
  };

  return (
    <div className={`p-4 my-4 border-l-4 rounded ${styles[type] || styles.default}`}>
      {children}
    </div>
  );
}