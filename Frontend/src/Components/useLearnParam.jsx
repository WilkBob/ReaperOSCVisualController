import { useState } from "react";
import { learnNextParam } from "../API/oscService";

const useLearnParam = () => {
  const [isLearning, setIsLearning] = useState(false);

  const learn = async (trackHint = null, fxHint = null) => {
    setIsLearning(true);
    try {
      const result = await learnNextParam(trackHint, fxHint);
      return result;
    } finally {
      setIsLearning(false);
    }
  };

  return { learn, isLearning };
};

export default useLearnParam;
