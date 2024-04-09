import PropTypes from "prop-types";

export default function Subheading({ label }) {
  return <div className='font-medium w-2/3'>{label}</div>;
}

//Prop Types for Subheading component
Subheading.propTypes = {
  label: PropTypes.string,
};
