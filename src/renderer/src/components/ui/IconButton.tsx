interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  ariaLabel: string;
}

const IconButton = ({ icon, onClick, ariaLabel }: IconButtonProps): JSX.Element => {
  return (
    <button onClick={onClick} aria-label={ariaLabel} className="iconButton">
      {icon}
    </button>
  );
};

export default IconButton;
