import React from 'react';



const PlusIcon = (props) => (
  <svg className="icon icon-plus"
       viewBox="0 0 100 100"
       onClick={props.handleClick}>
    <path d="M100 56.516H56.125V100h-12.64V56.516H0v-12.64h43.484V0h12.64v43.875H100"/>
  </svg>
);



export default PlusIcon;
