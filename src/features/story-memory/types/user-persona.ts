export type UserPersonaGender = "female" | "male" | "neutral" | "infer";

export type UserPersonaDraft = {
  appearancePresentation: string;
  boundaries: string;
  cardFitNotes: string;
  compatibilityArchitecture: string;
  connectionToCharacter: string;
  displayName: string;
  interactionStyle: string;
  narrativeArc: string;
  openingAngle: string;
  psychologyInternalConflict: string;
  relationalBackstory: string;
  romanticIntimateDynamics: string;
  roleInStory: string;
  selfConcept: string;
  sceneOpportunities: string;
  tropeRelationshipWorldContext: string;
  voiceDialogue: string;
  whatUserKnows: string;
};

export const emptyUserPersonaDraft: UserPersonaDraft = {
  appearancePresentation: "",
  boundaries: "",
  cardFitNotes: "",
  compatibilityArchitecture: "",
  connectionToCharacter: "",
  displayName: "{{user}}",
  interactionStyle: "",
  narrativeArc: "",
  openingAngle: "",
  psychologyInternalConflict: "",
  relationalBackstory: "",
  romanticIntimateDynamics: "",
  roleInStory: "",
  selfConcept: "",
  sceneOpportunities: "",
  tropeRelationshipWorldContext: "",
  voiceDialogue: "",
  whatUserKnows: "",
};
