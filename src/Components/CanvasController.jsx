import { useRef } from "react";

const CanvasController = ({ params, broadcasting }) => {
  const xRatio = useRef(0);
  const yRatio = useRef(0);
  const distance = useRef(0);
  const ballVelocity = useRef(0);
  return <div>{JSON.stringify(params)}</div>;
};

export default CanvasController;

//measurables - mouse-x, mouse-y, distance from center, - velocity of bouncing ball with drag and accelaration on impact with edges
