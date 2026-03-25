export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="relative px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 
                 hover:scale-105 transition-all duration-200 shadow-md"
    >
      {children}
    </button>
  );
}