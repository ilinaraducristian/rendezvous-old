export const getUsersData = (userId, users) => {
  const [user] = users?.filter((user) => {
    return user.id === userId;
  });
  return user;
};
