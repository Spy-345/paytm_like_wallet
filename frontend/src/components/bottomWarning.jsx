import { Link } from "react-router-dom";
import PropTypes from "prop-types";

//Prop Types for BottomWarning component
BottomWarning.propTypes = {
  label: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
  page: PropTypes.string.isRequired,
};

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
