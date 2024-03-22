import { Link } from "react-router-dom";

export default function BottomWarning({ label, to, page }) {
  return (
    <div className='text-center'>
      <p>{label}</p>
      <Link to={to} className='text-slate-500 hover:text-blue-500 underline'>
        {page}
      </Link>
    </div>
  );
}
