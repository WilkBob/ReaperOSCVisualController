import { useRef } from "react";
import { sendValue } from "../API/oscService";
const Canvas = (params) => {
  const xRatio = useRef(0);
  const yRatio = useRef(0);
  const distance = useRef(0);
  const ballVelocity = useRef(0);
  return <div></div>;
};

export default Canvas;

//measurables - mouse-x, mouse-y, distance from center, - velocity of bouncing ball with drag and accelaration on impact with edges
