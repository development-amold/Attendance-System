// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  BASE_URL: 'http://localhost:4000',
  API_ENDPOINT: {
    login: "login",
    logout: "logout",
    employees: "employees",
    addEmployee: "addEmployee",
    deleteEmployee: "deleteEmployee",
    userActivation: "userActivation",
    addAttendance: "login_records_add",
    viewAttendance: "get_login_record",
    editAttendance: "edit_login_record",
    updateAttendance: "update_login_record",
    login_records: "login_records",
    deleteLoginRecord: "deleteLoginRecord"

  }
};