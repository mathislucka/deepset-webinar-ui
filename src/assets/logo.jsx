export const Logo = ({ width = '100%', height = '100%', className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 26 22" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        fillRule="evenodd" 
        clipRule="evenodd" 
        d="M0 0.375H15.426V11.6016H25.3092V14.1017H15.426V17.2857H12.9259V14.1017H0V0.375ZM12.9259 11.6016V2.87515H2.50015V11.6016H12.9259Z" 
        fill="#071233"
      />
      <path 
        d="M15.592 20.3043C15.592 21.0337 15.0006 21.6251 14.2711 21.6251C13.5416 21.6251 12.9502 21.0337 12.9502 20.3043C12.9502 19.5748 13.5416 18.9835 14.2711 18.9835C15.0006 18.9835 15.592 19.5748 15.592 20.3043Z" 
        fill="currentColor"
      />
    </svg>
  );
};

export default Logo;