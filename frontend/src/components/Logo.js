import React from 'react';

const Logo = ({ w, h }) => {
  return (
    <img
      src="/stem.png"
      alt="Logo"
      style={{
        width: w ? w : '100%',   // use prop if provided, else full width
        height: h ? h : 'auto',  // keep aspect ratio
        maxWidth: '300px',       // optional: limit maximum size
        display: 'block'
      }}
    />
  );
};

export default Logo;

