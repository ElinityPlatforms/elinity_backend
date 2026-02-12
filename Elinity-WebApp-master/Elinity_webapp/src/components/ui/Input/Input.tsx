import React, { type InputHTMLAttributes, forwardRef } from 'react';
import './Input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
    multiline?: boolean;
    rows?: number;
}

const Input = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputProps>(({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = false,
    multiline = false,
    className = '',
    ...props
}, ref) => {
    const containerClasses = ['input-container', fullWidth && 'input-full', className].filter(Boolean).join(' ');
    const inputClasses = ['input', error && 'input-error', leftIcon && 'input-with-left-icon', rightIcon && 'input-with-right-icon'].filter(Boolean).join(' ');

    return (
        <div className={containerClasses}>
            {label && <label className="input-label">{label}</label>}
            <div className="input-wrapper">
                {leftIcon && <span className="input-icon-left">{leftIcon}</span>}
                {multiline ? (
                    <textarea
                        ref={ref as any}
                        className={inputClasses}
                        {...(props as any)}
                    />
                ) : (
                    <input
                        ref={ref as any}
                        className={inputClasses}
                        {...props}
                    />
                )}
                {rightIcon && <span className="input-icon-right">{rightIcon}</span>}
            </div>
            {error && <span className="input-error-text">{error}</span>}
            {helperText && !error && <span className="input-helper-text">{helperText}</span>}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
