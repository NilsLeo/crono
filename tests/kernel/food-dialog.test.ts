import { describe, expect, it } from "vitest";
import { buildFoodDialogCode } from "../../src/kernel/food-dialog.js";

describe("buildFoodDialogCode", () => {
  it("should search and click the exact matching visible result", () => {
    const code = buildFoodDialogCode();
    expect(code).toContain("page.locator('tr')");
    expect(code).toContain("description !== foodName");
    expect(code).toContain("dialog stayed open");
  });

  it("should optionally update serving size", () => {
    const code = buildFoodDialogCode({ updateServingSize: true });
    expect(code).toContain("servingCount !== 1");
    expect(code).toContain("could not update serving size");
  });

  it("should optionally always update serving size", () => {
    const code = buildFoodDialogCode({
      alwaysUpdateServingSize: true,
      servingCountVar: "macro.grams",
      updateServingSize: true,
    });
    expect(code).toContain("if (true)");
    expect(code).toContain("macro.grams");
  });

  it("should optionally verify dialog dismissal", () => {
    const code = buildFoodDialogCode({
      itemNameVar: "macro.name",
      verifyDialogDismissed: true,
    });
    expect(code).toContain("dialogDismissed");
    expect(code).toContain("macro.name");
  });

  it("should prefix errors when requested", () => {
    const code = buildFoodDialogCode({ errorPrefix: "Food created but " });
    expect(code).toContain("Food created but could not find");
  });
});
