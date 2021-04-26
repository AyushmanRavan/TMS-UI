interface Menu {
  title: string;
  link: string;
  icon: string;
  expand: boolean;
  items?: any[];
  options: { exact: boolean };
}

const PLANT_DATA: string[] = ["Mumbai"];

const DEPARTMENT_DATA: string[] = [
  "Production",
  "Packaging",
  "Energy Management"
];

const MACHINE_NAME: string[] = [
  'Assembly1',
  'Assembly2'
];

const MACHINE_DATA: string[] = [
  "Pakona 58 Head 1",
  "Pakona 58 Head 2",
  "Kliklok 60 Head 1",
  "Kliklok 60 Head 2",
  "Kliklok 60 Head 3",
  "Cartoner 58",
  "Kliklok 60", 
  "JetPack",
  "EnergyPack"
];


/* for PMS Machine */
const PMS_DASHBOARD_MENU_ITEMS: Menu[] = [
  // {
  //   title: "Home",
  //   link: "/dashboard",
  //   icon: "home",
  //   expand: false,
  //   options: { exact: true }
  // },
  {
    title: "Dashboard",
    link: "/dashboard/report/batch-dashboard",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
  {
    title: "BatchStatus",
    link: "/dashboard/BatchStatus",
    icon: "insert_chart",
    expand: false,
    options: { exact: false }
  },
];

const PMS_REPORT_MENU_ITEM: Menu[] = [{
  title: "Reports",
  link: "/dashboard/report",
  icon: "report",
  expand: true,
  items: [
    {
      title: "Batch report",
      link: "/dashboard/report/batch-report",
      icon: "settings_input_svideo",
      expand: false,
      options: { exact: false }
    },
  ],
  options: { exact: false }
}];

const PMS_CONFIGURATION_MENU_ITEMS: Menu[] = [
  {
    title: "Configurations",
    link: "/dashboard/confg",
    icon: "settings_applications",
    expand: true,
    items: [
      {
        var: "paramConfig"
      }
    ],
    options: { exact: false }
  }
];


const DASHBOARD_BOX_DETAILS = {
  PCC_DASHBOARD: {
    FIRST_BOX: {
      TITLE: 'Monitoring Parameters',
      FIRST_BOX_KEY_1: 'Voltage',
      FIRST_BOX_KEY_2: 'Current',
      FIRST_BOX_KEY_3: 'Frequency'
    },
    SECOND_BOX: {
      TITLE: 'Power Data',
      SECOND_BOX_KEY_1: 'Active Power',
      SECOND_BOX_KEY_2: 'Reactive Power',
      SECOND_BOX_KEY_3: 'Apparant Power',
      SECOND_BOX_KEY_4: 'Power Factor'
    },
    THIRD_BOX: {
      TITLE: 'Phasewise Data',
      THIRD_BOX_KEY_1: 'R-Phase Load',
      THIRD_BOX_KEY_2: 'Y-Phase Load',
      THIRD_BOX_KEY_3: 'B-Phase Load'
    },
    FOURTH_BOX: {
      TITLE: 'Demand Data',
      FOURTH_BOX_KEY_1: 'Peak Demand',
      FOURTH_BOX_KEY_2: 'Apparent Power Demand'
    }
  },

  MCC_DASHBOARD: {
    FIRST_BOX: {
      TITLE: 'Monitoring Parameters',
      FIRST_BOX_KEY_1: 'Voltage',
      FIRST_BOX_KEY_2: 'Current',
      FIRST_BOX_KEY_3: 'Frequency'
    },
    SECOND_BOX: {
      TITLE: 'Power Consumption',
      SECOND_BOX_KEY_1: 'Active Power',
      SECOND_BOX_KEY_2: 'Reactive Power',
      SECOND_BOX_KEY_3: 'Apparant Power'
    },
    THIRD_BOX: {
      TITLE: 'Power Quality Data',
      THIRD_BOX_KEY_1: 'Power Data',
      THIRD_BOX_KEY_2: 'THD'
    },
    FOURTH_BOX: {
      TITLE: 'Demand Analysis',
      FOURTH_BOX_KEY_1: 'Average Demand',
      FOURTH_BOX_KEY_2: 'Peak Demand',
      FIRST_BOX_KEY_3: 'Demand'
    }
  }
};

const ROLES = {
  PARTICIPANT: "PARTICIPANT",
  USER: "USER",
  ADMIN: "ADMIN",
  SUPERADMIN: "SUPERADMIN"
};

const INTERVAL_TIME: number = 100000;
const HIDE_ACCESS_DETAILS = false;

export {
  Menu,
  ROLES,

  PLANT_DATA,
  DEPARTMENT_DATA,
  MACHINE_NAME,
  MACHINE_DATA,

  PMS_DASHBOARD_MENU_ITEMS,
  PMS_REPORT_MENU_ITEM,
  PMS_CONFIGURATION_MENU_ITEMS,

  DASHBOARD_BOX_DETAILS,
  INTERVAL_TIME,
  HIDE_ACCESS_DETAILS
};
