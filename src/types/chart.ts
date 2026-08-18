export interface SeriesData {
  data: number[];
  label: string;
  id: string;
  color: string;
  visible: boolean;
}

export interface CustomTooltipProps {
  counter: number | string;
  groupLabel: string;
  label: string;
}
