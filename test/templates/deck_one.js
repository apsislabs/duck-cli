import { Card, Circle, Group, RichText } from "duck-cli";
import React from "react";

export default ({ color }) => (
  <Card>
    <Group>
      <Circle cx={425} cy={125} r={150} fill={color} clipPath="url(#safe)" />

      <RichText x={75} y={300} width="700" height="400">
        In publishing and graphic design, lorem ipsum is a placeholder text used
        to demonstrate the visual form of a <b>document</b> without relying on
        meaningful content. Replacing the actual content with placeholder text
        allows designers to design the form of the content before the content
        itself has been produced.
      </RichText>
    </Group>
  </Card>
);
