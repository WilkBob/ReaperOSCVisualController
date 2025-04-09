import { useState, useEffect } from "react";
import { learnNextParam, cancelLearn } from "../API/oscService";

const useLearnParam = () => {
  const [isLearning, setIsLearning] = useState(false);
  const [waiting, setWaiting] = useState(false); // when learn is called, call learnNextParam, and set waiting to true, after 5 seconds, set waiting to false, as the server is now ready

  const learn = async (trackHint = null, fxHint = null) => {
    setIsLearning(true);
    setWaiting(true);
    try {
      // Reset waiting after 5 seconds
      setTimeout(() => setWaiting(false), 5000);
      const result = await learnNextParam(trackHint, fxHint);
      return result;
    } finally {
      setIsLearning(false);
    }
  };

  const cancel = () => {
    if (isLearning) {
      cancelLearn();
      setIsLearning(false);
      setWaiting(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (isLearning) {
        cancelLearn();
      }
    };
  }, [isLearning]);

  return { learn, cancel, isLearning, waiting };
};

export default useLearnParam;
