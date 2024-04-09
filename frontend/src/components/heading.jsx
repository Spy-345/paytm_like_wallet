import PropTypes from "prop-types";
export default function Heading({ label }) {
  return <div className='font-bold text-2xl font-sans text-black'>{label}</div>;
}

//Prop Types for Heading component
Heading.propTypes = {
  label: PropTypes.string.isRequired,
};
