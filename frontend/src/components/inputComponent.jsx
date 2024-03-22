export default function Input({
  placeholder,
  onChange,
  type,
  id,
  name,
  label,
}) {
  return (
    <div>
      <div className='font-semibold'>{label}</div>
      <input
        className='rounded p-2 placeholder:text-slate-700 w-full mt-2 bg-white border border-gray-300 '
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        id={id}
        name={name}
      />
    </div>
  );
}
