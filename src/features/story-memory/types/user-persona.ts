export type UserPersonaGender = "female" | "male" | "neutral" | "infer";

export type UserPersonaDraft = {
  boundaries: string;
  cardFitNotes: string;
  connectionToCharacter: string;
  displayName: string;
  openingAngle: string;
  roleInStory: string;
  selfConcept: string;
  whatUserKnows: string;
};

export const emptyUserPersonaDraft: UserPersonaDraft = {
  boundaries: "",
  cardFitNotes: "",
  connectionToCharacter: "",
  displayName: "{{user}}",
  openingAngle: "",
  roleInStory: "",
  selfConcept: "",
  whatUserKnows: "",
};
