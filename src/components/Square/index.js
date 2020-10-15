import React from 'react';
function Square({ value, onClick, highlight }) {
    const className = "square" + (highlight ? " winner" : "");
    return ( <button className = { className }
        onClick = { onClick } > { value } </button>
    );
}
export default Square;
