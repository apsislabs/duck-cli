import fs, { existsSync } from "fs";
import inquirer from "inquirer";
import { safeDump } from "js-yaml";
import path from "path";
import pc from "picocolors";
import rimraf from "rimraf";
import { promisify } from "util";
import { CONF_FILE, TEMPLATE_FOLDER } from "../lib/constants.js";
import { printAndExit } from "../lib/utils/logger.js";
import { logInitHelp } from "./helps.js";

const ncp = import('ncp').ncp;

const askQuestions = () => {
  const questions = [
    {
      name: "NAME",
      type: "input",
      message: "What is the name of your first deck?",
      default: "deck"
    },
    {
      type: "list",
      name: "SIZE",
      message: "What is your card size?",
      choices: ["Poker", "Bridge", "Other"]
    },
    {
      type: "input",
      name: "WIDTH",
      message: "What is your card width?",
      default: "825",
      when: res => res.SIZE === "Other",
      filter: n => parseInt(n, 10)
    },
    {
      type: "input",
      name: "HEIGHT",
      message: "What is your card height?",
      default: "1125",
      when: res => res.SIZE === "Other",
      filter: n => parseInt(n, 10)
    },
    {
      type: "checkbox",
      name: "FORMATS",
      message: "What formats do you want to generate??",
      default: "svg",
      choices: [{ name: "svg", checked: true }, "png", "pdf"]
    }
  ];

  return inquirer.prompt(questions);
};

const touchSync = filename => fs.closeSync(fs.openSync(filename, "w"));

const getDefaultSizes = size => {
  switch (size) {
    case "Bridge":
      return { width: 750, height: 1125 };
    case "Poker":
    default:
      return { width: 825, height: 1125 };
  }
};

const getConfig = ({ NAME, SIZE, WIDTH, HEIGHT, FORMATS }) => {
  const defaultSizes = getDefaultSizes(SIZE);

  return {
    [`${NAME}`]: {
      width: WIDTH ? WIDTH : defaultSizes.width,
      height: HEIGHT ? HEIGHT : defaultSizes.height,
      format: FORMATS
    }
  };
};

const dirEmpty = path => {
  return (
    !existsSync(path) || (existsSync(path) && !fs.readdirSync(path).length)
  );
};

export const Init = async args => {
  if (args.help) {
    logInitHelp();
  }

  const examplePath = path.join(__dirname, "..", "..", "..", "examples");
  const destDir = path.resolve(args.path);
  console.log(pc.green(`Creating new deck in ${destDir}`));

  if (!dirEmpty(destDir)) {
    printAndExit(pc.red(`There's already a file at ${destDir}.`));
  }

  const answers = await askQuestions();

  try {
    await ncp(examplePath, destDir);
  } catch (err) {
    printAndExit(err);
  }

  const configPath = path.join(destDir, CONF_FILE);

  // Write config file
  fs.writeFileSync(configPath, safeDump(getConfig(answers)));

  // Rename example files
  fs.renameSync(
    path.join(destDir, "data", `example.csv`),
    path.join(destDir, "data", `${answers.NAME}.csv`)
  );

  fs.renameSync(
    path.join(destDir, TEMPLATE_FOLDER, `example.js`),
    path.join(destDir, TEMPLATE_FOLDER, `${answers.NAME}.js`)
  );

  // Cleanup
  const cleanupPaths = ["node_modules", "package-lock.json", "output"];
  cleanupPaths.forEach(p => {
    p = path.join(destDir, p);
    if (existsSync(p)) {
      rimraf.sync(p);
    }
  });

  printAndExit(`
    Your project is now set up and ready to go. To start, run the following commands:

    $ cd ${args.path}
    $ npm install
    $ npm run build
  `);
};
