import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * @param func delayedAction
 * @param options object of arguments to pass to func and the delay
 * @description Takes in a function and an object with arguments and delay.
 * It schedules the function to be executed after the delay with the arguments
 * passed to the function.
 */
export function delayedAction(
  func: (...args: any[]) => any,
  { args, delay = 300 }: { args: any[]; delay?: number }
) {
  setTimeout(() => {
    func(...args);
  }, delay);
}

/**
 * @func randomString Generates a random string of specified lenth
 * Defaults to 16 if not provided
 * @param length { number } the length of string to generate
 * @returns { string } string of `length`
 */
export function randomString(length: number = 16) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.?+=&^$!_%";
  const charsLen = chars.length;
  const buffer = new Uint8Array(length);
  window.crypto.getRandomValues(buffer);
  let res = "";
  for (let i = 0; i < length; i++) {
    res += chars.charCodeAt(buffer[i] % charsLen);
  }
  return res;
}
