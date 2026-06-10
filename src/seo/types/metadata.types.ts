export type TitleConfig = {
  pattern: string;
  maxLength: number;
  minLength: number;
};

export type DescriptionConfig = {
  pattern: string;
  maxLength: number;
  minLength: number;
  mustInclude: string[];
};
