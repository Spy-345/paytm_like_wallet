export default function Button({ label, handleClick }) {
  return (
    <button
      className='w-full bg-black text-white rounded-lg my-2 mx-auto'
      onClick={handleClick}
    >
      {label}
    </button>
  );
}
