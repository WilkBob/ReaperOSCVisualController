import { Button, Tooltip } from "@mui/material";
import React from "react";
import useLearnParam from "../../Hooks/useLearnParam";

const LearnButton = ({ setParamNum, param, index }) => {
  const { learn, cancel, isLearning, waiting } = useLearnParam();

  return (
    <Tooltip
      title={
        waiting
          ? "Click to cancel"
          : isLearning
          ? "Click to Cancel jiggle the slider in Reaper on the specified fxNum and trackNum."
          : "Click to learn a parameter - Wait 5 seconds, then jiggle the slider in Reaper on the specified fxNum and trackNum."
      }
      enterDelay={2000}
    >
      <Button
        sx={{
          height: "100%",
        }}
        variant={isLearning ? "outlined" : "contained"}
        color={isLearning ? "warning" : "secondary"}
        onClick={async () => {
          if (isLearning) {
            cancel();
          } else {
            const result = await learn(param.trackNum, param.fxNum, index);
            if (result) {
              setParamNum(result.paramNum);
            }
          }
        }}
      >
        {isLearning
          ? waiting
            ? "⏳ Waiting..."
            : "🧠 Listening..."
          : "🔍 Learn"}
      </Button>
    </Tooltip>
  );
};

export default LearnButton;
