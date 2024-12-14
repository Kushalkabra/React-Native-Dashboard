export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Dashboard: undefined;
  AddUser: undefined;
  Analytics: {
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    deletedUsersCount: number;
  };
  RegistrationTrend: undefined;
  RegionalDistribution: undefined;
  EditUser: {
    user: User;
  };
}; 