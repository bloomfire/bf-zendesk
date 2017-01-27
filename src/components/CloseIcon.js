import React from 'react';
import classNames from 'classnames';



const CloseIcon = (props) => {
  const classNameIcon = classNames(
    'icon',
    'icon-close',
    { active: props.active }
  );
  return (
    <svg className={classNameIcon} viewBox="0 0 101 101" onClick={props.handleClick}>
      <path d="M40.398 50.5L2.592 88.306c-2.79 2.79-2.79 7.312 0 10.102s7.312 2.79 10.102 0L50.5 60.602l37.806 37.806c2.79 2.79 7.312 2.79 10.102 0s2.79-7.312 0-10.102L60.602 50.5l37.806-37.806c2.79-2.79 2.79-7.312 0-10.102s-7.312-2.79-10.102 0L50.5 40.398 12.694 2.592c-2.79-2.79-7.312-2.79-10.102 0s-2.79 7.312 0 10.102L40.398 50.5z"/>
    </svg>
  );
};



export default CloseIcon;
