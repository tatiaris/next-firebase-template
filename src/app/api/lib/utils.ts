import { HttpStatus } from "@lib/constants";
import { addObjectToCollection } from "./firebase";
import { Timestamp } from "firebase/firestore";

export const handleError = (error, res) => {
  const errorObj = error as Error;
  const errorData = getErrorData(errorObj);
  if (errorData.code === 500) {
    console.error("handleError:", error);
    if (process.env.NODE_ENV === "production") {
      addObjectToCollection("errors", {
        name: errorObj.name,
        message: errorObj.message,
        stack: errorObj.stack,
        cause: errorObj.cause,
        timestamp: Timestamp.now(),
      });
    }
  }
  res
    .status(errorData.code)
    .json({ success: false, message: errorData.message, data: errorObj });
};

export const getErrorData = (error) => {
  try {
    const errMessageSplit = error.message.split(" - ");
    const code = parseInt(errMessageSplit[0]) || 500;
    const message = errMessageSplit[1];
    return { code, message };
  } catch (error) {
    return { code: 500, message: "Something went wrong on our side!" };
  }
};

export const errorResponse = (status: HttpStatus) => {
  return new Response(HttpStatus[status], { status });
}
