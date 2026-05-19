import { PersonaCardFormValues } from "../../types/persona/PersonaCardFormValues";

export function createEmptyPersonaCardFormValues(): PersonaCardFormValues {
  return {
    creationMode: "from_scratch",
    displayName: "{{user}}",
    age: "",
    gender: "",
    height: "",
    eyes: "",
    hair: "",
    body: "",
    aesthetic: "",
    appearance: "",
    outfit: "",
    personality: "",
    behaviour: "",
    speech: "",
    speechQuirks: "",
    exampleDialogue: "",
    intimacy: "",
    boundaries: "",
    notes:
      "Use these notes only as post-history impersonation support when the user explicitly asks for help writing as {{user}}. Do not feed them as normal in-scene facts.",
    tagsText: "",
    vibeTagsText: "",
    avatarImagePath: "",
    sourceCharacterName: "",
    sourceCharacterCardId: "",
    linkedCharacterName: "",
    linkedCharacterCardId: "",
    setAsCharacterDefault: false,
  };
}
