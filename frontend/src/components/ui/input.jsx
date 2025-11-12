export function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full px-3 py-2 rounded-lg border outline-none focus:ring-2 focus:ring-teal-400 ${className}`}
      {...props}
    />
  )
}
