import React from "react";
import { Overlay } from "./Overlay";
import { asset } from "../lib/assetPath";

export const Proof = ({ children }) => (
  <React.Fragment>{process.env.PROOF ? children : null}</React.Fragment>
);

export const ProofWrapper = ({ overlay, children, ...props }) => (
  <div {...props}>
    <Proof>
      <Overlay>{overlay && <img src={asset(overlay)} />}</Overlay>
    </Proof>

    {children}
  </div>
);
