import { useCallback } from "react";
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from "react";
import "./ApiCallButton.component.css";

type ComponentProps = {
  api?: () => Promise<any>;
} & Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "onClick">;

function ApiCallButton({ api, children, className, ...props }: ComponentProps) {
  const [isAwaitingResponse, setIsAwaitingResponse] = useState(false);

  const onClick = useCallback(async () => {
    if (api === undefined) return;
    if (isAwaitingResponse) return;
    setIsAwaitingResponse(true);
    try {
      await api();
    } catch {}
    setIsAwaitingResponse(false);
  }, [api, isAwaitingResponse]);

  let classes = "api-button";
  if (className !== undefined) classes += ` ${className}`;
  if (isAwaitingResponse) classes += " waiting";

  return (
    <button {...props} onClick={onClick} className={classes}>
      <div>{children}</div>
      {!isAwaitingResponse || <div className="circle" />}
    </button>
  );
}

export default ApiCallButton;
