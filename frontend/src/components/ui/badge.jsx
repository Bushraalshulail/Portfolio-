export function Badge({ className = "", children, ...props }) {
  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full bg-teal-100 text-teal-700 ${className}`} {...props}>
      {children}
    </span>
  )
}
