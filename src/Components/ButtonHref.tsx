import * as React from 'react';

interface Props extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * A button that works as the href element in the original script
 * @param props See typescript
 */
function ButtonHref(props: Props) {
  const [hover, setHover] = React.useState(false);
  const { children, style, onMouseEnter, onMouseLeave, ...attributes } = props;
  const handleMouseEnter = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setHover(true);
      if (onMouseEnter) {
        onMouseEnter(event);
      }
    },
    [onMouseEnter]
  );
  const handleMouseLeave = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setHover(false);
      if (onMouseLeave) {
        onMouseLeave(event);
      }
    },
    [onMouseLeave]
  );

  return (
    <button
      type="button"
      style={{
        border: 'none',
        textDecoration: hover ? 'underline' : 'none',
        background: 'none',
        color: 'inherit',
        padding: '0px',
        marginLeft: '.3em',
        font: 'inherit',
        cursor: 'pointer',
        ...style,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...attributes}
    >
      {children}
    </button>
  );
}

export default ButtonHref;
