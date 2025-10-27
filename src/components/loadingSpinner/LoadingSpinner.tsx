import React from "react";
import { BarLoader } from "react-spinners";

function LoadingSpinner() {
  return (
    <BarLoader
      color={"rgb(254, 186, 69)"}
      loading={true}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
}

export default LoadingSpinner;
