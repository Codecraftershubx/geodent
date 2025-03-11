import { capitalCase, noCase, sentenceCase } from "change-case";

export default {
  titleCase: (input: string, options = {}): string =>
    capitalCase(input, options),
  lowerCase: (input: string, options = {}): string => noCase(input, options),
  sentenceCase: (input: string, options = {}): string =>
    sentenceCase(input, options),
  upperCase: (input: string): string => input.toUpperCase,
};
