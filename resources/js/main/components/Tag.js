import React from 'react'

const Tag = (props) => {
  const { children } = props;
  return <span className='tag'>{children}</span>
};

export default Tag;
