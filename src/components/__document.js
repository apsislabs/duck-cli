import React from "react";
import PropTypes from "prop-types";

const Document = ({ width, height, backgroundColor, children, ...props }) => (
  <html lang="en">
    <meta charSet="UTF-8" />
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    </head>
    <body style={{ backgroundColor }}>
      <div
        className="wrapper"
        style={{
          width,
          height,
          overflow: "hidden"
        }}
      >
        {children}
      </div>
    </body>
  </html>
);

Document.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  backgroundColor: PropTypes.string
};

export default Document;
