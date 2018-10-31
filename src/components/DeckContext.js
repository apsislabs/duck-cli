import React from "react";

const DeckContext = React.createContext({});

export const DeckProvider = DeckContext.Provider;
export const DeckConsumer = DeckContext.Consumer;
