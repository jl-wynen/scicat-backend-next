export enum Action {
  Manage = "manage",
  Create = "create",
  Read = "read",
  ReadOwn = "readown",
  ReadAll = "readall",
  Update = "update",
  Delete = "delete",
  ListOwn = "listown",
  ListAll = "listall",
  // Users actions
  UserReadOwn = "user_read_own",
  UserReadAny = "user_read_any",
  UserCreateOwn = "user_create_own",
  UserCreateAny = "user_create_any",
  UserUpdateOwn = "user_update_own",
  UserUpdateAny = "user_update_any",
  UserDeleteOwn = "user_update_own",
  UserDeleteAny = "user_update_any",
  UserCreateJwt = "user_create_jwt"
}
