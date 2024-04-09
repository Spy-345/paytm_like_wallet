import PropTypes from "prop-types";
export default function Button({ label, onClick }) {
  return (
    <button
      className='w-full bg-black text-white rounded-lg my-2 mx-auto'
      onClick={onClick}
    >
      {label}
    </button>
  );
}

//Prop Types for Button component
Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
