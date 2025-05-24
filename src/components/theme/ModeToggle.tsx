import { Moon, Sun } from "lucide-react";
import { useDispatch } from "react-redux"; // Import useDispatch

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// import { setTheme as dispatchSetTheme } from "./themeSlice"; // Import your action
import { setTheme as dispatchSetTheme } from "@/redux/slice/themeSlice";

export function ModeToggle() {
  const dispatch = useDispatch(); // Get the dispatch function

  // You might still want to use a theme provider for initial setup
  // or if other non-Redux parts of your app need it.
  // For a pure Redux approach, the logic in themeSlice handles applying the theme.

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => dispatch(dispatchSetTheme("light"))}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch(dispatchSetTheme("dark"))}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => dispatch(dispatchSetTheme("system"))}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
