import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import FadeGradientToBottom from "./FadeGradientToBottom";
import FadeGradientToTop from "./FadeGradientToTop";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";
import Icons from "@/components/Icons";

const ErrorPage: React.FC<ErrorPagePropsType> = ({ title, body, details }) => {
  console.log("typeof details:", typeof details, details);
  return (
    <section className="min-h-[calc(100svh-120px)] gap-2 text-neutral-700">
      <div className="flex flex-col justify-start gap-2 px-5 w-full md:max-w-[500px] m-auto p-10 md:pt-30">
        <div>
          <h2 className="text-2xl md:text-3xl mb-3">
            <span className="italic font-bold">Opps!</span>&nbsp;
            {title ?? "Something went wrong"}
          </h2>
          <p className="text-neutral">{body ?? "We encountered an error"}</p>
        </div>
        <div>
          <Accordion type="single" collapsible className="w-full ">
            <AccordionItem value="error-details">
              <AccordionTrigger className="cursor-pointer">
                <span className="text-semibold">Details</span>
              </AccordionTrigger>
              <AccordionContent className="justify-self-start max-h-[240px] md:max-h-[300px] overflow-y-scroll border-neutral-200 rounded-bl-md rounded-br-md border-[0.1px] overflow-y-scroll w-full pb-0">
                <FadeGradientToBottom />
                <div className="text-xs flex flex-col px-5 wrap-anywhere text-wrap break-normal max-w-[100%]">
                  {details
                    ? details
                    : "No details available. Report this by sending us an email"}
                </div>
                <FadeGradientToTop />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <div className="mt-10">
            <Button
              asChild
              className="cursor-pointer bg-neutral-800 text-primary-foreground hover:bg-neutral-900"
            >
              <NavLink to={"/"}>
                <span>
                  <Icons.Home className="border-red-400" />
                </span>
                Return
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

type ErrorPagePropsType = {
  title?: string;
  body?: string;
  details?: string;
};

export default ErrorPage;
