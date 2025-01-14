export type MenuItem = {
  title: string;
  url: string;
  icon: any;
  submenu?: {
    title: string;
    url: string;
    description?: string;
  }[];
};
