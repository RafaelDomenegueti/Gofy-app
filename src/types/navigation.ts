export type RootStackParamList = {
  HomeStack: undefined;
  ContentFormStack: undefined;
  Login: undefined;
  Register: undefined;
};

export type HomeStackParamList = {
  Main: {
    screen?: 'home' | 'community' | 'settings';
  };
};

export type ContentFormStackParamList = {
  ContentForm: undefined;
  EditProfile: undefined;
  ChangePassword: undefined;
};
