export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="
  w-full py-2 rounded-xl 
  bg-indigo-500 hover:bg-indigo-600 
  transition-all duration-200 
  active:scale-95
  shadow-md hover:shadow-lg
  "
    >
      {children}
    </button>
  );
}