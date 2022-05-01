import React from "react";
import loading from "../static/loading.gif";

function Loading() {
  return (
    <img
      src={loading}
      alt="loading..."
      style={{ width: "200px", height: "200px" }}
    />
  );
}

export default Loading;
