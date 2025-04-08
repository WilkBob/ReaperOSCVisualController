import { Button } from "@mui/material";
import React from "react";
import useLearnParam from "../useLearnParam";

const LearnButton = ({ updateParameter, param }) => {
  const { learn, isLearning } = useLearnParam();
  return (
    <Button
      fullWidth
      variant={isLearning ? "outlined" : "contained"}
      color={isLearning ? "warning" : "secondary"}
      sx={{
        height: "100%",
      }}
      onClick={async () => {
        const result = await learn(param.trackNum, param.fxNum);
        if (result) {
          updateParameter("type", result.type);
          updateParameter("trackNum", result.trackNum);
          updateParameter("fxNum", result.fxNum);
          updateParameter("paramNum", result.paramNum);
        }
      }}
    >
      {isLearning ? "🧠 Listening..." : "🔍 Learn"}
    </Button>
  );
};

export default LearnButton;
