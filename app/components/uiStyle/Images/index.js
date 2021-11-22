import React from 'react'

const Image = props => {
    return (
        <img
            className={props.className ? props.className : null} {...props}
            alt={props.alt}
        />
    )
}
export default Image