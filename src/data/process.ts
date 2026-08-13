import { MessagesSquare, Lightbulb, PenTool, Code2, Rocket, type LucideIcon } from "lucide-react";

export type ProcessStep = {
  id: string;
  step: number;
  name: string;
  description: string;
  icon: LucideIcon;
};

/** The five-stage delivery cycle. Data-driven so copy/order can change without
 *  touching the layout. */
export const processSteps: ProcessStep[] = [
  {
    id: "discuss",
    step: 1,
    name: "Discuss",
    description: "Understanding your business, goals, and what success looks like.",
    icon: MessagesSquare,
  },
  {
    id: "ideas",
    step: 2,
    name: "Ideas",
    description: "Brainstorming concepts and strategy before anything gets built.",
    icon: Lightbulb,
  },
  {
    id: "design",
    step: 3,
    name: "Design",
    description: "Crafting the look, feel, and user experience.",
    icon: PenTool,
  },
  {
    id: "dev",
    step: 4,
    name: "Dev",
    description: "Building it out — clean, fast, and functional.",
    icon: Code2,
  },
  {
    id: "launch",
    step: 5,
    name: "Launch",
    description: "Shipping it live and handing over a site that works.",
    icon: Rocket,
  },
];
