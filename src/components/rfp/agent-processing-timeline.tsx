"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PROCESSING_STEPS } from "@/lib/agent-api";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AgentProcessingTimeline({
  onComplete,
  steps = PROCESSING_STEPS,
  currentStep,
  title = "Intake Agent Processing",
  description = "Simulating AI agent extraction and routing workflow...",
}: {
  onComplete?: () => void;
  steps?: readonly string[];
  currentStep?: number;
  title?: string;
  description?: string;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const isControlled = currentStep !== undefined;
  const displayStep = isControlled ? currentStep : activeStep;

  useEffect(() => {
    if (isControlled || !onComplete) return;

    if (activeStep >= steps.length) {
      const timer = setTimeout(onComplete, 400);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, 550);

    return () => clearTimeout(timer);
  }, [activeStep, onComplete, isControlled, steps.length]);

  const progress = Math.min(
    100,
    Math.round((displayStep / steps.length) * 100)
  );

  return (
    <Card className="mx-auto max-w-2xl border-lavenderGrey shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-navy">
          <Loader2 className="h-5 w-5 animate-spin text-blue" />
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-2" />

        <ol className="space-y-3">
          {steps.map((step, index) => {
            const isComplete = index < displayStep;
            const isActive = index === displayStep && displayStep < steps.length;
            const isPending = index > displayStep;

            return (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-3 transition-all duration-300",
                  isComplete && "border-lightGreen/40 bg-lightGreen/10",
                  isActive && "border-blue/30 bg-lightBlue/20",
                  isPending && "border-lavenderGrey bg-white opacity-60"
                )}
              >
                {isComplete ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green" />
                ) : isActive ? (
                  <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue" />
                ) : (
                  <Circle className="h-5 w-5 shrink-0 text-lavenderGrey" />
                )}
                <span
                  className={cn(
                    "text-sm",
                    isComplete && "font-medium text-navy",
                    isActive && "font-semibold text-navy",
                    isPending && "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
