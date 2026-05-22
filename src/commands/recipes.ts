import * as p from "@clack/prompts";
import { getAutomationClient } from "../automation/client.js";
import { formatKernelError } from "../kernel/errors.js";

export interface RecipesOptions {
  json?: boolean;
}

export async function recipes(options: RecipesOptions): Promise<void> {
  if (!options.json) {
    p.intro("Crono recipes");
  }

  const s = options.json ? null : p.spinner();
  s?.start("Connecting...");

  try {
    const client = await getAutomationClient();
    const list = await client.getRecipes((msg) => s?.message(msg));

    s?.stop("Done.");

    if (options.json) {
      console.log(JSON.stringify(list, null, 2));
    } else {
      if (list.length === 0) {
        p.outro("No custom recipes found.");
      } else {
        for (const recipe of list) {
          p.log.info(recipe.name);
        }
        p.outro(`${list.length} recipe${list.length === 1 ? "" : "s"}`);
      }
    }
  } catch (error) {
    s?.stop("Failed.");
    p.log.error(`Failed to read recipes: ${formatKernelError(error)}`);
    process.exit(1);
  }
}
