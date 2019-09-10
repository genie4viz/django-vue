export const checkIfOwner = (username, routeParams) => {
  return username === routeParams.username
}
