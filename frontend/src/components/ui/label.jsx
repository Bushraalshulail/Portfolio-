export function Label({ className = "", children, ...props }) {
  return <label className={`block text-sm font-medium ${className}`} {...props}>{children}</label>
}
