export interface KeywordMapping {
  nullscript: string;
  javascript: string;
  category: KeywordCategory;
  description: string;
  syntax?: string;
  example?: string;
}

export enum KeywordCategory {
  CONTROL_FLOW = "Control Flow",
  VARIABLES = "Variables & Declarations",
  FUNCTIONS = "Functions & Methods",
  OPERATORS = "Operators",
  TYPES = "Types & Classes",
  CONSOLE = "Console Methods",
  GLOBAL_OBJECTS = "Global Objects",
  GLOBAL_FUNCTIONS = "Global Functions",
  TIMING = "Timing Functions",
  BOOLEAN = "Boolean Values",
  MODULES = "Modules & Imports",
  ERROR_HANDLING = "Error Handling",
  OBJECT_ORIENTED = "Object-Oriented",
  ASYNC = "Async/Await",
  UTILITY = "Utility",
}
