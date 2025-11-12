export function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`w-full bg-gradient-to-r from-[#2EC4B6] to-[#1CA89E] text-white font-semibold py-3 rounded-xl text-center shadow-lg hover:opacity-90 transition-all duration-200 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
