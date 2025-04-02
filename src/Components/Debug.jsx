import React from "react";
export function Debug({ params, useX, useY, useBall, controlAddresses }) {
  return (
    <div className="debug-info">
      <h3>Control Types</h3>
      <ul>
        {params.map((param, index) => (
          <li key={index}>{param.controlType}</li>
        ))}
      </ul>
      <h3>Control States</h3>
      <p>Use X: {useX ? "True" : "False"}</p>
      <p>Use Y: {useY ? "True" : "False"}</p>
      <p>Use Ball: {useBall ? "True" : "False"}</p>
      <h3>Control Addresses</h3>
      <ul>
        <li>
          <strong>Mouse X:</strong>{" "}
          {controlAddresses["mouse-x"].map((a) => a.address).join(", ")}
        </li>
        <li>
          <strong>Mouse Y:</strong>{" "}
          {controlAddresses["mouse-y"].map((a) => a.address).join(", ")}
        </li>
        <li>
          <strong>Ball:</strong>{" "}
          {controlAddresses["ball"].map((a) => a.address).join(", ")}
        </li>
      </ul>
    </div>
  );
}
