export const getUsersData = (userId, userData) => {
  const [user] = userData?.users?.filter((user) => {
    return user.id === userId;
  });
  return user;
};
