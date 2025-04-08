import { Button, Tooltip } from "@mui/material";
import React from "react";
import useLearnParam from "../useLearnParam";

const LearnButton = ({ updateParameter, param }) => {
  const { learn, isLearning } = useLearnParam();
  return (
    <Tooltip
      title={
        "Click to learn a parameter - Wait 5 seconds, then jiggle the slider in Reaper on the specified fxNum and trackNum."
      }
      enterDelay={2000}
    >
      <Button
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
    </Tooltip>
  );
};

export default LearnButton;
