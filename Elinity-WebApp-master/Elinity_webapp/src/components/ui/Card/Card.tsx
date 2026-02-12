import React, { HTMLAttributes } from 'react';
import './Card.css';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'glass' | 'elevated';
    hoverable?: boolean;
    clickable?: boolean;
}

const Card: React.FC<CardProps> = ({
    children,
    variant = 'glass',
    hoverable = false,
    clickable = false,
    className = '',
    ...props
}) => {
    const classes = [
        'card',
        `card-${variant}`,
        hoverable && 'card-hoverable',
        clickable && 'card-clickable',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
