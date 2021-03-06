import React from 'react';



const CaretIcon = (props) => (
  <svg className="icon icon-caret"
       viewBox="0 0 101 59"
       onClick={props.handleClick}>
    <path d="M100.602 50.352c0 .868-.334 1.636-1.002 2.304l-5.01 5.01c-.668.668-1.437 1.002-2.305 1.002-.868 0-1.637-.334-2.305-1.002l-39.378-39.38-39.38 39.38c-.667.668-1.435 1.002-2.304 1.002-.868 0-1.636-.334-2.304-1.002l-5.01-5.01C.936 51.988.602 51.22.602 50.352c0-.87.334-1.637 1.002-2.305L48.297 1.354C48.965.686 49.733.352 50.602.352c.868 0 1.636.334 2.304 1.002L99.6 48.047c.668.668 1.002 1.436 1.002 2.305z"/>
  </svg>
);



export default CaretIcon;
