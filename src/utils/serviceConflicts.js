export const serviceConflictGroups = [
  {
    name: "gym-access",
    services: ["Gym per Session", "Gym per Month", "Gym + Treadmill"],
  },
  {
    name: "treadmill",
    services: ["Monthly Treadmill", "Gym + Treadmill"],
  },
  {
    name: "personal-instructor",
    services: ["P.I per Month", "P.I per Session"],
  },
  {
    name: "dance-studio",
    services: ["Dance Studio for Student", "Dance Studio for Regular"],
  },
  {
    name: "taekwondo",
    services: ["Taekwando per Session", "Taekwando per Month"],
  },
];

export const checkServiceConflict = (cartItems, newService) => {
  // Find all groups that contain the new service
  const serviceGroups = serviceConflictGroups.filter((group) =>
    group.services.includes(newService.name)
  );

  if (serviceGroups.length === 0) return false;

  // Check conflicts across all relevant groups
  return cartItems.some((cartItem) =>
    serviceGroups.some(
      (group) =>
        group.services.includes(cartItem.name) &&
        cartItem.name !== newService.name
    )
  );
};
