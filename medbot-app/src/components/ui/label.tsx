import React from 'react';

interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
  htmlFor?: string;
}

const Label = React.forwardRef<HTMLLabelElement, LabelProps>(({ 
  children, 
  className = '', 
  htmlFor,
  ...props 
}, ref) => {
  const classes = `block text-sm font-medium text-foreground ${className}`;
  
  return (
    <label
      className={classes}
      htmlFor={htmlFor}
      ref={ref}
      {...props}
    >
      {children}
    </label>
  );
});

Label.displayName = 'Label';
export { Label }; 