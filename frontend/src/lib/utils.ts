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
  func: (...args: any[]) => void,
  { args, delay = 300 }: { args: any[]; delay?: number }
) {
  setTimeout(() => {
    func(...args);
  }, delay);
}
