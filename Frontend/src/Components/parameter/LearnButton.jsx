import { Button } from "@mui/material";
import React from "react";

const LearnButton = ({ isLearning, learn, updateParameter, param }) => {
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
