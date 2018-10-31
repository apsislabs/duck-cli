const rules = [
  {
    regex: /(\*\*|__)(.*?)\1/g,
    replacement:
      "<tspan dominant-baseline='no-change' font-weight='bold'>$2</tspan>"
  },
  {
    regex: /(\*|_)(.*?)\1/g,
    replacement:
      "<tspandominantBaseline dominant-baseline='no-change' font-style='italic'>$2</tspan>"
  },
  {
    regex: /\~\~(.*?)\~\~/g,
    replacement:
      "<tspandominantBaseline dominant-baseline='no-change' text-decoration='line-through'>$1</tspan>"
  }
];

export const downvg = text => {
  text = "\n" + text + "\n";

  rules.forEach(function(rule) {
    text = text.replace(rule.regex, rule.replacement);
  });

  return text.trim();
};
