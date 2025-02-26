import PropTypes from 'prop-types';

const IconButton = ({ icon, onClick, ariaLabel }): JSX.Element => {
  return (
    <button onClick={onClick} aria-label={ariaLabel} className="iconButton">
      {icon}
    </button>
  );
};

IconButton.propTypes = {
  icon: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string.isRequired
};

export default IconButton;
