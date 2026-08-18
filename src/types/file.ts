export type FileDetails = {
  name: string;
  size: number;
  url: string;
};

export type FileType = File | FileDetails;
